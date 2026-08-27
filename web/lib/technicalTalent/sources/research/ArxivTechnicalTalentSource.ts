/**
 * Atlas Recruiter OS
 * arXiv Technical Talent Source
 *
 * Discovers technical talent through public arXiv research
 * publications.
 *
 * Important:
 * - A paper author is a discovery signal, not a verified identity.
 * - A paper ID identifies a publication, not a person.
 * - This adapter does not perform cross-source identity resolution.
 */

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

const ARXIV_API_BASE =
  "https://export.arxiv.org/api/query";

const ARXIV_SOURCE =
  "arXiv" as DiscoverySource;

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;

const ARXIV_CAPABILITIES:
  TechnicalTalentSourceCapabilities = {
    identity: true,
    technicalProfile: true,
    skills: true,
    technologies: true,
    publications: true,
    citations: false,
    patents: false,
    repositories: false,
    openSource: false,
    conferences: false,
    education: false,
    researchProjects: false,
    locations: false,
  };

const ARXIV_CONFIG:
  TechnicalTalentDiscoverySourceConfig = {
    source: ARXIV_SOURCE,
    name: "arXiv",
    description:
      "Public research papers, authors, abstracts, categories and technical research signals for talent discovery.",
    capabilities: ARXIV_CAPABILITIES,
    enabled: true,
  };

interface ArxivAuthor {
  name: string;
}

interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  published?: string;
  updated?: string;
  authors: ArxivAuthor[];
  categories: string[];
  primaryCategory?: string;
  journalRef?: string;
}

/**
 * Map Atlas domains to arXiv categories/search concepts.
 */
const DOMAIN_QUERY_TERMS:
  Record<string, string> = {
  "AI / ML":
    '(cat:cs.LG OR cat:cs.AI OR cat:cs.CL OR cat:cs.CV)',
  Robotics:
    '(cat:cs.RO)',
  "Hardware / Embedded":
    '(cat:cs.AR OR cat:cs.ET OR cat:eess.SY)',
  Semiconductor:
    '(cat:cs.AR OR cat:eess.SY)',
};

/**
 * Map common technical signals to arXiv query terms.
 */
const TECHNICAL_QUERY_TERMS:
  Record<string, string> = {
  "machine learning": '"machine learning"',
  "deep learning": '"deep learning"',
  robotics: "robotics",
  "computer vision": '"computer vision"',
  "reinforcement learning": '"reinforcement learning"',
  "natural language processing":
    '"natural language processing"',
  transformers: "transformers",
  pytorch: "PyTorch",
  tensorflow: "TensorFlow",
  CUDA: "CUDA",
  FPGA: "FPGA",
  ASIC: "ASIC",
  semiconductor: "semiconductor",
  "computer architecture":
    '"computer architecture"',
  "embedded systems":
    '"embedded systems"',
};

/**
 * Escape XML-sensitive characters.
 */
function escapeXml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Strip XML tags from an Atom field.
 */
function stripXml(
  value: string,
): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Decode the most common XML entities.
 */
function decodeXml(
  value: string,
): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
}

/**
 * Extract repeated XML blocks.
 */
function extractBlocks(
  xml: string,
  tag: string,
): string[] {
  const expression = new RegExp(
    `<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`,
    "gi",
  );

  return Array.from(
    xml.matchAll(expression),
  ).map(
    (match) => match[1],
  );
}

/**
 * Extract the first XML field.
 */
function extractField(
  block: string,
  tag: string,
): string | undefined {
  const expression = new RegExp(
    `<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`,
    "i",
  );

  const match =
    block.match(expression);

  if (!match) {
    return undefined;
  }

  return decodeXml(
    stripXml(match[1]),
  );
}

/**
 * Extract an XML attribute.
 */
function extractAttribute(
  block: string,
  tag: string,
  attribute: string,
): string | undefined {
  const expression = new RegExp(
    `<${tag}\\b[^>]*\\b${attribute}="([^"]+)"`,
    "i",
  );

  return block.match(expression)?.[1];
}

/**
 * Extract all authors from an arXiv entry.
 */
function extractAuthors(
  block: string,
): ArxivAuthor[] {
  return extractBlocks(
    block,
    "author",
  )
    .map((authorBlock) => {
      const name =
        extractField(
          authorBlock,
          "name",
        );

      return name
        ? { name }
        : undefined;
    })
    .filter(
      (
        author,
      ): author is ArxivAuthor =>
        Boolean(author),
    );
}

/**
 * Extract arXiv category terms.
 */
function extractCategories(
  block: string,
): string[] {
  return Array.from(
    block.matchAll(
      /<category\b[^>]*term="([^"]+)"/gi,
    ),
  ).map(
    (match) => match[1],
  );
}

/**
 * Parse arXiv Atom XML.
 */
function parseArxivResponse(
  xml: string,
): ArxivPaper[] {
  const papers: ArxivPaper[] = [];

  for (
    const block of extractBlocks(
      xml,
      "entry",
    )
  ) {
    const id =
      extractField(
        block,
        "id",
      );

    const title =
      extractField(
        block,
        "title",
      );

    const summary =
      extractField(
        block,
        "summary",
      );

    if (
      !id ||
      !title ||
      !summary
    ) {
      continue;
    }

    const categories =
      extractCategories(
        block,
      );

    const primaryCategory =
      extractAttribute(
        block,
        "arxiv:primary_category",
        "term",
      );

    papers.push({
      id,
      title,
      summary,
      published:
        extractField(
          block,
          "published",
        ),
      updated:
        extractField(
          block,
          "updated",
        ),
      authors:
        extractAuthors(
          block,
        ),
      categories,
      primaryCategory,
      journalRef:
        extractField(
          block,
          "arxiv:journal_ref",
        ),
    });
  }

  return papers;
}

/**
 * Convert an Atlas query into arXiv search syntax.
 */
function buildArxivQuery(
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
        `all:"${escapeXml(value)}"`,
      );
    }
  }

  for (
    const skill of
      query.skills ?? []
  ) {
    const normalized =
      skill.trim().toLowerCase();

    const mapped =
      TECHNICAL_QUERY_TERMS[
        normalized
      ];

    if (mapped) {
      parts.push(
        `all:${mapped}`,
      );
    } else if (
      normalized
    ) {
      parts.push(
        `all:"${escapeXml(skill.trim())}"`,
      );
    }
  }

  for (
    const technology of
      query.technologies ?? []
  ) {
    const normalized =
      technology.trim().toLowerCase();

    const mapped =
      TECHNICAL_QUERY_TERMS[
        normalized
      ];

    if (mapped) {
      parts.push(
        `all:${mapped}`,
      );
    } else if (
      normalized
    ) {
      parts.push(
        `all:"${escapeXml(
          technology.trim(),
        )}"`,
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
        `all:"${escapeXml(value)}"`,
      );
    }
  }

  for (
    const domain of
      query.domains ?? []
  ) {
    const term =
      DOMAIN_QUERY_TERMS[
        domain
      ];

    if (term) {
      parts.push(term);
    }
  }

  if (
    parts.length === 0
  ) {
    return "all:*";
  }

  return parts.length === 1
    ? parts[0]
    : parts
        .map(
          (part) =>
            `(${part})`,
        )
        .join(" AND ");
}

/**
 * Convert an arXiv publication date into a year.
 */
function getYear(
  value?: string,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return undefined;
  }

  return date.getUTCFullYear();
}

/**
 * Infer technical talent type from the query domain.
 */
function inferTalentType(
  query: TechnicalTalentDiscoveryQuery,
): DiscoveryTalentType {
  if (
    query.talentTypes?.length
  ) {
    return query.talentTypes[0];
  }

  if (
    query.domains?.includes(
      "Robotics",
    )
  ) {
    return "Robotics Engineer";
  }

  if (
    query.domains?.includes(
      "Hardware / Embedded",
    )
  ) {
    return "Hardware Engineer";
  }

  if (
    query.domains?.includes(
      "Semiconductor",
    )
  ) {
    return "Silicon Engineer";
  }

  return "Research Scientist";
}

/**
 * Infer the primary Atlas domain.
 */
function inferPrimaryDomain(
  query: TechnicalTalentDiscoveryQuery,
): TechnicalTalentDiscoveryRecord["primaryDomain"] {
  if (
    query.domains?.includes(
      "Robotics",
    )
  ) {
    return "Robotics";
  }

  if (
    query.domains?.includes(
      "Semiconductor",
    )
  ) {
    return "Semiconductor";
  }

  if (
    query.domains?.includes(
      "Hardware / Embedded",
    )
  ) {
    return "Hardware / Embedded";
  }

  return "AI / ML";
}

/**
 * Convert technical query signals into normalized skills.
 */
function buildSkills(
  query: TechnicalTalentDiscoveryQuery,
): TechnicalTalentDiscoveryRecord["skills"] {
  return Array.from(
    new Set([
      ...(query.skills ?? []),
      ...(query.technologies ?? []),
    ]),
  )
    .map(
      (name) => ({
        name,
        normalizedName:
          name
            .trim()
            .toLowerCase(),
        domain:
          inferPrimaryDomain(
            query,
          ),
      }),
    );
}

/**
 * Convert query signals into normalized technologies.
 */
function buildTechnologies(
  query: TechnicalTalentDiscoveryQuery,
): TechnicalTalentDiscoveryRecord["technologies"] {
  return Array.from(
    new Set(
      query.technologies ?? [],
    ),
  ).map(
    (name) => ({
      name,
      normalizedName:
        name
          .trim()
          .toLowerCase(),
      domain:
        inferPrimaryDomain(
          query,
        ),
    }),
  );
}

/**
 * Build normalized publication evidence.
 */
/**
 * Build a stable identity-safe arXiv author key.
 *
 * This is only an adapter-local discovery identity.
 * It is not a verified global person identity.
 */
function normalizeNameForIdentity(
  value: string,
): string {
  return value
    .normalize("NFKD")
    .replace(
      /[^a-zA-Z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .toLowerCase();
}

function createEvidence(
  paper: ArxivPaper,
  author: ArxivAuthor,
): {
  evidence: DiscoveryEvidence;
  sourceEvidence: TechnicalTalentSourceEvidence;
  publication: NonNullable<
    TechnicalTalentDiscoveryRecord["publications"]
  >[number];
} {
  const arxivId =
    paper.id
      .split("/abs/")
      .pop() ??
    paper.id;

  const evidenceId =
    `arxiv:${arxivId}:${author.name}`;

  const publicationUrl =
    paper.id;

  const confidence:
    DiscoveryConfidence =
    "High";

  const evidence: DiscoveryEvidence = {
    id: evidenceId,
    type: "Publication",
    source: ARXIV_SOURCE,
    title: paper.title,
    url: publicationUrl,
    publisher: "arXiv",
    date: paper.published,
    description:
      `Public arXiv publication authored by ${author.name}.`,
    confidence,
    supports: [
      "Research Activity",
      ...paper.categories,
    ],
    relevance:
      "Public research publication discovered through arXiv technical search.",
  };

  const sourceEvidence:
    TechnicalTalentSourceEvidence = {
    source: ARXIV_SOURCE,
    sourceRecordId:
      `arxiv:${arxivId}:${author.name}`,
    externalId: arxivId,
    name: author.name,
    title: paper.title,
    url: publicationUrl,
    description:
      paper.summary,
    publishedAt:
      paper.published,
    metadata: {
      categories:
        paper.categories.join(","),
      primaryCategory:
        paper.primaryCategory ??
        "",
    },
    rawSignals: [
      "arXiv publication",
      ...paper.categories,
    ],
    confidence,
  };

  const publication = {
    title: paper.title,
    venue:
      paper.journalRef ??
      "arXiv",
    year:
      getYear(
        paper.published,
      ),
    authors:
      paper.authors.map(
        (item) => item.name,
      ),
    url: publicationUrl,
    researchAreas:
      paper.categories,
    evidenceId,
  };

  return {
    evidence,
    sourceEvidence,
    publication,
  };
}

/**
 * arXiv source adapter.
 */
export const arxivTechnicalTalentSource:
  TechnicalTalentDiscoverySourceAdapter =
  {
    config:
      ARXIV_CONFIG,

    async search(
      request:
        TechnicalTalentSourceQuery,
    ): Promise<TechnicalTalentSourceResult> {
      const requestedLimit =
        Math.min(
          Math.max(
            request.query.limit ??
              DEFAULT_LIMIT,
            1,
          ),
          MAX_LIMIT,
        );

      const searchQuery =
        buildArxivQuery(
          request.query,
        );

      const params =
        new URLSearchParams();

      params.set(
        "search_query",
        searchQuery,
      );

      params.set(
        "start",
        "0",
      );

      params.set(
        "max_results",
        String(
          requestedLimit,
        ),
      );

      params.set(
        "sortBy",
        "submittedDate",
      );

      params.set(
        "sortOrder",
        "descending",
      );

      const response =
        await fetch(
          `${ARXIV_API_BASE}?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept:
                "application/atom+xml",
            },
            cache:
              "no-store",
          },
        );

      if (
        !response.ok
      ) {
        throw new Error(
          `arXiv request failed with HTTP ${response.status}.`,
        );
      }

      const xml =
        await response.text();

      const papers =
        parseArxivResponse(
          xml,
        );

      const records:
        TechnicalTalentDiscoveryRecord[] =
        [];

      const evidence:
        TechnicalTalentSourceEvidence[] =
        [];

      interface AggregatedAuthor {
        name: string;
        papers: ArxivPaper[];
        evidence: DiscoveryEvidence[];
        sourceEvidence:
          TechnicalTalentSourceEvidence[];
      }

      const authors =
        new Map<
          string,
          AggregatedAuthor
        >();

      for (
        const paper of papers
      ) {
        for (
          const author of paper.authors
        ) {
          const normalizedName =
            author.name
              .trim()
              .toLowerCase();

          if (
            !normalizedName
          ) {
            continue;
          }

          const created =
            createEvidence(
              paper,
              author,
            );

          evidence.push(
            created.sourceEvidence,
          );

          const existing =
            authors.get(
              normalizedName,
            );

          if (existing) {
            existing.papers.push(
              paper,
            );

            existing.evidence.push(
              created.evidence,
            );

            existing.sourceEvidence.push(
              created.sourceEvidence,
            );

            continue;
          }

          authors.set(
            normalizedName,
            {
              name:
                author.name,
              papers: [
                paper,
              ],
              evidence: [
                created.evidence,
              ],
              sourceEvidence: [
                created.sourceEvidence,
              ],
            },
          );
        }
      }

      for (
        const [
          normalizedName,
          author,
        ] of authors
      ) {
        const publications =
          author.papers.map(
            (paper) => {
              const arxivId =
                paper.id
                  .split("/abs/")
                  .pop() ??
                paper.id;

              const evidenceForPaper =
                author.sourceEvidence.find(
                  (item) =>
                    item.externalId ===
                    arxivId,
                );

              return {
                title:
                  paper.title,
                venue:
                  paper.journalRef ??
                  "arXiv",
                year:
                  getYear(
                    paper.published,
                  ),
                authors:
                  paper.authors.map(
                    (item) =>
                      item.name,
                  ),
                url:
                  paper.id,
                researchAreas:
                  paper.categories,
                evidenceId:
                  evidenceForPaper?.sourceRecordId ??
                  `arxiv:${arxivId}:${author.name}`,
              };
            },
          );

        const researchAreas =
          Array.from(
            new Set(
              author.papers.flatMap(
                (paper) =>
                  paper.categories,
              ),
            ),
          );

        const sourceRecordIds =
          author.sourceEvidence.map(
            (item) =>
              item.sourceRecordId,
          );

        const evidenceIds =
          author.evidence.map(
            (item) =>
              item.id,
          );

        const sourcingSignals:
          DiscoverySourcingSignal[] =
          [
            {
              type:
                "Publication",
              signal:
                `${author.papers.length} arXiv research publication${
                  author.papers.length === 1
                    ? ""
                    : "s"
                }`,
              strength:
                "High",
              evidenceIds,
              explanation:
                `${author.name} is listed as an author across ${author.papers.length} public arXiv research publication${
                  author.papers.length === 1
                    ? ""
                    : "s"
                } returned by this technical search.`,
            },
            {
              type:
                "Research Activity",
              signal:
                researchAreas.join(
                  ", ",
                ),
              strength:
                "High",
              evidenceIds,
              explanation:
                `The candidate has public arXiv research activity across the categories ${researchAreas.join(
                  ", ",
                )}.`,
            },
          ];

        const firstPaper =
          author.papers[0];

        const identityKey =
          `arxiv:${normalizeNameForIdentity(
            normalizedName,
          )}`;

        records.push({
          id:
            identityKey,
          name:
            author.name,
          primaryDomain:
            inferPrimaryDomain(
              request.query,
            ),
          talentType:
            inferTalentType(
              request.query,
            ),
          roleFamily:
            inferTalentType(
              request.query,
            ),
          normalizedRole:
            inferTalentType(
              request.query,
            ),
          skills:
            buildSkills(
              request.query,
            ),
          technologies:
            buildTechnologies(
              request.query,
            ),
          researchAreas,
          publications,
          evidence:
            author.evidence,
          sourcingSignals,
          confidence:
            "High",
          approvalStatus:
            "Unreviewed",
          sourceRecordIds,
          firstDiscoveredAt:
            request.requestedAt,
          lastVerifiedAt:
            request.requestedAt,
        });
      }

      return {
        source:
          ARXIV_SOURCE,
        query: request,
        records,
        evidence,
        total:
          records.length,
        hasMore:
          papers.length >=
          requestedLimit,
        searchedAt:
          new Date().toISOString(),
      };
    },
  };

export default arxivTechnicalTalentSource;
