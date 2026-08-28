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

const GOOGLE_SCHOLAR_SOURCE =
  "Google Scholar" as DiscoverySource;

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

        identityVerified:
          false,

        notes:
          "Google Scholar research signal. Identity and current employment require corroboration from other sources.",
      };
    },
  );
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
 * Default unconfigured adapter.
 *
 * This lets Atlas register Google Scholar immediately while
 * safely preventing accidental live requests.
 */
export const googleScholarTechnicalTalentSource =
  createGoogleScholarTechnicalTalentSource(
    null,
  );

export default googleScholarTechnicalTalentSource;
