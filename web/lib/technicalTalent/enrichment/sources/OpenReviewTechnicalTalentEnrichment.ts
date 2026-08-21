"use strict";

// ============================================================
// Atlas Recruiter OS
// OpenReview Technical Talent Enrichment
//
// Enriches an already-resolved Atlas candidate from the exact
// OpenReview discovery record.
//
// Identity rule:
//   openreview:<noteId>:<authorIndex>
//
// This adapter NEVER searches OpenReview by candidate name.
// ============================================================

import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoveryEvidenceType,
  DiscoveryPublication,
  DiscoverySkill,
  DiscoverySourcingSignal,
  DiscoverySource,
  DiscoveryTechnology,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentEnrichmentAdapter,
  TechnicalTalentEnrichmentConfig,
  TechnicalTalentEnrichmentPatch,
  TechnicalTalentEnrichmentResult,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichment";

const OPENREVIEW_API_BASE =
  "https://api2.openreview.net";

const OPENREVIEW_SOURCE =
  "OpenReview" as DiscoverySource;

const OPENREVIEW_CAPABILITIES = {
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

const CONFIG:
  TechnicalTalentEnrichmentConfig = {
  source:
    OPENREVIEW_SOURCE,

  name:
    "OpenReview",

  description:
    "Enrich an existing Atlas technical talent record from the exact OpenReview submission, author position, publication, venue, keyword, and research evidence.",

  capabilities:
    OPENREVIEW_CAPABILITIES,

  enabled: true,
};

interface OpenReviewContentField {
  value?: unknown;
}

interface OpenReviewNote {
  id: string;

  forum?: string;

  content?: Record<
    string,
    OpenReviewContentField | unknown
  >;

  cdate?: number;

  mdate?: number;

  pdate?: number;

  odate?: number;
}

interface OpenReviewNotesResponse {
  notes?: OpenReviewNote[];
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
    typeof value !==
    "string"
  ) {
    return undefined;
  }

  const normalized =
    value.trim();

  return normalized ||
    undefined;
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

  if (
    Array.isArray(value)
  ) {
    return value
      .filter(
        (
          item,
        ): item is string =>
          typeof item ===
          "string",
      )
      .map(
        (item) =>
          item.trim(),
      )
      .filter(Boolean);
  }

  if (
    typeof value ===
    "string"
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
  return getStringArrayContent(
    note,
    "authors",
  ).filter(
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
    !Number.isFinite(
      timestamp,
    )
  ) {
    return undefined;
  }

  return new Date(
    timestamp,
  ).toISOString();
}

/**
 * Resolve the exact OpenReview discovery identity.
 *
 * Expected:
 *   openreview:<noteId>:<authorIndex>
 *
 * No candidate-name lookup is performed.
 */
function getOpenReviewIdentity(
  candidate: TechnicalTalentDiscoveryRecord,
):
  | {
      noteId: string;
      authorIndex: number;
    }
  | undefined {
  const candidates = [
    ...(candidate.sourceRecordIds ??
      []),
    candidate.id,
  ];

  for (
    const sourceId of
    candidates
  ) {
    const normalized =
      sourceId.trim();

    const match =
      normalized.match(
        /^openreview:([^:]+):(\d+)$/,
      );

    if (!match) {
      continue;
    }

    const authorIndex =
      Number(match[2]);

    if (
      !Number.isInteger(
        authorIndex,
      ) ||
      authorIndex < 0
    ) {
      continue;
    }

    return {
      noteId:
        match[1],

      authorIndex,
    };
  }

  return undefined;
}


function buildOpenReviewNoteFromCandidate(
  candidate: TechnicalTalentDiscoveryRecord,
  identity: {
    noteId: string;
    authorIndex: number;
  },
): OpenReviewNote | undefined {
  const publication =
    (candidate.publications ?? []).find(
      (item) =>
        item.url?.includes(
          `id=${identity.noteId}`,
        ),
    );

  if (!publication) {
    return undefined;
  }

  const sourceEvidence =
    (candidate.evidence ?? []).find(
      (item) =>
        item.source ===
          OPENREVIEW_SOURCE &&
        item.url?.includes(
          identity.noteId,
        ),
    );

  const title =
    publication.title?.trim();

  if (!title) {
    return undefined;
  }

  const authors =
    publication.authors ??
    [];

  return {
    id:
      identity.noteId,

    content: {
      title: {
        value:
          title,
      },

      abstract: {
        value:
          sourceEvidence?.description ??
          "",
      },

      venue: {
        value:
          publication.venue ??
          "",
      },

      keywords: {
        value:
          publication.researchAreas ??
          [],
      },

      subject_areas: {
        value:
          publication.researchAreas ??
          [],
      },

      authors: {
        value:
          authors,
      },
    },
  };
}

function extractTechnicalTerms(
  title: string,
  abstract: string | undefined,
  keywords: string[],
  subjectAreas: string[],
): string[] {
  const text =
    [
      title,
      abstract ?? "",
      ...keywords,
      ...subjectAreas,
    ]
      .join(" ")
      .toLowerCase();

  const knownTerms = [
    "machine learning",
    "deep learning",
    "reinforcement learning",
    "computer vision",
    "natural language processing",
    "natural language",
    "foundation models",
    "large language models",
    "llm",
    "transformer",
    "multimodal",
    "generative ai",
    "robotics",
    "robot manipulation",
    "robot perception",
    "motion planning",
    "slam",
    "autonomous systems",
    "embedded systems",
    "firmware",
    "computer architecture",
    "fpga",
    "asic",
    "semiconductor",
    "physical design",
    "verification",
    "control systems",
    "optimization",
  ];

  const structuredTerms = [
    ...keywords,
    ...subjectAreas,
  ];

  return Array.from(
    new Map(
      [
        ...knownTerms.filter(
          (term) =>
            text.includes(
              term,
            ),
        ),

        ...structuredTerms,
      ]
        .map(
          (term) =>
            term.trim(),
        )
        .filter(Boolean)
        .map(
          (term) => [
            term.toLowerCase(),
            term,
          ] as const,
        ),
    ).values(),
  ).slice(
    0,
    30,
  );
}

function confidenceForEvidence(
  title: string,
  abstract: string | undefined,
  authorName: string,
): DiscoveryConfidence {
  if (
    title.length > 30 &&
    Boolean(abstract) &&
    (abstract?.length ??
      0) > 200 &&
    authorName.length > 0
  ) {
    return "High";
  }

  if (
    title.length > 10 &&
    authorName.length > 0
  ) {
    return "Medium";
  }

  return "Low";
}

function buildEvidence(
  note: OpenReviewNote,
  title: string,
  abstract: string | undefined,
  venue: string | undefined,
  authorName: string,
  confidence: DiscoveryConfidence,
): DiscoveryEvidence {
  const type:
    DiscoveryEvidenceType =
    venue
      ? "Conference Paper"
      : "Publication";

  const evidenceId =
    `openreview-enrichment:${note.id}:${authorName}`
      .replace(
        /\s+/g,
        "-",
      )
      .toLowerCase();

  return {
    id:
      evidenceId,

    type,

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
      `OpenReview publication authored by ${authorName}.`,
  };
}

function buildPublication(
  note: OpenReviewNote,
  title: string,
  authors: string[],
  venue: string | undefined,
  keywords: string[],
  subjectAreas: string[],
  evidenceId: string,
): DiscoveryPublication {
  const date =
    getDateFromNote(
      note,
    );

  const year =
    date
      ? Number(
          date.slice(
            0,
            4,
          ),
        )
      : undefined;

  return {
    title,

    venue,

    year:
      Number.isFinite(
        year,
      )
        ? year
        : undefined,

    authors,

    url:
      `https://openreview.net/forum?id=${encodeURIComponent(
        note.id,
      )}`,

    researchAreas:
      Array.from(
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
      ).slice(
        0,
        25,
      ),

    evidenceId,
  };
}

function buildSkills(
  terms: string[],
  evidenceId: string,
): DiscoverySkill[] {
  return terms.map(
    (term) => ({
      name:
        term,

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

function buildTechnologies(
  terms: string[],
  evidenceId: string,
): DiscoveryTechnology[] {
  return terms.map(
    (term) => ({
      name:
        term,

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

function buildSourcingSignals(
  title: string,
  venue: string | undefined,
  confidence: DiscoveryConfidence,
  evidenceId: string,
): DiscoverySourcingSignal[] {
  const signals:
    DiscoverySourcingSignal[] =
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
          `Research publication: ${title}.`,
      },

      {
        type:
          "Research Activity",

        signal:
          "OpenReview research activity",

        strength:
          confidence,

        evidenceIds: [
          evidenceId,
        ],

        explanation:
          `The candidate is associated with the OpenReview research publication "${title}".`,
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
        `The publication is associated with ${venue}.`,
    });
  }

  return signals;
}

function buildPatch(
  note: OpenReviewNote,
  title: string,
  abstract: string | undefined,
  venue: string | undefined,
  keywords: string[],
  subjectAreas: string[],
  evidenceId: string,
  authors: string[],
  confidence: DiscoveryConfidence,
): TechnicalTalentEnrichmentPatch {
  const terms =
    extractTechnicalTerms(
      title,
      abstract,
      keywords,
      subjectAreas,
    );

  return {
    headline:
      venue
        ? `Research contributor — ${venue}`
        : "Research contributor",

    skills:
      buildSkills(
        terms,
        evidenceId,
      ),

    technologies:
      buildTechnologies(
        terms,
        evidenceId,
      ),

    researchAreas:
      Array.from(
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
      ).slice(
        0,
        25,
      ),

    publications: [
      buildPublication(
        note,
        title,
        authors,
        venue,
        keywords,
        subjectAreas,
        evidenceId,
      ),
    ],

    sourcingSignals:
      buildSourcingSignals(
        title,
        venue,
        confidence,
        evidenceId,
      ),
  };
}

export class OpenReviewTechnicalTalentEnrichment
  implements TechnicalTalentEnrichmentAdapter
{
  readonly config =
    CONFIG;

  async enrich(
    candidate: TechnicalTalentDiscoveryRecord,
  ): Promise<TechnicalTalentEnrichmentResult> {
    const identity =
      getOpenReviewIdentity(
        candidate,
      );

    if (!identity) {
      return {
        source:
          OPENREVIEW_SOURCE,

        candidateId:
          candidate.id,

        evidence: [],

        confidence:
          "Low",

        warnings: [
          "No explicit OpenReview source identity is available. OpenReview enrichment requires openreview:<noteId>:<authorIndex> and never guesses an author from the candidate name.",
        ],

        searchedAt:
          new Date().toISOString(),
      };
    }

    try {
      const note =
        buildOpenReviewNoteFromCandidate(
          candidate,
          identity,
        );

      if (!note) {
        return {
          source:
            OPENREVIEW_SOURCE,

          candidateId:
            candidate.id,

          evidence: [],

          confidence:
            "Low",

          warnings: [
            "OpenReview identity was resolved, but the candidate does not contain sufficient publication evidence for enrichment.",
          ],

          searchedAt:
            new Date().toISOString(),
        };
      }

      const authors =
        getAuthorNames(
          note,
        );

      const authorName =
        authors[
          identity.authorIndex
        ];

      if (!authorName) {
        return {
          source:
            OPENREVIEW_SOURCE,

          candidateId:
            candidate.id,

          evidence: [],

          confidence:
            "Low",

          warnings: [
            `OpenReview note ${identity.noteId} was resolved, but author index ${identity.authorIndex} is not present.`,
          ],

          searchedAt:
            new Date().toISOString(),
        };
      }

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

      const confidence =
        confidenceForEvidence(
          title,
          abstract,
          authorName,
        );

      const evidence =
        buildEvidence(
          note,
          title,
          abstract,
          venue,
          authorName,
          confidence,
        );

      const patch =
        buildPatch(
          note,
          title,
          abstract,
          venue,
          keywords,
          subjectAreas,
          evidence.id,
          authors,
          confidence,
        );

      return {
        source:
          OPENREVIEW_SOURCE,

        candidateId:
          candidate.id,

        patch,

        evidence: [
          evidence,
        ],

        confidence,

        searchedAt:
          new Date().toISOString(),
      };
    } catch (
      error
    ) {
      return {
        source:
          OPENREVIEW_SOURCE,

        candidateId:
          candidate.id,

        evidence: [],

        confidence:
          "Low",

        warnings: [
          error instanceof Error
            ? error.message
            : "OpenReview enrichment failed.",
        ],

        searchedAt:
          new Date().toISOString(),
      };
    }
  }
}

export const openReviewTechnicalTalentEnrichment =
  new OpenReviewTechnicalTalentEnrichment();
