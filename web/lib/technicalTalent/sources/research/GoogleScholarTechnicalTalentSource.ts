// ============================================================
// Atlas Recruiter OS
// Google Scholar Technical Talent Source
//
// Google Scholar research-discovery adapter.
//
// IMPORTANT:
// Google Scholar does not expose a conventional public API.
// This adapter therefore keeps the Scholar provider boundary
// separate from Atlas's discovery architecture.
//
// A provider implementation can later supply Scholar results
// without changing the Atlas discovery engine.
//
// Scholar authors are discovery signals, not automatically
// verified identities.
// ============================================================

import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoverySource,
  DiscoverySourcingSignal,
  DiscoveryTalentType,
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

import {
  serpApiGoogleScholarProvider,
} from "@/lib/technicalTalent/providers/research/SerpApiGoogleScholarProvider";

const GOOGLE_SCHOLAR_SOURCE =
  "Google Scholar" as DiscoverySource;

/**
 * Maximum number of Scholar author profiles to enrich during
 * a single discovery request.
 *
 * This protects SerpApi usage while allowing the discovery
 * result set to remain larger than the enrichment set.
 */
const GOOGLE_SCHOLAR_AUTHOR_ENRICHMENT_LIMIT =
  10;

const GOOGLE_SCHOLAR_CAPABILITIES:
  TechnicalTalentSourceCapabilities = {
  identity: true,

  technicalProfile: true,

  skills: true,

  technologies: true,

  publications: true,

  citations: true,

  researchProjects: true,

  locations: false,
};

const GOOGLE_SCHOLAR_CONFIG:
  TechnicalTalentDiscoverySourceConfig = {
  source:
    GOOGLE_SCHOLAR_SOURCE,

  name:
    "Google Scholar",

  description:
    "Academic researcher, publication, citation, and research evidence for technical talent discovery.",

  capabilities:
    GOOGLE_SCHOLAR_CAPABILITIES,

  enabled: true,
};

/**
 * Normalized Google Scholar author.
 */
export interface GoogleScholarAuthor {
  authorId?: string;

  name: string;

  profileUrl?: string;

  affiliation?: string;

  researchInterests?: string[];

  citationCount?: number;

  citationsSince2021?: number;

  hIndex?: number;

  hIndexSince2021?: number;

  i10Index?: number;

  i10IndexSince2021?: number;
}

/**
 * Normalized Google Scholar author profile.
 *
 * This represents author-level enrichment retrieved from
 * the Google Scholar author profile endpoint.
 */
export interface GoogleScholarAuthorProfile
  extends GoogleScholarAuthor {
  authorId: string;

  name: string;

  profileUrl?: string;

  website?: string;

  citationHistory?: Array<{
    year: number;
    citations: number;
  }>;

  articles?: Array<{
    title: string;
    url?: string;
    citationId?: string;
    authors?: string;
    publication?: string;
    year?: number;
    citationCount?: number;
  }>;
}

/**
 * Normalized Google Scholar publication.
 */
export interface GoogleScholarPublication {
  title: string;

  url?: string;

  authors?: GoogleScholarAuthor[];

  year?: number;

  venue?: string;

  citationCount?: number;

  description?: string;

  researchAreas?: string[];
}

/**
 * Provider response.
 *
 * The actual Scholar retrieval mechanism is intentionally
 * outside the Atlas source adapter.
 */
export interface GoogleScholarProviderResult {
  publications: GoogleScholarPublication[];

  total?: number;

  nextPage?: number;

  warnings?: string[];
}

/**
 * Provider contract.
 *
 * Implementations can later use a supported third-party
 * Google Scholar access provider.
 */
export interface GoogleScholarProvider {
  search(
    query: string,
    page: number,
    limit: number,
  ): Promise<GoogleScholarProviderResult>;

  getAuthorProfile(
    authorId: string,
  ): Promise<GoogleScholarAuthorProfile | null>;
}

/**
 * Atlas domain → Google Scholar search terms.
 */
const DOMAIN_QUERY_TERMS:
  Record<string, string> = {
  "AI / ML":
    `"machine learning" OR "deep learning" OR "artificial intelligence"`,

  Robotics:
    `robotics OR "robot learning" OR "robot manipulation" OR "robot perception" OR "motion planning"`,

  "Hardware / Embedded":
    `"embedded systems" OR firmware OR "computer architecture" OR "hardware acceleration"`,

  Semiconductor:
    `semiconductor OR ASIC OR FPGA OR "integrated circuit" OR "chip design"`,
};

/**
 * Build a Scholar research query from Atlas's common
 * discovery query.
 */
export function buildGoogleScholarQuery(
  query: TechnicalTalentDiscoveryQuery,
): string {
  const parts: string[] = [];

  for (
    const keyword of
      query.keywords ?? []
  ) {
    const value =
      keyword.trim();

    if (value) {
      parts.push(
        `"${value}"`,
      );
    }
  }

  for (
    const domain of
      query.domains ?? []
  ) {
    const value =
      domain.trim();

    if (!value) {
      continue;
    }

    const domainQuery =
      DOMAIN_QUERY_TERMS[value];

    if (domainQuery) {
      parts.push(
        `(${domainQuery})`,
      );
    }
  }

  for (
    const area of
      query.researchAreas ?? []
  ) {
    const value =
      area.trim();

    if (value) {
      parts.push(
        `"${value}"`,
      );
    }
  }

  return parts.join(" AND ");
}

/**
 * Infer a talent type from Scholar research evidence.
 */
function inferTalentType(
  publication: GoogleScholarPublication,
  query: TechnicalTalentDiscoveryQuery,
): DiscoveryTalentType {
  const text = [
    publication.title,
    publication.description,
    ...(publication.researchAreas ?? []),
    ...(query.domains ?? []),
    ...(query.researchAreas ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    text.includes("robot") ||
    text.includes("motion planning") ||
    text.includes("manipulation") ||
    text.includes("autonom")
  ) {
    return "Robotics Engineer";
  }

  if (
    text.includes("machine learning") ||
    text.includes("deep learning") ||
    text.includes("artificial intelligence") ||
    text.includes("computer vision") ||
    text.includes("natural language") ||
    text.includes("generative ai")
  ) {
    return "ML Engineer";
  }

  if (
    text.includes("asic") ||
    text.includes("fpga") ||
    text.includes("embedded") ||
    text.includes("firmware") ||
    text.includes("computer architecture") ||
    text.includes("semiconductor")
  ) {
    return "Hardware Engineer";
  }

  return "Research Scientist";
}

/**
 * Convert Scholar citation strength into Atlas confidence.
 */
function citationConfidence(
  citationCount:
    | number
    | undefined,
): DiscoveryConfidence {
  if (
    citationCount === undefined
  ) {
    return "Low";
  }

  if (citationCount >= 100) {
    return "Very High";
  }

  if (citationCount >= 25) {
    return "High";
  }

  if (citationCount >= 5) {
    return "Medium";
  }

  return "Low";
}

/**
 * Create evidence for a Scholar publication.
 */
function createPublicationEvidence(
  publication: GoogleScholarPublication,
  index: number,
): DiscoveryEvidence {
  return {
    id:
      `google-scholar-publication-${index + 1}`,

    type:
      "Publication",

    source:
      GOOGLE_SCHOLAR_SOURCE,

    title:
      publication.title,

    url:
      publication.url,

    publisher:
      "Google Scholar",

    date:
      publication.year
        ? String(publication.year)
        : undefined,

    description:
      publication.description,

    confidence:
      citationConfidence(
        publication.citationCount,
      ),

    supports:
      publication.researchAreas ?? [],

    relevance:
      "Academic publication discovered through Google Scholar research signals.",
  };
}

/**
 * Create citation evidence when citation data exists.
 */
function createCitationEvidence(
  publication: GoogleScholarPublication,
  index: number,
): DiscoveryEvidence | null {
  if (
    publication.citationCount === undefined
  ) {
    return null;
  }

  return {
    id:
      `google-scholar-citation-${index + 1}`,

    type:
      "Citation",

    source:
      GOOGLE_SCHOLAR_SOURCE,

    title:
      `Citations: ${publication.title}`,

    url:
      publication.url,

    publisher:
      "Google Scholar",

    description:
      `${publication.citationCount} citation${publication.citationCount === 1 ? "" : "s"} reported by Google Scholar.`,

    confidence:
      citationConfidence(
        publication.citationCount,
      ),

    supports:
      publication.researchAreas ?? [],

    relevance:
      "Citation activity provides a research-impact signal for candidate discovery.",
  };
}

/**
 * Normalize one Scholar publication into candidate records.
 */
export function normalizeGoogleScholarPublication(
  publication: GoogleScholarPublication,
  query: TechnicalTalentDiscoveryQuery,
  index: number,
): TechnicalTalentDiscoveryRecord[] {
  const publicationEvidence =
    createPublicationEvidence(
      publication,
      index,
    );

  const citationEvidence =
    createCitationEvidence(
      publication,
      index,
    );

  const evidence:
    DiscoveryEvidence[] = [
      publicationEvidence,
      ...(citationEvidence
        ? [citationEvidence]
        : []),
    ];

  const talentType =
    inferTalentType(
      publication,
      query,
    );

  return (
    publication.authors ?? []
  ).map(
    (author) => {
      const evidenceIds =
        evidence.map(
          (item) => item.id,
        );

      const sourcingSignals:
        DiscoverySourcingSignal[] = [
        {
          type:
            "Publication",

          signal:
            publication.title,

          strength:
            publicationEvidence.confidence,

          evidenceIds: [
            publicationEvidence.id,
          ],

          explanation:
            "Google Scholar publication activity provides a research signal for technical talent discovery.",
        },
      ];

      if (
        publication.citationCount !==
          undefined
      ) {
        sourcingSignals.push({
          type:
            "Publication",

          signal:
            "Citation count",

          strength:
            citationConfidence(
              publication.citationCount,
            ),

          evidenceIds:
            citationEvidence
              ? [citationEvidence.id]
              : [],

          explanation:
            "Citation activity provides a research-impact signal for candidate discovery.",
        });
      }

      return {
        id:
          author.authorId ??
          `google-scholar-${index}-${author.name}`,

        name:
          author.name,

        talentType,

        primaryDomain:
          query.domains?.[0] ??
          "AI / ML",

        approvalStatus:
          "Unreviewed",

        source:
          GOOGLE_SCHOLAR_SOURCE,

        profileUrl:
          author.profileUrl,

        affiliations:
          author.affiliation
            ? [
                {
                  organization:
                    author.affiliation,

                  current:
                    true,

                  evidenceIds,
                },
              ]
            : [],

        skills:
          (publication.researchAreas ?? []).map(
            (area) => ({
              name:
                area,

              normalizedName:
                area.toLowerCase(),

              evidenceIds,
            }),
          ),

        technologies: [],

        publications: [
          {
            title:
              publication.title,

            url:
              publication.url,

            year:
              publication.year,

            venue:
              publication.venue,

            citationCount:
              publication.citationCount,
          },
        ],

        evidence,

        sourcingSignals,

        confidence:
          publicationEvidence.confidence,

        notes:
          "Google Scholar research signal. Identity and current employment require corroboration from other sources.",
      };
    },
  );
}

/**
 * Enrich a normalized Scholar candidate from the author's
 * Google Scholar profile.
 *
 * Author enrichment is deliberately best-effort. A failure for
 * one author must not prevent the remaining Scholar results
 * from being returned.
 */
async function enrichGoogleScholarCandidate(
  record: TechnicalTalentDiscoveryRecord,
  provider: GoogleScholarProvider,
): Promise<TechnicalTalentDiscoveryRecord> {
  const authorId =
    record.id;

  if (
    !authorId ||
    authorId.startsWith("google-scholar-")
  ) {
    return record;
  }

  let profile:
    | GoogleScholarAuthorProfile
    | null;

  try {
    profile =
      await provider.getAuthorProfile(
        authorId,
      );
  } catch {
    return record;
  }

  if (!profile) {
    return record;
  }

  const enrichmentEvidenceIds =
    record.evidence.map(
      (item) => item.id,
    );

  if (profile.affiliation) {
    const alreadyHasAffiliation =
      record.affiliations?.some(
        (affiliation) =>
          affiliation.organization.toLowerCase() ===
          profile.affiliation?.toLowerCase(),
      );

    if (!alreadyHasAffiliation) {
      record.affiliations = [
        ...(record.affiliations ?? []),
        {
          organization:
            profile.affiliation,
          current:
            true,
          evidenceIds:
            enrichmentEvidenceIds,
        },
      ];
    }
  }

  const researchInterests =
    profile.researchInterests ?? [];

  const existingResearchAreas =
    new Set(
      (
        record.researchAreas ??
        []
      ).map(
        (area) =>
          area.toLowerCase(),
      ),
    );

  record.researchAreas = [
    ...(record.researchAreas ?? []),
    ...researchInterests.filter(
      (interest) =>
        !existingResearchAreas.has(
          interest.toLowerCase(),
        ),
    ),
  ];

  const existingSkills =
    new Set(
      record.skills
        .map(
          (skill) =>
            skill.normalizedName?.toLowerCase(),
        )
        .filter(
          (
            name,
          ): name is string =>
            Boolean(name),
        ),
    );

  record.skills = [
    ...record.skills,
    ...researchInterests
      .filter(
        (interest) =>
          !existingSkills.has(
            interest.toLowerCase(),
          ),
      )
      .map(
        (interest) => ({
          name:
            interest,
          normalizedName:
            interest.toLowerCase(),
          evidenceIds:
            enrichmentEvidenceIds,
        }),
      ),
  ];

  const metrics: Array<{
    label: string;
    value: number | undefined;
  }> = [
    {
      label:
        "Google Scholar citations",
      value:
        profile.citationCount,
    },
    {
      label:
        "Google Scholar h-index",
      value:
        profile.hIndex,
    },
    {
      label:
        "Google Scholar i10-index",
      value:
        profile.i10Index,
    },
    {
      label:
        "Google Scholar citations since 2021",
      value:
        profile.citationsSince2021,
    },
  ];

  metrics.forEach(
    ({
      label,
      value,
    }) => {
      if (value === undefined) {
        return;
      }

      const evidence: DiscoveryEvidence = {
        id:
          `google-scholar-profile-${record.id}-${label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`,
        source:
          GOOGLE_SCHOLAR_SOURCE,
        type:
          "Technical Profile",
        title:
          label,
        description:
          `${label}: ${value}.`,
        url:
          profile.profileUrl,
        confidence:
          "High",
        date:
          new Date().toISOString(),
      };

      record.evidence.push(
        evidence,
      );

      record.sourcingSignals =
        [
          ...(record.sourcingSignals ?? []),
          {
            type:
              "Research Activity",
            signal:
              `${label}: ${value}`,
            strength:
              "High",
            evidenceIds: [
              evidence.id,
            ],
            explanation:
              "Google Scholar author-profile metrics provide an academic research-impact signal for technical talent discovery.",
          },
        ];
    },
  );

  const existingPublicationTitles =
    new Set(
      (
        record.publications ??
        []
      ).map(
        (publication) =>
          publication.title.toLowerCase(),
      ),
    );

  for (
    const article of
      profile.articles ?? []
  ) {
    const title =
      article.title.trim();

    if (
      !title ||
      existingPublicationTitles.has(
        title.toLowerCase(),
      )
    ) {
      continue;
    }

    record.publications = [
      ...(record.publications ?? []),
      {
        title,
        url:
          article.url,
        year:
          article.year,
        citationCount:
          article.citationCount,
      },
    ];

    existingPublicationTitles.add(
      title.toLowerCase(),
    );
  }

  record.sourceRecordIds = [
    ...(record.sourceRecordIds ?? []),
    authorId,
  ];

  return record;
}

/**
 * Create a provider-backed Google Scholar adapter.
 *
 * A provider must be supplied by the application layer.
 */
export function createGoogleScholarTechnicalTalentSource(
  provider:
    | GoogleScholarProvider
    | null,
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config:
      GOOGLE_SCHOLAR_CONFIG,

    async search(
      sourceQuery: TechnicalTalentSourceQuery,
    ): Promise<TechnicalTalentSourceResult> {
      if (!provider) {
        return {
          source:
            GOOGLE_SCHOLAR_SOURCE,

          query:
            sourceQuery,

          records: [],

          evidence: [],

          total:
            0,

          hasMore:
            false,

          searchedAt:
            new Date().toISOString(),

          warnings: [
            "Google Scholar provider is not configured.",
            "Google Scholar requires a supported external access provider before live discovery can run.",
          ],
        };
      }

      const query =
        buildGoogleScholarQuery(
          sourceQuery.query,
        );

      const limit =
        Math.min(
          Math.max(
            sourceQuery.query.limit ??
              10,
            1,
          ),
          20,
        );

      const offset =
        Math.max(
          sourceQuery.query.offset ??
            0,
          0,
        );

      const page =
        Math.floor(
          offset / limit,
        ) + 1;

      const result =
        await provider.search(
          query,
          page,
          limit,
        );

      const records:
        TechnicalTalentDiscoveryRecord[] =
        [];

      const evidence:
        TechnicalTalentSourceEvidence[] =
        [];

      result.publications.forEach(
        (
          publication,
          index,
        ) => {
          const publicationRecords =
            normalizeGoogleScholarPublication(
              publication,
              sourceQuery.query,
              index,
            );

          records.push(
            ...publicationRecords,
          );

          publicationRecords.forEach(
            (record) => {
              record.evidence?.forEach(
                (item) => {
                  evidence.push({
                    source:
                      GOOGLE_SCHOLAR_SOURCE,

                    sourceRecordId:
                      record.id,

                    title:
                      item.title,

                    url:
                      item.url,

                    description:
                      item.description,

                    publishedAt:
                      item.date,

                    confidence:
                      item.confidence,
                  });
                },
              );
            },
          );
        },
      );

      /*
       * Enrich a bounded number of candidates from their
       * Google Scholar author profiles.
       *
       * Author enrichment is deliberately best-effort:
       * one failed profile lookup must not fail the search.
       */
      const enrichmentTargets =
        records
          .filter(
            (record) =>
              !record.id.startsWith(
                "google-scholar-",
              ),
          )
          .slice(
            0,
            GOOGLE_SCHOLAR_AUTHOR_ENRICHMENT_LIMIT,
          );

      for (
        const record of enrichmentTargets
      ) {
        await enrichGoogleScholarCandidate(
          record,
          provider,
        );
      }

      return {
        source:
          GOOGLE_SCHOLAR_SOURCE,

        query:
          sourceQuery,

        records,

        evidence,

        total:
          result.total ?? records.length,

        hasMore:
          result.nextPage !== undefined,

        nextCursor:
          result.nextPage !== undefined
            ? String(result.nextPage)
            : undefined,

        searchedAt:
          new Date().toISOString(),

        warnings:
          result.warnings ?? [],
      };
    },
  };
}

/**
 * Default production Google Scholar adapter.
 *
 * The provider itself safely handles a missing
 * SERPAPI_API_KEY without making an unauthenticated request.
 */
export const googleScholarTechnicalTalentSource =
  createGoogleScholarTechnicalTalentSource(
    serpApiGoogleScholarProvider,
  );

export default googleScholarTechnicalTalentSource;
