// ============================================================
// Atlas Recruiter OS
// OpenAlex Technical Talent Source
//
// Discovers technical talent through OpenAlex research,
// publication, author, affiliation, topic, and citation signals.
//
// IMPORTANT:
// - OpenAlex author records are research identities.
// - Publication authors are discovery signals.
// - OpenAlex alone does not establish current employment.
// - Cross-source identity resolution happens elsewhere.
// ============================================================

import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoverySource,
  DiscoverySourcingSignal,
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
  openAlexProvider,
  type OpenAlexAuthor,
  type OpenAlexWork,
} from "@/lib/technicalTalent/providers/research/OpenAlexProvider";

const OPENALEX_SOURCE:
  DiscoverySource =
  "OpenAlex";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

const OPENALEX_CAPABILITIES:
  TechnicalTalentSourceCapabilities = {
  identity: true,
  technicalProfile: true,
  skills: true,
  technologies: false,
  publications: true,
  citations: true,
  researchProjects: false,
  locations: true,
};

const OPENALEX_CONFIG:
  TechnicalTalentDiscoverySourceConfig = {
  source:
    OPENALEX_SOURCE,

  name:
    "OpenAlex",

  description:
    "Open research graph evidence for technical talent discovery, including authors, publications, affiliations, topics, and citation activity.",

  capabilities:
    OPENALEX_CAPABILITIES,

  enabled:
    true,
};

function cleanOpenAlexId(
  id: string,
): string {
  return id
    .replace(
      /^https?:\/\/openalex\.org\//,
      "",
    )
    .replace(
      /^authors\//,
      "",
    )
    .replace(
      /^works\//,
      "",
    );
}

function buildResearchQuery(
  query: TechnicalTalentDiscoveryQuery,
): string {
  const parts: string[] = [];

  if (
    query.keywords?.length
  ) {
    parts.push(
      ...query.keywords,
    );
  }

  if (
    query.domains?.length
  ) {
    parts.push(
      ...query.domains,
    );
  }

  if (
    query.skills?.length
  ) {
    parts.push(
      ...query.skills,
    );
  }

  if (
    query.researchAreas?.length
  ) {
    parts.push(
      ...query.researchAreas,
    );
  }

  return Array.from(
    new Set(
      parts
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean),
    ),
  ).join(" ");
}

function calculatePublicationRelevance(
  work: OpenAlexWork,
  query: TechnicalTalentDiscoveryQuery,
): number {
  const queryTerms =
    Array.from(
      new Set(
        [
          ...(query.keywords ?? []),
          ...(query.skills ?? []),
          ...(query.technologies ?? []),
          ...(query.researchAreas ?? []),
          ...(query.domains ?? []),
        ]
          .map(
            (value) =>
              value
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    );

  if (
    queryTerms.length === 0
  ) {
    return 0;
  }

  const title =
    (
      work.title ??
      ""
    ).toLowerCase();

  const topics =
    (
      work.topics ?? []
    )
      .map(
        (topic) =>
          topic.display_name ?? "",
      )
      .join(" ")
      .toLowerCase();

  let score = 0;

  const exactPhraseMatches =
    queryTerms.filter(
      (term) =>
        title.includes(term),
    ).length;

  const titleTermMatches =
    queryTerms.filter(
      (term) =>
        term
          .split(/\\s+/)
          .filter(Boolean)
          .some(
            (word) =>
              title.includes(word),
          ),
    ).length;

  const topicMatches =
    queryTerms.filter(
      (term) =>
        topics.includes(term),
    ).length;

  if (
    exactPhraseMatches > 0
  ) {
    score += 40;
  }

  if (
    titleTermMatches > 0
  ) {
    score += Math.min(
      titleTermMatches * 15,
      30,
    );
  }

  if (
    topicMatches > 0
  ) {
    score += Math.min(
      topicMatches * 20,
      30,
    );
  }

  return Math.min(
    score,
    100,
  );
}

function createPublicationEvidence(
  work: OpenAlexWork,
  author?: OpenAlexAuthor,
  evidenceRole:
    | "Discovery"
    | "Profile" = "Profile",
  relevanceScore?: number,
): DiscoveryEvidence {
  const workId =
    cleanOpenAlexId(
      work.id,
    );

  const authorId =
    author?.id
      ? cleanOpenAlexId(
          author.id,
        )
      : undefined;

  const citationCount =
    work.cited_by_count ?? 0;

  return {
    id:
      `openalex:work:${workId}`,

    source:
      OPENALEX_SOURCE,

    type:
      "Publication",

    title:
      work.title ??
      "OpenAlex publication",

    url:
      work.primary_location
        ?.landing_page_url ??
      work.doi ??
      `https://openalex.org/${workId}`,

    publisher:
      work.primary_location
        ?.source
        ?.display_name ??
      undefined,

    date:
      work.publication_date ??
      (
        work.publication_year
          ? `${work.publication_year}`
          : undefined
      ),

    description:
      [
        work.title,
        work.publication_year
          ? `Published ${work.publication_year}.`
          : undefined,
        citationCount > 0
          ? `${citationCount} citations.`
          : undefined,
        author?.display_name
          ? `Author: ${author.display_name}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" "),

    confidence:
      authorId
        ? "High"
        : "Medium",

    supports:
      [
        ...(
          work.topics ?? []
        )
          .map(
            (topic) =>
              topic.display_name,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ],

    relevance:
      relevanceScore !== undefined
        ? `OpenAlex publication relevance score: ${relevanceScore}/100.`
        : "OpenAlex publication evidence supporting technical or research expertise.",

    evidenceRole,
  };
}

function createAuthorEvidence(
  author: OpenAlexAuthor,
): DiscoveryEvidence {
  const authorId =
    cleanOpenAlexId(
      author.id,
    );

  const worksCount =
    author.works_count ?? 0;

  const citationCount =
    author.cited_by_count ?? 0;

  return {
    id:
      `openalex:author:${authorId}`,

    source:
      OPENALEX_SOURCE,

    type:
      "Technical Profile",

    title:
      author.display_name ??
      "OpenAlex author",

    url:
      `https://openalex.org/authors/${authorId}`,

    description:
      [
        author.display_name,
        worksCount > 0
          ? `${worksCount} works.`
          : undefined,
        citationCount > 0
          ? `${citationCount} citations.`
          : undefined,
        author.orcid
          ? "ORCID is available."
          : undefined,
      ]
        .filter(Boolean)
        .join(" "),

    ...(author.orcid
      ? {
          id:
            `openalex:author:${authorId}:orcid:${author.orcid
              .replace(/^https?:\/\/orcid\.org\//i, "")
              .trim()}`,
        }
      : {}),

    confidence:
      author.display_name
        ? "High"
        : "Medium",

    supports:
      [
        ...(
          author.topics ?? []
        )
          .map(
            (topic) =>
              topic.display_name,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ],

    relevance:
      "OpenAlex author-level research profile evidence.",
  };
}

function createCitationEvidence(
  author: OpenAlexAuthor,
): DiscoveryEvidence | undefined {
  const citationCount =
    author.cited_by_count;

  if (
    citationCount === null ||
    citationCount === undefined
  ) {
    return undefined;
  }

  const authorId =
    cleanOpenAlexId(
      author.id,
    );

  return {
    id:
      `openalex:author:${authorId}:citations`,

    source:
      OPENALEX_SOURCE,

    type:
      "Citation",

    title:
      `${author.display_name ?? "Author"} citation activity`,

    url:
      `https://openalex.org/authors/${authorId}`,

    description:
      `${citationCount} citations recorded by OpenAlex.`,

    confidence:
      "High",

    supports: [],

    relevance:
      "OpenAlex citation count is a research-activity signal, not an identity-verification signal.",
  };
}

function createSourcingSignals(
  author: OpenAlexAuthor,
  evidenceIds: string[],
): DiscoverySourcingSignal[] {
  const signals:
    DiscoverySourcingSignal[] =
    [];

  const worksCount =
    author.works_count ?? 0;

  const citationCount =
    author.cited_by_count ?? 0;

  const hIndex =
    author.summary_stats
      ?.h_index;

  const i10Index =
    author.summary_stats
      ?.i10_index;

  if (
    worksCount > 0
  ) {
    signals.push({
      type:
        "Research Activity",

      signal:
        "Research publication activity",

      strength:
        worksCount >= 20
          ? "High"
          : "Medium",

      evidenceIds,

      explanation:
        `${worksCount} OpenAlex works are associated with the author.`,
    });
  }

  if (
    citationCount > 0
  ) {
    signals.push({
      type:
        "Research Activity",

      signal:
        "Citation count",

      strength:
        citationCount >= 100
          ? "High"
          : "Medium",

      evidenceIds,

      explanation:
        `${citationCount} citations are recorded by OpenAlex.`,
    });
  }

  if (
    hIndex !== null &&
    hIndex !== undefined
  ) {
    signals.push({
      type:
        "Research Activity",

      signal:
        "h-index",

      strength:
        hIndex >= 10
          ? "High"
          : "Medium",

      evidenceIds,

      explanation:
        `OpenAlex reports an h-index of ${hIndex}.`,
    });
  }

  if (
    i10Index !== null &&
    i10Index !== undefined
  ) {
    signals.push({
      type:
        "Research Activity",

      signal:
        "i10-index",

      strength:
        i10Index >= 10
          ? "High"
          : "Medium",

      evidenceIds,

      explanation:
        `OpenAlex reports an i10-index of ${i10Index}.`,
    });
  }

  return signals;
}

function normalizeAuthor(
  author: OpenAlexAuthor,
  query: TechnicalTalentDiscoveryQuery,
  works: OpenAlexWork[],
  evidence: DiscoveryEvidence[],
  technologies: TechnicalTalentDiscoveryRecord["technologies"] = [],
): TechnicalTalentDiscoveryRecord {
  const authorId =
    cleanOpenAlexId(
      author.id,
    );

  const evidenceIds =
    evidence.map(
      (item) =>
        item.id,
    );

  const researchAreas =
    Array.from(
      new Set(
        (
          author.topics ?? []
        )
          .map(
            (topic) =>
              topic.display_name,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ),
    );

  const skills: TechnicalTalentDiscoveryRecord["skills"] = [];

  const affiliations =
    (
      author.affiliations ??
      []
    )
      .map(
        (affiliation) => {
          const organization =
            affiliation
              .institution
              ?.display_name;

          if (!organization) {
            return undefined;
          }

          const currentYear =
            new Date()
              .getFullYear();

          const years =
            affiliation.years ??
            [];

          return {
            organization,

            current:
              years.includes(
                currentYear,
              ),

            evidenceIds,
          };
        },
      )
      .filter(
        (
          value,
        ): value is {
          organization: string;
          current: boolean;
          evidenceIds: string[];
        } =>
          Boolean(value),
      );

  const uniqueWorks =
    Array.from(
      new Map(
        works
          .filter(
            (
              work,
            ) =>
              Boolean(
                work.title,
              ),
          )
          .map(
            (work) => [
              cleanOpenAlexId(
                work.id,
              ),
              work,
            ],
          ),
      ).values(),
    );

  const publications =
    uniqueWorks
      .map(
        (work) => ({
          title:
            work.title!,

          url:
            work.primary_location
              ?.landing_page_url ??
            work.doi ??
            `https://openalex.org/${cleanOpenAlexId(work.id)}`,

          year:
            work.publication_year ??
            undefined,

          venue:
            work.primary_location
              ?.source
              ?.display_name ??
            undefined,

          citationCount:
            work.cited_by_count ??
            undefined,
        }),
      );

  const firstInstitution =
    author
      .last_known_institutions
      ?.[0];

  const citationEvidence =
    createCitationEvidence(
      author,
    );

  const allEvidence =
    citationEvidence
      ? [
          ...evidence,
          citationEvidence,
        ]
      : evidence;

  const allEvidenceIds =
    allEvidence.map(
      (item) =>
        item.id,
    );

  const authorEvidence =
    createAuthorEvidence(
      author,
    );

  return {
    id:
      `openalex:${authorId}`,

    name:
      author.display_name ??
      "Unknown OpenAlex author",

    primaryDomain:
      query.domains?.[0] ??
      "AI / ML",

    talentType:
      "Research Scientist",


    country:
      firstInstitution
        ?.country_code ??
      undefined,

    affiliations,

    skills,

    technologies,

    researchAreas,

    publications,

    evidence:
      [
        ...allEvidence,
        authorEvidence,
      ],

    sourcingSignals:
      createSourcingSignals(
        author,
        allEvidenceIds,
      ),

    confidence:
      author.display_name
        ? "High"
        : "Medium",

    approvalStatus:
      "Unreviewed",

    sourceRecordIds:
      [
        `openalex:author:${authorId}`,
      ],

    firstDiscoveredAt:
      new Date().toISOString(),

  };
}

function toSourceEvidence(
  evidence: DiscoveryEvidence,
): TechnicalTalentSourceEvidence {
  return {
    source:
      OPENALEX_SOURCE,

    sourceRecordId:
      evidence.id,

    externalId:
      evidence.id,

    name:
      evidence.title,

    headline:
      evidence.title,

    url:
      evidence.url,

    title:
      evidence.title,

    description:
      evidence.description,

    publishedAt:
      evidence.date,

    metadata:
      {
        evidenceType:
          evidence.type,

        publisher:
          evidence.publisher ??
          "",

        supports:
          (
            evidence.supports ??
            []
          ).join(", "),
      },

    rawSignals:
      evidence.supports ??
      [],

    confidence:
      evidence.confidence,
  };
}

export const openAlexTechnicalTalentSource:
  TechnicalTalentDiscoverySourceAdapter =
  {
    config:
      OPENALEX_CONFIG,

    async search(
      request:
        TechnicalTalentSourceQuery,
    ): Promise<TechnicalTalentSourceResult> {
      const query =
        request.query;

      const searchQuery =
        buildResearchQuery(
          query,
        );

      if (!searchQuery) {
        throw new Error(
          "OpenAlex discovery requires at least one keyword, domain, skill, or research area.",
        );
      }

      const limit =
        Math.min(
          Math.max(
            query.limit ??
              DEFAULT_LIMIT,
            1,
          ),
          MAX_LIMIT,
        );

      const offset =
        query.offset ??
        0;

      const page =
        Math.floor(
          offset / limit,
        ) + 1;

      const response =
        await openAlexProvider.searchWorks(
          searchQuery,
          {
            page,

            perPage:
              limit,
          },
        );

      const authors =
        new Map<
          string,
          OpenAlexAuthor
        >();

      const matchedWorksByAuthor =
        new Map<
          string,
          OpenAlexWork[]
        >();

      for (
        const work of
          response.results ?? []
      ) {
        for (
          const authorship of
            work.authorships ?? []
        ) {
          const author =
            authorship.author;

          if (
            !author?.id ||
            !author.display_name
          ) {
            continue;
          }

          const authorId =
            cleanOpenAlexId(
              author.id,
            );

          if (
            !authors.has(
              authorId,
            )
          ) {
            authors.set(
              authorId,
              {
                id:
                  author.id,

                display_name:
                  author.display_name,

                orcid:
                  author.orcid ??
                  undefined,
              },
            );
          }

          const matchedWorks =
            matchedWorksByAuthor.get(
              authorId,
            ) ??
            [];

          matchedWorks.push(
            work,
          );

          matchedWorksByAuthor.set(
            authorId,
            matchedWorks,
          );
        }
      }

      const records:
        TechnicalTalentDiscoveryRecord[] =
        [];

      const evidence:
        DiscoveryEvidence[] =
        [];

      for (
        const [
          authorId,
          partialAuthor,
        ] of authors
      ) {
        try {
          const author =
            await openAlexProvider.getAuthor(
              authorId,
            );

          const authorEvidence =
            createAuthorEvidence(
              author,
            );

          const matchedWorks =
            matchedWorksByAuthor.get(
              authorId,
            ) ??
            [];

          /**
           * Extract explicitly requested technologies from
           * matched publication titles and abstracts.
           *
           * A technology is only added when the publication
           * text actually contains the requested technology.
           */
          const technologies =
            (query.technologies ?? [])
              .map(
                (technologyName) => {
                  const name =
                    technologyName.trim();

                  const normalizedName =
                    name.toLowerCase();

                  if (!normalizedName) {
                    return undefined;
                  }

                  const evidenceIds =
                    matchedWorks
                      .filter(
                        (work: OpenAlexWork) => {
                          const title =
                            work.title ??
                            "";

                          const abstract =
                            Object.keys(
                              work.abstract_inverted_index ??
                                {},
                            ).join(" ");

                          const searchableText =
                            `${title} ${abstract}`
                              .toLowerCase();

                          return searchableText.includes(
                            normalizedName,
                          );
                        },
                      )
                      .map(
                        (work: OpenAlexWork) =>
                          `openalex:work:${cleanOpenAlexId(work.id)}`,
                      );

                  if (
                    evidenceIds.length === 0
                  ) {
                    return undefined;
                  }

                  return {
                    name,

                    normalizedName,

                    domain:
                      query.domains?.[0] ??
                      "AI / ML",

                    evidenceIds,
                  };
                },
              )
              .filter(
                (
                  technology,
                ): technology is NonNullable<
                  typeof technology
                > =>
                  technology !== undefined,
              );

          const authorWorksEvidence =
            matchedWorks.map(
              (work: OpenAlexWork) =>
                createPublicationEvidence(
                  work,
                  author,
                ),
            );

          const citationEvidence =
            createCitationEvidence(
              author,
            );

          const authorEvidenceSet =
            [
              authorEvidence,
              ...authorWorksEvidence,
              ...(citationEvidence
                ? [
                    citationEvidence,
                  ]
                : []),
            ];

          evidence.push(
            ...authorEvidenceSet,
          );

          const uniqueMatchedWorks =
            Array.from(
              new Map(
                matchedWorks.map(
                  (work) => {
                    const normalizedTitle =
                      (
                        work.title ??
                        ""
                      )
                        .trim()
                        .toLowerCase()
                        .replace(
                          /\\s+/g,
                          " ",
                        );

                    const normalizedDoi =
                      (
                        work.doi ??
                        ""
                      )
                        .trim()
                        .toLowerCase()
                        .replace(
                          /^https?:\/\/(doi\.org\/)?/,
                          "",
                        );

                    const identity =
                      normalizedDoi ||
                      (
                        normalizedTitle &&
                        work.publication_year
                          ? `${normalizedTitle}:${work.publication_year}`
                          : cleanOpenAlexId(
                              work.id,
                            )
                      );

                    return [
                      identity,
                      work,
                    ];
                  },
                ),
              ).values(),
            );

          const rankedMatchedWorks =
            uniqueMatchedWorks
              .map(
                (work) => ({
                  work,
                  relevanceScore:
                    calculatePublicationRelevance(
                      work,
                      query,
                    ),
                }),
              )
              .sort(
                (left, right) =>
                  right.relevanceScore -
                  left.relevanceScore,
              )
              .slice(
                0,
                5,
              );

          const discoveryEvidence =
            rankedMatchedWorks.map(
              ({
                work,
                relevanceScore,
              }) =>
                createPublicationEvidence(
                  work,
                  author,
                  "Discovery",
                  relevanceScore,
                ),
            );

          evidence.push(
            ...discoveryEvidence,
          );

          records.push(
            normalizeAuthor(
              author,
              query,
              matchedWorks,
              [
                ...authorEvidenceSet,
                ...discoveryEvidence,
              ],
              technologies,
            ),
          );
        } catch {
          const fallbackEvidence =
            [
              createAuthorEvidence(
                partialAuthor,
              ),
            ];

          evidence.push(
            ...fallbackEvidence,
          );

          records.push(
            normalizeAuthor(
              partialAuthor,
              query,
              [],
              fallbackEvidence,
            ),
          );
        }
      }

      const uniqueEvidence =
        Array.from(
          new Map(
            evidence.map(
              (item) => [
                item.id,
                item,
              ],
            ),
          ).values(),
        );

      const sourceEvidence =
        uniqueEvidence.map(
          toSourceEvidence,
        );

      const total =
        response.meta?.count ??
        records.length;

      const perPage =
        response.meta?.per_page ??
        limit;

      const currentPage =
        response.meta?.page ??
        page;

      const totalPages =
        perPage > 0
          ? Math.ceil(
              total /
                perPage,
            )
          : currentPage;

      const hasMore =
        currentPage <
        totalPages;

      return {
        source:
          OPENALEX_SOURCE,

        query:
          request,

        records,

        evidence:
          sourceEvidence,

        total,

        hasMore,

        nextCursor:
          hasMore
            ? String(
                currentPage + 1,
              )
            : undefined,

        searchedAt:
          new Date().toISOString(),

        warnings: [
          "OpenAlex publication authors are discovery signals and are not automatically verified identities.",
          "OpenAlex does not independently establish current employment.",
          "Cross-source corroboration is required for stronger identity and employment verification.",
        ],
      };
    },
  };
