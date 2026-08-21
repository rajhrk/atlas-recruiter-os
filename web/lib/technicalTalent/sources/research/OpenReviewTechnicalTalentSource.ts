"use strict";

// ============================================================
// Atlas Recruiter OS
// OpenReview Technical Talent Discovery Source
//
// Discovers research-oriented technical talent from public
// OpenReview submissions.
//
// Important:
// - Paper authorship is treated as a discovery signal.
// - Authorship does NOT automatically verify employment,
//   affiliation, seniority, or identity.
// - Cross-source identity resolution happens elsewhere.
// ============================================================

import type {
  DiscoveryConfidence,
  DiscoveryEvidenceType,
  DiscoverySourcingSignal,
  DiscoverySource,
  DiscoveryTalentType,
  DiscoveryTechnicalDomain,
  DiscoveryEvidence,
  DiscoveryPublication,
  DiscoverySkill,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentDiscoverySourceConfig,
  TechnicalTalentSourceCapabilities,
  TechnicalTalentSourceEvidence,
  TechnicalTalentSourceQuery,
  TechnicalTalentSourceResult,
} from "@/types/technicalTalentDiscoverySource";

const OPENREVIEW_API_BASE =
  "https://api2.openreview.net";

const OPENREVIEW_SOURCE =
  "OpenReview" as DiscoverySource;

const DEFAULT_LIMIT = 10;

const MAX_LIMIT = 25;

const OPENREVIEW_SOURCE_CAPABILITIES: TechnicalTalentSourceCapabilities =
  {
    identity: true,

    technicalProfile: true,

    skills: true,

    technologies: true,

    publications: true,

    repositories: false,

    openSource: false,

    conferences: true,

    education: false,

    researchProjects: true,

    locations: false,
  };

const OPENREVIEW_SOURCE_CONFIG: TechnicalTalentDiscoverySourceConfig =
  {
    source: OPENREVIEW_SOURCE,

    name: "OpenReview",

    description:
      "Research papers, submissions, authors, venues, keywords, and subject-area signals from public OpenReview records.",

    capabilities:
      OPENREVIEW_SOURCE_CAPABILITIES,

    enabled: true,
  };

interface OpenReviewContentField {
  value?: unknown;
}

interface OpenReviewNote {
  id: string;

  forum?: string;

  invitations?: string[];

  content?: Record<
    string,
    OpenReviewContentField | unknown
  >;

  cdate?: number;

  mdate?: number;

  pdate?: number;

  odate?: number;
}

interface OpenReviewSearchResponse {
  count?: number;

  notes?: OpenReviewNote[];
}

interface OpenReviewApiError {
  message?: string;

  name?: string;
}

function getContentValue(
  note: OpenReviewNote,
  fieldName: string,
): unknown {
  const field =
    note.content?.[fieldName];

  if (
    field &&
    typeof field === "object" &&
    "value" in field
  ) {
    return (
      field as OpenReviewContentField
    ).value;
  }

  return field;
}

function getStringContent(
  note: OpenReviewNote,
  fieldName: string,
): string | undefined {
  const value =
    getContentValue(
      note,
      fieldName,
    );

  if (
    typeof value !== "string"
  ) {
    return undefined;
  }

  const normalized =
    value.trim();

  return normalized || undefined;
}

function getStringArrayContent(
  note: OpenReviewNote,
  fieldName: string,
): string[] {
  const value =
    getContentValue(
      note,
      fieldName,
    );

  if (Array.isArray(value)) {
    return value
      .filter(
        (
          item,
        ): item is string =>
          typeof item ===
          "string",
      )
      .map((item) =>
        item.trim(),
      )
      .filter(Boolean);
  }

  if (
    typeof value === "string"
  ) {
    const normalized =
      value.trim();

    return normalized
      ? [normalized]
      : [];
  }

  return [];
}

function getAuthorNames(
  note: OpenReviewNote,
): string[] {
  const authors =
    getStringArrayContent(
      note,
      "authors",
    );

  return authors.filter(
    (author) =>
      author.trim() !==
        "" &&
      !/^anonymous$/i.test(
        author.trim(),
      ),
  );
}

function getVenue(
  note: OpenReviewNote,
): string | undefined {
  return (
    getStringContent(
      note,
      "venue",
    ) ??
    getStringContent(
      note,
      "venueid",
    )
  );
}

function getDateFromNote(
  note: OpenReviewNote,
): string | undefined {
  const timestamp =
    note.pdate ??
    note.odate ??
    note.cdate ??
    note.mdate;

  if (
    typeof timestamp !==
      "number" ||
    !Number.isFinite(timestamp)
  ) {
    return undefined;
  }

  return new Date(
    timestamp,
  ).toISOString();
}

function normalizeSearchTerms(
  query: TechnicalTalentDiscoveryQuery,
): string[] {
  return [
    ...(query.keywords ?? []),
    ...(query.researchAreas ?? []),
    ...(query.skills ?? []),
    ...(query.technologies ?? []),
  ]
    .map((value) =>
      value.trim(),
    )
    .filter(Boolean)
    .filter(
      (
        value,
        index,
        values,
      ) =>
        values.indexOf(
          value,
        ) === index,
    );
}

function classifyDomain(
  text: string,
  query: TechnicalTalentDiscoveryQuery,
): DiscoveryTechnicalDomain {
  const normalized =
    text.toLowerCase();

  if (
    /robot|slam|manipulation|navigation|autonomous|humanoid|grasp|locomotion|embodied/.test(
      normalized,
    )
  ) {
    return "Robotics";
  }

  if (
    /asic|fpga|silicon|semiconductor|chip|physical design|vlsi|verification|dft/.test(
      normalized,
    )
  ) {
    return "Semiconductor";
  }

  if (
    /embedded|firmware|hardware|microcontroller|rtos|fpga|sensor|antenna|embedded systems/.test(
      normalized,
    )
  ) {
    return "Hardware / Embedded";
  }

  if (
    /machine learning|deep learning|neural|transformer|computer vision|natural language|nlp|reinforcement learning|generative ai|foundation model|multimodal|llm|artificial intelligence/.test(
      normalized,
    )
  ) {
    return "AI / ML";
  }

  if (
    query.domains &&
    query.domains.length >
      0
  ) {
    return query.domains[0];
  }

  return "AI / ML";
}

function getSecondaryDomains(
  text: string,
  primaryDomain: DiscoveryTechnicalDomain,
): DiscoveryTechnicalDomain[] {
  const normalized =
    text.toLowerCase();

  const domains =
    new Set<DiscoveryTechnicalDomain>();

  if (
    /robot|slam|manipulation|navigation|autonomous|humanoid|grasp|locomotion|embodied/.test(
      normalized,
    )
  ) {
    domains.add("Robotics");
  }

  if (
    /machine learning|deep learning|neural|transformer|computer vision|natural language|nlp|reinforcement learning|generative ai|foundation model|multimodal|llm|artificial intelligence/.test(
      normalized,
    )
  ) {
    domains.add("AI / ML");
  }

  if (
    /embedded|firmware|hardware|microcontroller|rtos|sensor|antenna/.test(
      normalized,
    )
  ) {
    domains.add(
      "Hardware / Embedded",
    );
  }

  if (
    /asic|fpga|silicon|semiconductor|chip|physical design|vlsi|verification|dft/.test(
      normalized,
    )
  ) {
    domains.add(
      "Semiconductor",
    );
  }

  domains.delete(
    primaryDomain,
  );

  return Array.from(
    domains,
  );
}

function inferTalentType(
  text: string,
): DiscoveryTalentType {
  const normalized =
    text.toLowerCase();

  if (
    /phd|doctoral|dissertation/.test(
      normalized,
    )
  ) {
    return "PhD Researcher";
  }

  if (
    /robotics/.test(
      normalized,
    )
  ) {
    return "Robotics Engineer";
  }

  if (
    /machine learning|deep learning|ml engineer/.test(
      normalized,
    )
  ) {
    return "ML Engineer";
  }

  if (
    /research engineer/.test(
      normalized,
    )
  ) {
    return "Research Engineer";
  }

  return "Research Scientist";
}

function confidenceForPaper(
  title: string,
  abstract: string | undefined,
  authors: string[],
): DiscoveryConfidence {
  const text =
    [
      title,
      abstract ?? "",
    ]
      .join(" ")
      .toLowerCase();

  if (
    title.length > 30 &&
    abstract &&
    abstract.length >
      200 &&
    authors.length > 0
  ) {
    return "High";
  }

  if (
    title.length > 10 &&
    authors.length > 0
  ) {
    return "Medium";
  }

  return "Low";
}

function createEvidence(
  note: OpenReviewNote,
  title: string,
  abstract: string | undefined,
  venue: string | undefined,
  confidence: DiscoveryConfidence,
  authorName: string,
): DiscoveryEvidence {
  const evidenceType: DiscoveryEvidenceType =
    venue
      ? "Conference Paper"
      : "Publication";

  const evidenceId =
    [
      "openreview",
      note.id,
      authorName,
    ]
      .join(":")
      .replace(
        /\s+/g,
        "-",
      )
      .toLowerCase();

  return {
    id: evidenceId,

    type: evidenceType,

    source:
      OPENREVIEW_SOURCE,

    title,

    url:
      `https://openreview.net/forum?id=${encodeURIComponent(
        note.id,
      )}`,

    publisher:
      "OpenReview",

    organization:
      venue,

    date:
      getDateFromNote(
        note,
      ),

    description:
      abstract,

    confidence,

    supports: [
      "Research Activity",
      ...(venue
        ? [venue]
        : []),
    ],

    relevance:
      `OpenReview paper authored by ${authorName}${
        venue
          ? ` and associated with ${venue}`
          : ""
      }.`,
  };
}

function createPublication(
  note: OpenReviewNote,
  title: string,
  authors: string[],
  venue: string | undefined,
  abstract: string | undefined,
  evidenceId: string,
): DiscoveryPublication {
  const date =
    getDateFromNote(
      note,
    );

  const year =
    date
      ? Number(
          date.slice(0, 4),
        )
      : undefined;

  return {
    title,

    venue,

    year:
      Number.isFinite(year)
        ? year
        : undefined,

    authors,

    url:
      `https://openreview.net/forum?id=${encodeURIComponent(
        note.id,
      )}`,

    researchAreas: [
      ...getStringArrayContent(
        note,
        "keywords",
      ),
      ...getStringArrayContent(
        note,
        "subject_areas",
      ),
    ],

    evidenceId,
  };
}

function createResearchSignals(
  note: OpenReviewNote,
  title: string,
  venue: string | undefined,
  confidence: DiscoveryConfidence,
  evidenceId: string,
): DiscoverySourcingSignal[] {
  const signals: DiscoverySourcingSignal[] =
    [
      {
        type:
          "Publication",

        signal:
          "OpenReview publication",

        strength:
          confidence,

        evidenceIds: [
          evidenceId,
        ],

        explanation:
          `Research publication identified through OpenReview: ${title}.`,
      },
    ];

  if (venue) {
    signals.push({
      type:
        "Conference",

      signal:
        `OpenReview venue: ${venue}`,

      strength:
        "High",

      evidenceIds: [
        evidenceId,
      ],

      explanation:
        `The research work is associated with the OpenReview venue ${venue}.`,
    });
  }

  signals.push({
    type:
      "Research Activity",

    signal:
      "Active research publication signal",

    strength:
      confidence,

    evidenceIds: [
      evidenceId,
    ],

    explanation:
      `The author is associated with a public OpenReview research submission: ${title}.`,
  });

  return signals;
}

function createTechnicalSkills(
  query: TechnicalTalentDiscoveryQuery,
  text: string,
  keywords: string[],
  subjectAreas: string[],
  evidenceId: string,
): DiscoverySkill[] {
  const lowerText =
    text.toLowerCase();

  /*
   * Preserve explicitly requested technical terms first.
   *
   * These are the strongest query-derived signals because
   * they directly explain why the candidate was discovered.
   */
  const queryTerms =
    normalizeSearchTerms(
      query,
    );

  /*
   * OpenReview already provides structured technical/research
   * terminology through keywords and subject areas.
   *
   * Do not invent terminology here. Only promote terms that
   * actually exist in the source record.
   */
  const sourceTerms = [
    ...keywords,
    ...subjectAreas,
  ];

  const combinedTerms = [
    ...queryTerms,
    ...sourceTerms,
  ]
    .map(
      (term) =>
        term.trim(),
    )
    .filter(Boolean)
    .filter(
      (
        term,
        index,
        values,
      ) =>
        values.findIndex(
          (value) =>
            value.toLowerCase() ===
            term.toLowerCase(),
        ) === index,
    );

  return combinedTerms
    .filter(
      (term) =>
        lowerText.includes(
          term.toLowerCase(),
        ),
    )
    .slice(0, 20)
    .map(
      (
        term,
      ) => ({
        name: term,

        normalizedName:
          term
            .toLowerCase()
            .trim(),

        evidenceIds: [
          evidenceId,
        ],
      }),
    );
}

function createRecord(
  note: OpenReviewNote,
  authorName: string,
  authorIndex: number,
  query: TechnicalTalentDiscoveryQuery,
): {
  record: TechnicalTalentDiscoveryRecord;
  evidence: TechnicalTalentSourceEvidence;
} {
  const title =
    getStringContent(
      note,
      "title",
    ) ??
    "Untitled OpenReview submission";

  const abstract =
    getStringContent(
      note,
      "abstract",
    );

  const venue =
    getVenue(note);

  const keywords =
    getStringArrayContent(
      note,
      "keywords",
    );

  const subjectAreas =
    getStringArrayContent(
      note,
      "subject_areas",
    );

  const text =
    [
      title,
      abstract ?? "",
      ...keywords,
      ...subjectAreas,
      venue ?? "",
    ].join(" ");

  const primaryDomain =
    classifyDomain(
      text,
      query,
    );

  const secondaryDomains =
    getSecondaryDomains(
      text,
      primaryDomain,
    );

  const authors =
    getAuthorNames(note);

  const confidence =
    confidenceForPaper(
      title,
      abstract,
      authors,
    );

  const evidence =
    createEvidence(
      note,
      title,
      abstract,
      venue,
      confidence,
      authorName,
    );

  const publication =
    createPublication(
      note,
      title,
      authors,
      venue,
      abstract,
      evidence.id,
    );

  const sourcingSignals =
    createResearchSignals(
      note,
      title,
      venue,
      confidence,
      evidence.id,
    );

  const skills =
    createTechnicalSkills(
      query,
      text,
      keywords,
      subjectAreas,
      evidence.id,
    );

  const recordId =
    [
      "openreview",
      note.id,
      authorIndex,
    ].join(":");

  const record: TechnicalTalentDiscoveryRecord =
    {
      id: recordId,

      name:
        authorName,

      headline:
        venue
          ? `Research contributor — ${venue}`
          : "Research contributor",

      primaryDomain,

      secondaryDomains:
        secondaryDomains.length >
        0
          ? secondaryDomains
          : undefined,

      talentType:
        inferTalentType(
          text,
        ),

      roleFamily:
        "Research",

      normalizedRole:
        "Research Contributor",

      skills,

      technologies: [],

      researchAreas: Array.from(
        new Map(
          [
            ...keywords,
            ...subjectAreas,
          ]
            .map(
              (area) =>
                area.trim(),
            )
            .filter(Boolean)
            .map(
              (area) => [
                area.toLowerCase(),
                area,
              ] as const,
            ),
        ).values(),
      ),

      publications: [
        publication,
      ],

      evidence: [
        evidence,
      ],

      sourcingSignals,

      confidence,

      approvalStatus:
        "Unreviewed",

      sourceRecordIds: [
        recordId,
      ],

      firstDiscoveredAt:
        new Date().toISOString(),

      lastVerifiedAt:
        new Date().toISOString(),
    };

  const sourceEvidence:
    TechnicalTalentSourceEvidence =
    {
      source:
        OPENREVIEW_SOURCE,

      sourceRecordId:
        note.id,

      externalId:
        note.id,

      name:
        authorName,

      headline:
        title,

      url:
        `https://openreview.net/forum?id=${encodeURIComponent(
          note.id,
        )}`,

      title,

      description:
        abstract,

      organization:
        venue,

      publishedAt:
        getDateFromNote(
          note,
        ),

      metadata: {
        venue:
          venue ?? "",

        authorIndex,

        authorCount:
          authors.length,
      },

      rawSignals: [
        "OpenReview publication",
        ...(venue
          ? [
              `Venue: ${venue}`,
            ]
          : []),
        ...keywords.map(
          (keyword) =>
            `Keyword: ${keyword}`,
        ),
      ],

      confidence,
    };

  return {
    record,
    evidence:
      sourceEvidence,
  };
}

function buildSearchUrls(
  query: TechnicalTalentDiscoveryQuery,
): URL[] {
  const searchTerms =
    normalizeSearchTerms(
      query,
    );

  const conferences =
    query.conferences
      ?.map((value) =>
        value.trim(),
      )
      .filter(Boolean);

  const urls: URL[] = [];

  const searchUrl =
    new URL(
      `${OPENREVIEW_API_BASE}/notes/search`,
    );

  searchUrl.searchParams.set(
    "source",
    "forum",
  );

  searchUrl.searchParams.set(
    "content",
    "all",
  );

  searchUrl.searchParams.set(
    "type",
    "terms",
  );

  searchUrl.searchParams.set(
    "sort",
    "tmdate:desc",
  );

  searchUrl.searchParams.set(
    "limit",
    String(
      Math.min(
        query.keywords?.length
          ? MAX_LIMIT
          : DEFAULT_LIMIT,
        MAX_LIMIT,
      ),
    ),
  );

  searchUrl.searchParams.set(
    "count",
    "true",
  );

  if (
    searchTerms.length > 0
  ) {
    searchUrl.searchParams.set(
      "query",
      searchTerms.join(" "),
    );
  }

  if (
    conferences &&
    conferences.length === 1
  ) {
    searchUrl.searchParams.set(
      "venue",
      conferences[0],
    );
  }

  urls.push(searchUrl);

  return urls;
}

async function fetchOpenReview(
  url: URL,
): Promise<OpenReviewSearchResponse> {
  const response =
    await fetch(
      url.toString(),
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache: "no-store",
      },
    );

  if (!response.ok) {
    let message =
      `OpenReview request failed with HTTP ${response.status}.`;

    try {
      const body =
        (await response.json()) as
          | OpenReviewApiError
          | undefined;

      if (
        body?.message
      ) {
        message =
          body.message;
      }
    } catch {
      // Keep the HTTP error.
    }

    throw new Error(
      message,
    );
  }

  return (await response.json()) as
    OpenReviewSearchResponse;
}

export const openReviewTechnicalTalentSource: TechnicalTalentDiscoverySourceAdapter =
  {
    config:
      OPENREVIEW_SOURCE_CONFIG,

    async search(
      request: TechnicalTalentSourceQuery,
    ): Promise<TechnicalTalentSourceResult> {
      const urls =
        buildSearchUrls(
          request.query,
        );

      const responses =
        await Promise.all(
          urls.map(
            (url) =>
              fetchOpenReview(
                url,
              ),
          ),
        );

      const notes =
        responses.flatMap(
          (response) =>
            response.notes ?? [],
        );

      const dedupedNotes =
        Array.from(
          new Map(
            notes.map(
              (note) => [
                note.id,
                note,
              ],
            ),
          ).values(),
        );

      const records: TechnicalTalentDiscoveryRecord[] =
        [];

      const evidence: TechnicalTalentSourceEvidence[] =
        [];

      for (const note of dedupedNotes) {
        const authors =
          getAuthorNames(
            note,
          );

        if (
          authors.length ===
          0
        ) {
          continue;
        }

        authors.forEach(
          (
            authorName,
            authorIndex,
          ) => {
            const result =
              createRecord(
                note,
                authorName,
                authorIndex,
                request.query,
              );

            records.push(
              result.record,
            );

            evidence.push(
              result.evidence,
            );
          },
        );
      }

      const warnings: string[] =
        [];

      if (
        request.query.conferences &&
        request.query.conferences.length >
          1
      ) {
        warnings.push(
          "Multiple conference filters were supplied; the initial adapter applies the first conference filter. Multi-venue querying can be added in a later iteration.",
        );
      }

      if (
        dedupedNotes.length >
        0 &&
        records.length ===
          0
      ) {
        warnings.push(
          "OpenReview returned research notes, but no identifiable author names were available.",
        );
      }

      return {
        source:
          OPENREVIEW_SOURCE,

        query:
          request,

        records,

        evidence,

        total:
          records.length,

        hasMore:
          false,

        searchedAt:
          new Date().toISOString(),

        warnings:
          warnings.length >
          0
            ? warnings
            : undefined,
      };
    },
  };
