// ============================================================
// Atlas Recruiter OS
// Semantic Scholar Technical Talent Source
//
// Semantic Scholar Academic Graph API adapter.
//
// This source discovers technical talent through research
// publication signals. A paper author is treated as a
// discovery signal, not automatically as a verified identity.
//
// The adapter:
// - searches papers using Atlas keywords/domains
// - extracts paper authors
// - converts publication evidence into Atlas records
// - preserves research/citation signals
// - reports API limitations and failures
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

const SEMANTIC_SCHOLAR_API_BASE =
  "https://api.semanticscholar.org/graph/v1";

const SEMANTIC_SCHOLAR_SOURCE =
  "Semantic Scholar" as DiscoverySource;

const DEFAULT_LIMIT = 10;

const MAX_LIMIT = 20;

const SEMANTIC_SCHOLAR_CAPABILITIES:
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

const SEMANTIC_SCHOLAR_CONFIG:
  TechnicalTalentDiscoverySourceConfig = {
  source:
    SEMANTIC_SCHOLAR_SOURCE,

  name:
    "Semantic Scholar",

  description:
    "Scientific publication, author, citation, and research evidence for technical talent discovery.",

  capabilities:
    SEMANTIC_SCHOLAR_CAPABILITIES,

  enabled: true,
};

/**
 * Semantic Scholar author.
 */
interface SemanticScholarAuthor {
  authorId:
    | string
    | null;

  name:
    | string
    | null;

  url?:
    | string
    | null;
}

/**
 * Semantic Scholar paper.
 */
interface SemanticScholarPaper {
  paperId: string;

  url?:
    | string
    | null;

  title?:
    | string
    | null;

  abstract?:
    | string
    | null;

  year?:
    | number
    | null;

  publicationDate?:
    | string
    | null;

  citationCount?:
    | number
    | null;

  influentialCitationCount?:
    | number
    | null;

  authors?:
    SemanticScholarAuthor[];

  fieldsOfStudy?:
    | string[]
    | null;

  publicationTypes?:
    | string[]
    | null;

  venue?:
    | string
    | null;

  externalIds?:
    | Record<string, string>
    | null;
}

/**
 * Semantic Scholar paper search response.
 */
interface SemanticScholarSearchResponse {
  total?: number;

  offset?: number;

  next?: number;

  data?: SemanticScholarPaper[];
}

/**
 * Semantic Scholar API error.
 */
interface SemanticScholarApiError {
  message?: string;
}

/**
 * Atlas domain → research search terms.
 */
const DOMAIN_QUERY_TERMS:
  Record<string, string> = {
  "AI / ML":
    `"machine learning" OR "deep learning" OR "artificial intelligence"`,

  Robotics:
    `robotics OR "robot manipulation" OR "robot perception" OR "motion planning"`,

  "Hardware / Embedded":
    `"embedded systems" OR firmware OR "computer architecture" OR "edge computing"`,

  Semiconductor:
    `semiconductor OR ASIC OR FPGA OR "integrated circuit" OR "physical design"`,
};

/**
 * Build a Semantic Scholar research query from
 * the common Atlas discovery query.
 */
function buildResearchQuery(
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
    const researchArea of
      query.researchAreas ?? []
  ) {
    const value =
      researchArea.trim();

    if (value) {
      parts.push(
        `"${value}"`,
      );
    }
  }

  if (parts.length === 0) {
    return "robotics OR machine learning";
  }

  return parts.join(" ");
}

/**
 * Infer a broad Atlas talent type from
 * the paper's technical content.
 */
function inferTalentType(
  paper: SemanticScholarPaper,
  query: TechnicalTalentDiscoveryQuery,
): DiscoveryTalentType {
  const text = [
    paper.title ?? "",
    paper.abstract ?? "",
    ...(paper.fieldsOfStudy ?? []),
    ...(query.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (
    text.includes("robot")
  ) {
    return "Robotics Engineer";
  }

  if (
    text.includes("embedded") ||
    text.includes("firmware")
  ) {
    return "Embedded Engineer";
  }

  if (
    text.includes("fpga")
  ) {
    return "FPGA Engineer";
  }

  if (
    text.includes("asic") ||
    text.includes("semiconductor") ||
    text.includes("integrated circuit")
  ) {
    return "ASIC Engineer";
  }

  if (
    text.includes("machine learning") ||
    text.includes("deep learning") ||
    text.includes("artificial intelligence") ||
    text.includes("computer vision")
  ) {
    return "Research Scientist";
  }

  return "Research Engineer";
}

/**
 * Infer the primary Atlas technical domain.
 */
function inferDomain(
  paper: SemanticScholarPaper,
  query: TechnicalTalentDiscoveryQuery,
): TechnicalTalentDiscoveryRecord["primaryDomain"] {
  const text = [
    paper.title ?? "",
    paper.abstract ?? "",
    ...(paper.fieldsOfStudy ?? []),
    ...(query.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (
    text.includes("robot")
  ) {
    return "Robotics";
  }

  if (
    text.includes("asic") ||
    text.includes("fpga") ||
    text.includes("semiconductor") ||
    text.includes("integrated circuit")
  ) {
    return "Semiconductor";
  }

  if (
    text.includes("embedded") ||
    text.includes("firmware") ||
    text.includes("microcontroller") ||
    text.includes("computer architecture")
  ) {
    return "Hardware / Embedded";
  }

  return "AI / ML";
}

/**
 * Extract known technical signals from a paper.
 */
function extractTechnicalSignals(
  paper: SemanticScholarPaper,
): string[] {
  const text = [
    paper.title ?? "",
    paper.abstract ?? "",
    ...(paper.fieldsOfStudy ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const knownSignals = [
    "machine learning",
    "deep learning",
    "reinforcement learning",
    "computer vision",
    "natural language processing",
    "foundation models",
    "robotics",
    "robot manipulation",
    "robot perception",
    "motion planning",
    "slam",
    "embedded systems",
    "firmware",
    "computer architecture",
    "fpga",
    "asic",
    "semiconductor",
    "physical design",
    "verification",
    "edge computing",
    "autonomous systems",
    "optimization",
    "control systems",
  ];

  return knownSignals.filter(
    (signal) =>
      text.includes(signal),
  );
}

/**
 * Convert citation count into Atlas confidence.
 */
function citationConfidence(
  citationCount:
    | number
    | null
    | undefined,
): DiscoveryConfidence {
  const count =
    citationCount ?? 0;

  if (count >= 20) {
    return "Very High";
  }

  if (count >= 5) {
    return "High";
  }

  if (count > 0) {
    return "Medium";
  }

  return "Low";
}

/**
 * Create a normalized Atlas record for
 * one Semantic Scholar paper author.
 */
function normalizeAuthor(
  paper: SemanticScholarPaper,
  author: SemanticScholarAuthor,
  query: TechnicalTalentDiscoveryQuery,
): TechnicalTalentDiscoveryRecord {
  const authorId =
    author.authorId ??
    `anonymous-${paper.paperId}`;

  const authorName =
    author.name?.trim() ||
    "Unknown Researcher";

  const primaryDomain =
    inferDomain(
      paper,
      query,
    );

  const talentType =
    inferTalentType(
      paper,
      query,
    );

  const technicalSignals =
    extractTechnicalSignals(
      paper,
    );

  const confidence:
    DiscoveryConfidence =
    author.authorId &&
    author.name
      ? "High"
      : "Medium";

  const publicationEvidenceId =
    `semantic-scholar:publication:${paper.paperId}`;

  const citationEvidenceId =
    `semantic-scholar:citation:${paper.paperId}`;

  const sourcingSignals:
    DiscoverySourcingSignal[] = [
    {
      type:
        "Publication",

      signal:
        "Research publication",

      strength:
        confidence,

      evidenceIds: [
        publicationEvidenceId,
      ],

      explanation:
        paper.title ??
        "Technical research publication",
    },

    ...(paper.citationCount !==
      undefined &&
    paper.citationCount !==
      null
      ? [
          {
            type:
              "Research Activity" as const,

            signal:
              "Citation activity",

            strength:
              citationConfidence(
                paper.citationCount,
              ),

            evidenceIds: [
              citationEvidenceId,
            ],

            explanation:
              `${paper.citationCount} citations`,
          },
        ]
      : []),

    ...(paper.influentialCitationCount !==
      undefined &&
    paper.influentialCitationCount !==
      null
      ? [
          {
            type:
              "Research Activity" as const,

            signal:
              "Influential citations",

            strength:
              citationConfidence(
                paper.influentialCitationCount,
              ),

            evidenceIds: [
              citationEvidenceId,
            ],

            explanation:
              `${paper.influentialCitationCount} influential citations`,
          },
        ]
      : []),
  ];

  const publicationEvidence:
    DiscoveryEvidence = {
    id:
      publicationEvidenceId,

    type:
      "Publication",

    source:
      SEMANTIC_SCHOLAR_SOURCE,

    title:
      paper.title ??
      "Technical research publication",

    url:
      paper.url ??
      undefined,

    date:
      paper.publicationDate ??
      undefined,

    description:
      paper.abstract ??
      undefined,

    confidence,

    supports:
      technicalSignals,

    relevance:
      "Research publication associated with a technical talent discovery signal.",
  };

  const citationEvidence:
    DiscoveryEvidence = {
    id:
      citationEvidenceId,

    type:
      "Citation",

    source:
      SEMANTIC_SCHOLAR_SOURCE,

    title:
      paper.title
        ? `Citation activity: ${paper.title}`
        : "Citation activity",

    url:
      paper.url ??
      undefined,

    date:
      paper.publicationDate ??
      undefined,

    description:
      paper.citationCount !==
        undefined &&
      paper.citationCount !==
        null
        ? `${paper.citationCount} citations and ${
            paper.influentialCitationCount ??
            0
          } influential citations.`
        : undefined,

    confidence:
      citationConfidence(
        paper.citationCount,
      ),

    supports: [],

    relevance:
      "Citation activity provides an additional research-impact signal.",
  };

  return {
    id:
      `semantic-scholar:${authorId}:${paper.paperId}`,

    name:
      authorName,

    headline:
      paper.title ??
      "Technical research publication",

    primaryDomain,

    talentType,

    roleFamily:
      talentType,

    skills:
      technicalSignals.map(
        (signal) => ({
          name:
            signal,

          evidence: [
            `Detected in research publication: ${
              paper.title ??
              "Untitled paper"
            }`,
          ],
        }),
      ),

    technologies:
      technicalSignals.map(
        (signal) => ({
          name:
            signal,

          evidence: [
            "Research signal from Semantic Scholar publication",
          ],
        }),
      ),

    researchAreas:
      [
        ...(paper.fieldsOfStudy ?? []),
        ...technicalSignals,
      ].slice(0, 10),

    publications: [
      {
        title:
          paper.title ??
          "Technical research publication",

        venue:
          paper.venue ??
          undefined,

        year:
          paper.year ??
          undefined,

        authors:
          (paper.authors ?? [])
            .map(
              (
                paperAuthor,
              ) =>
                paperAuthor.name,
            )
            .filter(
              (
                name,
              ): name is string =>
                Boolean(name),
            ),

        url:
          paper.url ??
          undefined,

        citationCount:
          paper.citationCount ??
          undefined,

        researchAreas:
          [
            ...(paper.fieldsOfStudy ?? []),
            ...technicalSignals,
          ].slice(0, 10),

        evidenceId:
          publicationEvidenceId,
      },
    ],

    evidence: [
      publicationEvidence,
      citationEvidence,
    ],

    sourcingSignals,

    approvalStatus:
      "Unreviewed",

    sourceRecordIds: [
      `semantic-scholar:${paper.paperId}`,
    ],

    firstDiscoveredAt:
      new Date().toISOString(),
  };
}

/**
 * Convert a paper/author combination into
 * source-level evidence.
 */
function createEvidence(
  paper: SemanticScholarPaper,
  author: SemanticScholarAuthor,
): TechnicalTalentSourceEvidence {
  return {
    source:
      SEMANTIC_SCHOLAR_SOURCE,

    sourceRecordId:
      `${paper.paperId}:${author.authorId ?? author.name ?? "unknown"}`,

    externalId:
      author.authorId ??
      undefined,

    name:
      author.name ??
      undefined,

    headline:
      paper.title ??
      undefined,

    url:
      author.url ??
      paper.url ??
      undefined,

    title:
      paper.title ??
      undefined,

    description:
      paper.abstract ??
      undefined,

    publishedAt:
      paper.publicationDate ??
      undefined,

    metadata: {
      paperId:
        paper.paperId,

      citationCount:
        paper.citationCount ??
        0,

      influentialCitationCount:
        paper.influentialCitationCount ??
        0,

      year:
        paper.year ??
        0,

      venue:
        paper.venue ??
        "",
    },

    rawSignals:
      extractTechnicalSignals(
        paper,
      ),

    confidence:
      author.authorId &&
      author.name
        ? "High"
        : "Medium",
  };
}

/**
 * Create Semantic Scholar request headers.
 *
 * The API can be accessed without a key for some usage,
 * while an API key can be supplied for higher limits.
 */
function createHeaders(): HeadersInit {
  const apiKey =
    process.env
      .SEMANTIC_SCHOLAR_API_KEY;

  const headers:
    HeadersInit = {
    Accept:
      "application/json",
  };

  if (apiKey) {
    headers[
      "x-api-key"
    ] = apiKey;
  }

  return headers;
}

/**
 * Search Semantic Scholar papers.
 */
async function searchPapers(
  query: TechnicalTalentDiscoveryQuery,
  limit: number,
): Promise<SemanticScholarSearchResponse> {
  const searchQuery =
    buildResearchQuery(
      query,
    );

  const params =
    new URLSearchParams();

  params.set(
    "query",
    searchQuery,
  );

  params.set(
    "limit",
    String(
      Math.min(
        Math.max(
          limit,
          1,
        ),
        MAX_LIMIT,
      ),
    ),
  );

  params.set(
    "fields",
    [
      "paperId",
      "url",
      "title",
      "abstract",
      "year",
      "publicationDate",
      "citationCount",
      "influentialCitationCount",
      "authors",
      "fieldsOfStudy",
      "publicationTypes",
      "venue",
      "externalIds",
    ].join(","),
  );

  const response =
    await fetch(
      `${SEMANTIC_SCHOLAR_API_BASE}/paper/search?${params.toString()}`,
      {
        method:
          "GET",

        headers:
          createHeaders(),

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    let message =
      `Semantic Scholar request failed with HTTP ${response.status}.`;

    try {
      const body =
        (await response.json()) as
          SemanticScholarApiError;

      if (
        body.message
      ) {
        message =
          body.message;
      }
    } catch {
      // Preserve the HTTP status message.
    }

    throw new Error(
      message,
    );
  }

  return (
    (await response.json()) as
      SemanticScholarSearchResponse
  );
}

/**
 * Semantic Scholar source adapter.
 */
export const semanticScholarTechnicalTalentSource:
  TechnicalTalentDiscoverySourceAdapter =
  {
    config:
      SEMANTIC_SCHOLAR_CONFIG,

    async search(
      request:
        TechnicalTalentSourceQuery,
    ): Promise<TechnicalTalentSourceResult> {
      try {
        const requestedLimit =
          Math.min(
            Math.max(
              request.query.limit ??
                DEFAULT_LIMIT,
              1,
            ),
            MAX_LIMIT,
          );

        const response =
          await searchPapers(
            request.query,
            requestedLimit,
          );

        const records:
          TechnicalTalentDiscoveryRecord[] =
          [];

        const evidence:
          TechnicalTalentSourceEvidence[] =
          [];

        const seenAuthors =
          new Set<string>();

        for (
          const paper of
            response.data ?? []
        ) {
          for (
            const author of
              paper.authors ?? []
          ) {
            const identityKey =
              author.authorId ??
              author.name?.toLowerCase();

            if (!identityKey) {
              continue;
            }

            evidence.push(
              createEvidence(
                paper,
                author,
              ),
            );

            if (
              seenAuthors.has(
                identityKey,
              )
            ) {
              continue;
            }

            seenAuthors.add(
              identityKey,
            );

            records.push(
              normalizeAuthor(
                paper,
                author,
                request.query,
              ),
            );
          }
        }

        return {
          source:
            SEMANTIC_SCHOLAR_SOURCE,

          query:
            request,

          records,

          evidence,

          total:
            response.total ??
            records.length,

          hasMore:
            response.next !==
            undefined,

          nextCursor:
            response.next !==
            undefined
              ? String(
                  response.next,
                )
              : undefined,

          searchedAt:
            new Date().toISOString(),

          warnings: [
            "Publication authors are discovery signals and are not automatically verified identities.",
          ],
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Semantic Scholar discovery failed.",
        );
      }
    },
  };