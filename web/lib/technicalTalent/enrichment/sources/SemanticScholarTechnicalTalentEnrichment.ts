import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoveryPublication,
  DiscoverySourcingSignal,
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentSourceCapabilities,
} from "@/types/technicalTalentDiscoverySource";

import type {
  TechnicalTalentEnrichmentAdapter,
  TechnicalTalentEnrichmentConfig,
  TechnicalTalentEnrichmentPatch,
  TechnicalTalentEnrichmentResult,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichment";

const SEMANTIC_SCHOLAR_API_BASE =
  "https://api.semanticscholar.org/graph/v1";

const SEMANTIC_SCHOLAR_SOURCE =
  "Semantic Scholar" as DiscoverySource;

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

const CONFIG:
  TechnicalTalentEnrichmentConfig = {
  source:
    SEMANTIC_SCHOLAR_SOURCE,

  name:
    "Semantic Scholar",

  description:
    "Enrich an existing Atlas technical talent record with public Semantic Scholar author, publication, citation, and research evidence.",

  capabilities:
    SEMANTIC_SCHOLAR_CAPABILITIES,

  enabled: true,
};

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

interface SemanticScholarAuthorResponse {
  authorId:
    | string
    | null;

  name:
    | string
    | null;

  url?:
    | string
    | null;

  papers?:
    SemanticScholarPaper[];
}

interface SemanticScholarPaperResponse {
  data?:
    SemanticScholarPaper[];

  next?:
    number;
}

function createHeaders(): HeadersInit {
  const apiKey =
    process.env.SEMANTIC_SCHOLAR_API_KEY;

  const headers:
    HeadersInit = {
    Accept:
      "application/json",
  };

  if (apiKey) {
    headers["x-api-key"] =
      apiKey;
  }

  return headers;
}

async function semanticScholarFetch<T>(
  url: string,
): Promise<T> {
  const response =
    await fetch(
      url,
      {
        headers:
          createHeaders(),

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    let message =
      `Semantic Scholar API request failed with status ${response.status}.`;

    try {
      const error =
        (await response.json()) as {
          message?: string;
        };

      if (error.message) {
        message =
          `Semantic Scholar API error: ${error.message}`;
      }
    } catch {
      // Preserve generic HTTP error.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Resolve an explicit Semantic Scholar author ID.
 *
 * Atlas must never guess an external research identity
 * from a candidate's name.
 *
 * Existing Semantic Scholar discovery records encode
 * the author identity in:
 *
 * semantic-scholar:{authorId}:{paperId}
 */
function getSemanticScholarAuthorId(
  candidate: TechnicalTalentDiscoveryRecord,
): string | undefined {
  const candidateId =
    candidate.id.trim();

  const prefix =
    "semantic-scholar:";

  if (
    candidateId
      .toLowerCase()
      .startsWith(
        prefix,
      )
  ) {
    const remainder =
      candidateId.slice(
        prefix.length,
      );

    const separator =
      remainder.indexOf(":");

    if (
      separator > 0
    ) {
      const authorId =
        remainder
          .slice(
            0,
            separator,
          )
          .trim();

      if (
        authorId &&
        !authorId
          .startsWith(
            "anonymous-",
          )
      ) {
        return authorId;
      }
    }
  }

  /*
   * Future-proofing: if Atlas later stores an explicit
   * Semantic Scholar author identity in sourceRecordIds,
   * accept that format as well.
   */
  for (
    const sourceId of
    candidate.sourceRecordIds ?? []
  ) {
    const normalized =
      sourceId.trim();

    if (
      !normalized
        .toLowerCase()
        .startsWith(
          "semantic-scholar:author:",
        )
    ) {
      continue;
    }

    const authorId =
      normalized
        .slice(
          "semantic-scholar:author:"
            .length,
        )
        .trim();

    if (authorId) {
      return authorId;
    }
  }

  return undefined;
}

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

function buildPublication(
  paper: SemanticScholarPaper,
  evidenceId: string,
  technicalSignals: string[],
): DiscoveryPublication {
  return {
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
          (author) =>
            author.name,
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
      ].slice(
        0,
        10,
      ),

    evidenceId,
  };
}

function buildPublicationEvidence(
  paper: SemanticScholarPaper,
  evidenceId: string,
  technicalSignals: string[],
  confidence: DiscoveryConfidence,
): DiscoveryEvidence {
  return {
    id:
      evidenceId,

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
      "Semantic Scholar publication associated with a technical talent discovery signal.",
  };
}

function buildCitationEvidence(
  paper: SemanticScholarPaper,
  evidenceId: string,
): DiscoveryEvidence {
  return {
    id:
      evidenceId,

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

    supports: [
      "Research Activity",
    ],

    relevance:
      "Citation activity provides an additional research-impact signal.",
  };
}

function citationConfidenceFromTotal(
  citationCount: number,
): DiscoveryConfidence {
  if (citationCount >= 100) {
    return "Very High";
  }

  if (citationCount >= 20) {
    return "High";
  }

  if (citationCount > 0) {
    return "Medium";
  }

  return "Low";
}

function buildAggregatedSourcingSignals(
  papers: SemanticScholarPaper[],
  technicalSignals: string[],
  totalCitations: number,
  totalInfluentialCitations: number,
): DiscoverySourcingSignal[] {
  const signals: DiscoverySourcingSignal[] = [];

  if (papers.length > 0) {
    signals.push({
      type:
        "Publication",

      signal:
        `Semantic Scholar publications: ${papers.length}`,

      strength:
        papers.length >= 20
          ? "Very High"
          : papers.length >= 5
            ? "High"
            : "Medium",

      explanation:
        `The Semantic Scholar author profile contains ${papers.length} associated publications.`,
    });
  }

  if (totalCitations > 0) {
    signals.push({
      type:
        "Research Activity",

      signal:
        `Semantic Scholar citations: ${totalCitations}`,

      strength:
        citationConfidenceFromTotal(
          totalCitations,
        ),

      explanation:
        `The candidate's returned Semantic Scholar publications have ${totalCitations} total citations.`,

    });
  }

  if (totalInfluentialCitations > 0) {
    signals.push({
      type:
        "Research Activity",

      signal:
        `Influential citations: ${totalInfluentialCitations}`,

      strength:
        citationConfidenceFromTotal(
          totalInfluentialCitations,
        ),

      explanation:
        `The candidate's returned Semantic Scholar publications have ${totalInfluentialCitations} influential citations.`,
    });
  }

  if (technicalSignals.length > 0) {
    signals.push({
      type:
        "Technical Depth",

      signal:
        `Technical research signals: ${technicalSignals
          .slice(0, 8)
          .join(", ")}`,

      strength:
        technicalSignals.length >= 5
          ? "High"
          : "Medium",

      explanation:
        "Technical signals were detected across the candidate's Semantic Scholar publications.",
    });
  }

  return signals;
}

function buildPatch(
  papers: SemanticScholarPaper[],
): TechnicalTalentEnrichmentPatch {
  const skills =
    new Map<
      string,
      {
        name: string;
        evidence: string[];
      }
    >();

  const technologies =
    new Map<
      string,
      {
        name: string;
        evidence: string[];
      }
    >();

  const researchAreas =
    new Set<string>();

  const publications:
    DiscoveryPublication[] = [];

  for (
    const paper of
    papers
  ) {
    const technicalSignals =
      extractTechnicalSignals(
        paper,
      );

    const publicationEvidenceId =
      `semantic-scholar-enrichment-publication:${paper.paperId}`;

    const citationEvidenceId =
      `semantic-scholar-enrichment-citation:${paper.paperId}`;

    const confidence =
      paper.citationCount !==
        undefined &&
      paper.citationCount !==
        null
        ? citationConfidence(
            paper.citationCount,
          )
        : "Medium";

    for (
      const signal of
      technicalSignals
    ) {
      const key =
        signal
          .trim()
          .toLowerCase();

      skills.set(
        key,
        {
          name:
            signal,

          evidence: [
            `Detected in Semantic Scholar publication: ${
              paper.title ??
              "Untitled paper"
            }`,
          ],
        },
      );

      technologies.set(
        key,
        {
          name:
            signal,

          evidence: [
            "Research signal from Semantic Scholar publication",
          ],
        },
      );
    }

    for (
      const area of
      [
        ...(paper.fieldsOfStudy ?? []),
        ...technicalSignals,
      ]
    ) {
      const normalized =
        area.trim();

      if (normalized) {
        researchAreas.add(
          normalized,
        );
      }
    }

    publications.push(
      buildPublication(
        paper,
        publicationEvidenceId,
        technicalSignals,
      ),
    );

  }

  return {
    publications,

    researchAreas:
      Array.from(
        researchAreas,
      ).slice(
        0,
        25,
      ),

    skills:
      Array.from(
        skills.values(),
      ),

    technologies:
      Array.from(
        technologies.values(),
      ),

    sourcingSignals:
      buildAggregatedSourcingSignals(
        papers,
        Array.from(
          new Set(
            Array.from(
              skills.values(),
            ).map(
              (skill) =>
                skill.name,
            ),
          ),
        ),
        papers.reduce(
          (total, paper) =>
            total +
            (paper.citationCount ?? 0),
          0,
        ),
        papers.reduce(
          (total, paper) =>
            total +
            (paper.influentialCitationCount ?? 0),
          0,
        ),
      ),
  };
}

export class SemanticScholarTechnicalTalentEnrichment
  implements TechnicalTalentEnrichmentAdapter
{
  readonly config =
    CONFIG;

  async enrich(
    candidate: TechnicalTalentDiscoveryRecord,
  ): Promise<TechnicalTalentEnrichmentResult> {
    const authorId =
      getSemanticScholarAuthorId(
        candidate,
      );

    if (!authorId) {
      return {
        source:
          SEMANTIC_SCHOLAR_SOURCE,

        candidateId:
          candidate.id,

        evidence: [],

        confidence:
          "Low",

        warnings: [
          "No explicit Semantic Scholar author identity is available on this Atlas candidate. Semantic Scholar author discovery is intentionally not guessed from the candidate name.",
        ],

        searchedAt:
          new Date().toISOString(),
      };
    }

    const author =
      await semanticScholarFetch<SemanticScholarAuthorResponse>(
        `${SEMANTIC_SCHOLAR_API_BASE}/author/${encodeURIComponent(authorId)}?fields=authorId,name,url,papers.paperId,papers.url,papers.title,papers.abstract,papers.year,papers.publicationDate,papers.citationCount,papers.influentialCitationCount,papers.authors,papers.fieldsOfStudy,papers.publicationTypes,papers.venue,papers.externalIds`,
      );

    const papers =
      (author.papers ?? [])
        .filter(
          (
            paper,
          ) =>
            Boolean(
              paper.paperId,
            ),
        );

    const evidence:
      DiscoveryEvidence[] = [];

    for (
      const paper of
      papers
    ) {
      const technicalSignals =
        extractTechnicalSignals(
          paper,
        );

      const publicationEvidenceId =
        `semantic-scholar-enrichment-publication:${paper.paperId}`;

      const citationEvidenceId =
        `semantic-scholar-enrichment-citation:${paper.paperId}`;

      const confidence =
        paper.citationCount !==
          undefined &&
        paper.citationCount !==
          null
          ? citationConfidence(
              paper.citationCount,
            )
          : "Medium";

      evidence.push(
        buildPublicationEvidence(
          paper,
          publicationEvidenceId,
          technicalSignals,
          confidence,
        ),
      );

      evidence.push(
        buildCitationEvidence(
          paper,
          citationEvidenceId,
        ),
      );
    }

    const patch =
      buildPatch(
        papers,
      );

    const totalCitations =
      papers.reduce(
        (
          total,
          paper,
        ) =>
          total +
          (paper.citationCount ??
            0),
        0,
      );

    const highestCitationCount =
      papers.reduce(
        (
          highest,
          paper,
        ) =>
          Math.max(
            highest,
            paper.citationCount ??
              0,
          ),
        0,
      );

    const confidence:
      DiscoveryConfidence =
      papers.length === 0
        ? "Low"
        : highestCitationCount >=
            20
          ? "Very High"
          : highestCitationCount >=
              5
            ? "High"
            : "Medium";

    const result:
      TechnicalTalentEnrichmentResult =
      {
        source:
          SEMANTIC_SCHOLAR_SOURCE,

        candidateId:
          candidate.id,

        patch:
          {
            ...patch,

            ...(author.name
              ? {
                  name:
                    author.name,
                }
              : {}),

            headline:
              author.name
                ? `Semantic Scholar researcher: ${author.name}`
                : undefined,
          },

        evidence,

        confidence,

        warnings:
          papers.length === 0
            ? [
                "Semantic Scholar author profile was resolved, but no publications were returned.",
              ]
            : undefined,

        searchedAt:
          new Date().toISOString(),
      };

    void totalCitations;

    return result;
  }
}

export const semanticScholarTechnicalTalentEnrichment =
  new SemanticScholarTechnicalTalentEnrichment();
