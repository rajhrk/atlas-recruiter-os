// ============================================================
// Atlas Recruiter OS
// GitHub Technical Talent Discovery Source
//
// GitHub REST API adapter.
//
// This adapter discovers technical evidence from public
// GitHub repositories. A GitHub repository owner is treated
// as a discovery signal, not automatically as a verified
// candidate identity.
// ============================================================

import type {
  DiscoveryEvidence,
  DiscoverySource,
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

const GITHUB_API_BASE =
  "https://api.github.com";

const GITHUB_SOURCE =
  "GitHub" as DiscoverySource;

const DEFAULT_PER_PAGE = 10;

const MAX_PER_PAGE = 30;

/**
 * Evidence-first GitHub discovery limits.
 *
 * Repository search is intentionally bounded because contributor
 * discovery multiplies GitHub API requests.
 */
const EVIDENCE_FIRST_MAX_REPOSITORIES = 5;

const EVIDENCE_FIRST_MAX_CONTRIBUTORS_PER_REPOSITORY = 10;

const GITHUB_SOURCE_CAPABILITIES: TechnicalTalentSourceCapabilities = {
  identity: true,
  technicalProfile: true,
  skills: true,
  technologies: true,
  repositories: true,
  openSource: true,
  locations: true,
};

const GITHUB_SOURCE_CONFIG: TechnicalTalentDiscoverySourceConfig = {
  source: GITHUB_SOURCE,

  name: "GitHub",

  description:
    "GitHub repository and open-source technical evidence for technical talent discovery.",

  capabilities:
    GITHUB_SOURCE_CAPABILITIES,

  enabled: true,
};

/**
 * Minimal GitHub repository representation.
 */
interface GitHubRepository {
  id: number;

  full_name: string;

  name: string;

  html_url: string;

  description:
    | string
    | null;

  language:
    | string
    | null;

  stargazers_count: number;

  forks_count: number;

  watchers_count: number;

  topics?: string[];

  owner: {
    login: string;

    id: number;

    html_url: string;

    type: string;
  };
}

/**
 * GitHub repository search response.
 */
interface GitHubRepositorySearchResponse {
  total_count: number;

  incomplete_results: boolean;

  items: GitHubRepository[];
}

/**
 * Minimal GitHub contributor representation.
 *
 * Contributors are only promoted to candidate identities when
 * GitHub explicitly identifies them as human users.
 */
interface GitHubContributor {
  login: string;

  id: number;

  html_url: string;

  contributions: number;

  type: string;
}

/**
 * GitHub public user profile.
 *
 * This is person-level identity evidence and is distinct
 * from repository-level evidence.
 */
interface GitHubUserProfile {
  login: string;

  id: number;

  html_url: string;

  name:
    | string
    | null;

  bio:
    | string
    | null;

  company:
    | string
    | null;

  location:
    | string
    | null;

  blog:
    | string
    | null;

  email:
    | string
    | null;

  type: string;

  public_repos: number;

  followers: number;
}

/**
 * GitHub API error shape.
 */
interface GitHubApiError {
  message?: string;

  documentation_url?: string;
}

/**
 * Convert an Atlas query into a GitHub repository search.
 */
function buildRepositorySearchQuery(
  query: TechnicalTalentDiscoveryQuery,
): string {
  const terms: string[] = [];

  const addTerms = (
    values: string[] | undefined,
  ) => {
    for (const value of values ?? []) {
      const normalized =
        value.trim();

      if (
        normalized &&
        !terms.some(
          (existing) =>
            existing.toLowerCase() ===
            normalized.toLowerCase(),
        )
      ) {
        terms.push(normalized);
      }
    }
  };

  /**
   * Technical evidence is more useful to GitHub repository
   * search than recruiter-oriented role labels.
   */
  addTerms(
    query.keywords,
  );

  addTerms(
    query.technologies,
  );

  addTerms(
    query.skills,
  );

  addTerms(
    query.researchAreas,
  );

  if (
    terms.length === 0
  ) {
    addTerms(
      query.roleFamilies,
    );
  }

  if (
    terms.length === 0 &&
    query.domains &&
    query.domains.length > 0
  ) {
    addTerms(
      query.domains,
    );
  }

  if (
    terms.length === 0
  ) {
    return "language:C++";
  }

  return terms
    .map(
      (term) =>
        `"${term.replace(/"/g, '\\"')}"`,
    )
    .join(" OR ");
}

/**
 * Create standard GitHub request headers.
 */
function createHeaders(): HeadersInit {
  const token =
    process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    Accept:
      "application/vnd.github+json",

    "X-GitHub-Api-Version":
      "2022-11-28",
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  return headers;
}

/**
 * Fetch JSON from GitHub.
 */
async function githubFetch<T>(
  url: string,
): Promise<T> {
  const response =
    await fetch(url, {
      method: "GET",

      headers:
        createHeaders(),

      cache: "no-store",
    });

  if (!response.ok) {
    let message =
      `GitHub API request failed with status ${response.status}.`;

    try {
      const error =
        (await response.json()) as GitHubApiError;

      if (error.message) {
        message =
          `GitHub API error: ${error.message}`;
      }
    } catch {
      // Keep the generic HTTP error.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch a public GitHub user profile.
 *
 * GitHub user profiles provide person-level identity
 * and affiliation signals that repository search alone
 * cannot establish.
 */
async function fetchGitHubContributors(
  owner: string,
  repository: string,
): Promise<GitHubContributor[]> {
  const url =
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contributors?per_page=${EVIDENCE_FIRST_MAX_CONTRIBUTORS_PER_REPOSITORY}`;

  const contributors =
    await githubFetch<GitHubContributor[]>(
      url,
    );

  return contributors
    .filter((contributor) => contributor.type === "User")
    .filter((contributor) => contributor.contributions > 0)
    .filter((contributor) => {
      const login = contributor.login.trim().toLowerCase();

      if (!login) return false;

      const knownAutomationLogins = new Set([
        "dependabot",
        "github-actions",
        "renovate",
        "semantic-release",
        "codecov",
        "greenkeeper",
      ]);

      if (knownAutomationLogins.has(login)) return false;
      if (login.endsWith("[bot]")) return false;

      return true;
    })
    .slice(
      0,
      EVIDENCE_FIRST_MAX_CONTRIBUTORS_PER_REPOSITORY,
    );
}

async function fetchGitHubUserProfile(
  login: string,
): Promise<GitHubUserProfile> {
  const url =
    `${GITHUB_API_BASE}/users/${encodeURIComponent(login)}`;

  return githubFetch<GitHubUserProfile>(
    url,
  );
}

/**
 * Build a GitHub repository search URL.
 */
function buildSearchUrl(
  searchQuery: string,
  perPage: number,
): string {
  const params =
    new URLSearchParams();

  params.set(
    "q",
    searchQuery,
  );

  params.set(
    "per_page",
    String(
      Math.min(
        Math.max(
          perPage,
          1,
        ),
        MAX_PER_PAGE,
      ),
    ),
  );

  params.set(
    "sort",
    "stars",
  );

  params.set(
    "order",
    "desc",
  );

  return `${GITHUB_API_BASE}/search/repositories?${params.toString()}`;
}

/**
 * Convert a GitHub repository into Atlas source evidence.
 */
function repositoryToEvidence(
  repository: GitHubRepository,
): TechnicalTalentSourceEvidence {
  const signals: string[] = [];

  if (repository.language) {
    signals.push(
      repository.language,
    );
  }

  signals.push(
    ...(repository.topics ?? []),
  );

  signals.push(
    `${repository.stargazers_count} stars`,
  );

  signals.push(
    `${repository.forks_count} forks`,
  );

  return {
    source:
      GITHUB_SOURCE,

    sourceRecordId:
      String(repository.id),

    externalId:
      repository.full_name,

    name:
      repository.owner.login,

    url:
      repository.html_url,

    title:
      repository.name,

    description:
      repository.description ??
      undefined,

    organization:
      repository.owner.type ===
      "Organization"
        ? repository.owner.login
        : undefined,

    rawSignals:
      signals,

    confidence:
      repository.stargazers_count >=
      100
        ? "High"
        : repository.stargazers_count >=
            10
          ? "Medium"
          : "Low",
  };
}

/**
 * Build a lightweight technical talent record.
 *
 * The record represents a discovery signal and does not
 * claim verified employment or identity.
 */
function inferRepositoryDomain(
  repository: GitHubRepository,
): {
  primaryDomain: TechnicalTalentDiscoveryRecord["primaryDomain"];
  secondaryDomains: TechnicalTalentDiscoveryRecord["secondaryDomains"];
} {
  const text = [
    repository.name,
    repository.description ?? "",
    repository.language ?? "",
    ...(repository.topics ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const domains: TechnicalTalentDiscoveryRecord["primaryDomain"][] = [];

  if (
    /robot|robotics|manipulation|humanoid|slam|locomotion|grasp|navigation|isaac|ros|embodied|motion planning/.test(
      text,
    )
  ) {
    domains.push("Robotics");
  }

  if (
    /embedded|firmware|microcontroller|rtos|hardware|sensor|fpga|computer architecture|edge computing/.test(
      text,
    )
  ) {
    domains.push("Hardware / Embedded");
  }

  if (
    /asic|semiconductor|silicon|vlsi|physical design|verification|dft|integrated circuit|chip design/.test(
      text,
    )
  ) {
    domains.push("Semiconductor");
  }

  if (
    /machine learning|deep learning|artificial intelligence|computer vision|nlp|natural language|transformer|llm|foundation model|generative ai|reinforcement learning/.test(
      text,
    )
  ) {
    domains.push("AI / ML");
  }

  const uniqueDomains =
    Array.from(new Set(domains));

  const primaryDomain =
    uniqueDomains[0] ??
    "AI / ML";

  return {
    primaryDomain,

    secondaryDomains:
      uniqueDomains.filter(
        (domain) =>
          domain !== primaryDomain,
      ),
  };
}

function normalizeGitHubTechnicalSignal(
  value: string,
): string {
  const normalized = value.trim().toLowerCase();

  const canonicalNames: Record<string, string> = {
    pytorch: "PyTorch",
    tensorflow: "TensorFlow",
    keras: "Keras",
    "scikit-learn": "scikit-learn",
    sklearn: "scikit-learn",
    "c++": "C++",
    cpp: "C++",
    "c#": "C#",
    csharp: "C#",
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    java: "Java",
    golang: "Go",
    go: "Go",
    rust: "Rust",
    kotlin: "Kotlin",
    swift: "Swift",
  };

  return canonicalNames[normalized] ?? value.trim();
}

function getRepositoryTechnicalSignals(
  repository: GitHubRepository,
): string[] {
  return Array.from(
    new Set(
      [
        repository.language,
        ...(repository.topics ?? []),
      ]
        .filter(
          (
            value,
          ): value is string =>
            Boolean(value?.trim()),
        )
        .map(normalizeGitHubTechnicalSignal),
    ),
  );
}

function contributorToRecord(
  contributor: GitHubContributor,
  repository: GitHubRepository,
  profile?: GitHubUserProfile,
): TechnicalTalentDiscoveryRecord {
  const technicalSignals =
    getRepositoryTechnicalSignals(repository);

  const technologies =
    technicalSignals.map(
      (name) => ({
        name,
      }),
    );

  const repositoryEvidenceId =
    `github-repository-contribution:${repository.id}:${contributor.id}`;

  const repositoryEvidence: DiscoveryEvidence = {
    id:
      repositoryEvidenceId,

    type:
      "Repository",

    source:
      GITHUB_SOURCE,

    title:
      repository.name,

    url:
      repository.html_url,

    organization:
      repository.owner.type ===
      "Organization"
        ? repository.owner.login
        : undefined,

    description:
      repository.description ??
      undefined,

    confidence:
      contributor.contributions >=
      50
        ? "High"
        : contributor.contributions >=
            10
          ? "Medium"
          : "Low",

    supports: technicalSignals,

    relevance:
      `GitHub contributor ${contributor.login} has ${contributor.contributions} recorded contributions to "${repository.full_name}".`,
  };

  const evidence: DiscoveryEvidence[] = [
    repositoryEvidence,
  ];

  if (profile) {
    evidence.push({
      id:
        `github-profile:${profile.id}`,

      type:
        "Technical Profile",

      source:
        GITHUB_SOURCE,

      title:
        `GitHub profile: ${profile.login}`,

      url:
        profile.html_url,

      organization:
        profile.company ??
        undefined,

      description:
        [
          profile.bio ?? "",
          profile.location
            ? `Location: ${profile.location}`
            : "",
          profile.public_repos !== undefined
            ? `Public repositories: ${profile.public_repos}`
            : "",
          profile.followers !== undefined
            ? `Followers: ${profile.followers}`
            : "",
        ]
          .filter(Boolean)
          .join(" "),

      confidence:
        "High",

      supports: [
        ...(profile.company
          ? [profile.company]
          : []),
        ...(profile.location
          ? [profile.location]
          : []),
      ],

      relevance:
        `Public GitHub user profile for ${profile.login}.`,
    });
  }

  const affiliations =
    profile?.company
      ? [
          {
            organization:
              profile.company,

            current:
              undefined,

            location:
              profile.location ??
              undefined,

            evidenceIds: [
              `github-profile:${profile.id}`,
            ],
          },
        ]
      : [];

  const name =
    profile?.name?.trim() ||
    contributor.login;

  const headline =
    profile?.bio?.trim() ||
    `GitHub contributor to ${repository.name}`;

  return {
    id:
      `github:${contributor.id}`,

    name,

    firstName:
      profile?.name
        ?.trim()
        ?.split(/\s+/)[0] ||
      undefined,

    headline,

    location:
      profile?.location ??
      undefined,

    primaryDomain:
      inferRepositoryDomain(
        repository,
      ).primaryDomain,

    secondaryDomains:
      inferRepositoryDomain(
        repository,
      ).secondaryDomains,

    normalizedRole:
      "Technical Contributor",

    roleFamily:
      "Software Engineering",

    talentType:
      "Software Engineer" as DiscoveryTalentType,

    skills: [],

    technologies,

    affiliations,

    publications: [],

    patents: [],

    repositories: [
      {
        repository:
          repository.html_url,

        description:
          repository.description ??
          undefined,

        url:
          repository.html_url,

        owner:
          repository.owner.login,

        languages:
          repository.language
            ? [repository.language]
            : undefined,

        technologies:
          technicalSignals.filter(
            (signal) =>
              signal !==
              normalizeGitHubTechnicalSignal(
                repository.language ?? "",
              ),
          ),

        stars:
          repository.stargazers_count,
      },
    ],

    conferences: [],

    researchAreas: [],

    recruiterNotes: [
      "Discovered through GitHub contributor evidence.",
      `Contributor to ${repository.full_name} with ${contributor.contributions} recorded contributions.`,
      profile
        ? "GitHub public profile enrichment is available as person-level identity evidence."
        : "GitHub profile enrichment was unavailable; identity should be corroborated using additional sources.",
    ],

    sourcingSignals: [
      {
        type:
          "Open Source",

        signal:
          "GitHub repository contribution",

        strength:
          contributor.contributions >=
          50
            ? "High"
            : contributor.contributions >=
                10
              ? "Medium"
              : "Low",

        evidenceIds: [
          repositoryEvidenceId,
        ],

        explanation:
          `Public GitHub contributor activity on "${repository.full_name}" provides technical and open-source evidence.`,
      },

      ...(profile
        ? [
            {
              type:
                "Company Affiliation" as const,

              signal:
                profile.company
                  ? `GitHub profile company: ${profile.company}`
                  : "GitHub public profile identity",

              strength:
                "High" as const,

              evidenceIds: [
                `github-profile:${profile.id}`,
              ],

              explanation:
                `GitHub public profile provides person-level identity evidence for ${profile.login}.`,
            },
          ]
        : []),
    ],

    evidence,

    confidence:
      profile
        ? "High"
        : contributor.contributions >=
            50
          ? "High"
          : contributor.contributions >=
              10
            ? "Medium"
            : "Low",

    approvalStatus:
      "Unreviewed",

    sourceRecordIds: [
      `github:${contributor.id}`,
    ],

    firstDiscoveredAt:
      new Date().toISOString(),
  };
}

function repositoryToRecord(
  repository: GitHubRepository,
  profile?: GitHubUserProfile,
): TechnicalTalentDiscoveryRecord {
  const technologies =
    [
      repository.language,
      ...(repository.topics ?? []),
    ]
      .filter(
        (
          value,
        ): value is string =>
          Boolean(value),
      )
      .map(
        (name) => ({
          name,
        }),
      );

  const repositoryEvidence: DiscoveryEvidence = {
    id:
      `github-repository:${repository.id}`,

    type:
      "Repository",

    source:
      GITHUB_SOURCE,

    title:
      repository.name,

    url:
      repository.html_url,

    organization:
      repository.owner.type ===
      "Organization"
        ? repository.owner.login
        : undefined,

    description:
      repository.description ??
      undefined,

    confidence:
      repository.stargazers_count >=
      100
        ? "High"
        : repository.stargazers_count >=
            10
          ? "Medium"
          : "Low",

    supports: [
      ...(repository.language
        ? [repository.language]
        : []),
      ...(repository.topics ?? []),
    ],

    relevance:
      `Public GitHub repository "${repository.name}" owned by ${repository.owner.login}.`,
  };

  const evidence: DiscoveryEvidence[] = [
    repositoryEvidence,
  ];

  if (profile) {
    evidence.push({
      id:
        `github-profile:${profile.id}`,

      type:
        "Technical Profile",

      source:
        GITHUB_SOURCE,

      title:
        `GitHub profile: ${profile.login}`,

      url:
        profile.html_url,

      organization:
        profile.company ??
        undefined,

      description:
        [
          profile.bio ?? "",
          profile.location
            ? `Location: ${profile.location}`
            : "",
          profile.public_repos !== undefined
            ? `Public repositories: ${profile.public_repos}`
            : "",
          profile.followers !== undefined
            ? `Followers: ${profile.followers}`
            : "",
        ]
          .filter(Boolean)
          .join(" "),

      confidence:
        "High",

      supports: [
        ...(profile.company
          ? [profile.company]
          : []),
        ...(profile.location
          ? [profile.location]
          : []),
      ],

      relevance:
        `Public GitHub user profile for ${profile.login}.`,
    });

    if (profile.blog?.trim()) {
      evidence.push({
        id:
          `github-website:${profile.id}`,

        type:
          "Personal Website",

        source:
          GITHUB_SOURCE,

        title:
          `Personal website: ${profile.login}`,

        url:
          profile.blog.trim(),

        description:
          `Personal website publicly linked from the GitHub profile of ${profile.login}.`,

        confidence:
          "High",

        supports: [],

        relevance:
          `The GitHub profile publicly links to this personal website for ${profile.login}.`,
      });
    }
  }

  const affiliations =
    profile?.company
      ? [
          {
            organization:
              profile.company,

            current:
              undefined,

            location:
              profile.location ??
              undefined,

            evidenceIds: [
              `github-profile:${profile.id}`,
            ],
          },
        ]
      : [];

  const name =
    profile?.name?.trim() ||
    repository.owner.login;

  const headline =
    profile?.bio?.trim() ||
    repository.description ||
    `GitHub technical contributor associated with ${repository.name}`;


  return {
    id:
      `github:${repository.owner.id}`,

    name,

    firstName:
      profile?.name
        ?.trim()
        ?.split(/\\s+/)[0] ||
      undefined,

    headline,

    location:
      profile?.location ??
      undefined,

    primaryDomain:
      inferRepositoryDomain(
        repository,
      ).primaryDomain,

    secondaryDomains:
      inferRepositoryDomain(
        repository,
      ).secondaryDomains,

    normalizedRole:
      "Technical Contributor",

    roleFamily:
      "Software Engineering",

    talentType:
      "Software Engineer" as DiscoveryTalentType,

    skills: [],

    technologies,

    affiliations,

    publications: [],

    patents: [],

    repositories: [
      {
        repository:
          repository.html_url,

        description:
          repository.description ??
          undefined,

        url:
          repository.html_url,

        owner:
          repository.owner.login,

        languages:
          repository.language
            ? [repository.language]
            : undefined,

        technologies:
          repository.topics ?? [],

        stars:
          repository.stargazers_count,

      },
    ],

    conferences: [],

    researchAreas: [],

    recruiterNotes: [
      "Discovered through GitHub repository evidence.",
      profile
        ? "GitHub public profile enrichment is available as person-level identity evidence."
        : "GitHub profile enrichment was unavailable; identity should be corroborated using additional sources.",
    ],

    sourcingSignals: [
      {
        type:
          "Open Source",

        signal:
          "GitHub repository contribution",

        strength:
          repository.stargazers_count >=
          100
            ? "High"
            : repository.stargazers_count >=
                10
              ? "Medium"
              : "Low",

        evidenceIds: [
          repositoryEvidence.id,
        ],

        explanation:
          `Public GitHub repository "${repository.name}" provides technical evidence.`,
      },

      ...(profile
        ? [
            {
              type:
                "Company Affiliation" as const,

              signal:
                profile.company
                  ? `GitHub profile company: ${profile.company}`
                  : "GitHub public profile identity",

              strength:
                "High" as const,

              evidenceIds: [
                `github-profile:${profile.id}`,
              ],

              explanation:
                `GitHub public profile provides person-level identity evidence for ${profile.login}.`,
            },
          ]
        : []),
    ],

    evidence,

    confidence:
      profile
        ? "High"
        : repository.stargazers_count >=
            100
          ? "High"
          : repository.stargazers_count >=
              10
            ? "Medium"
            : "Low",

    approvalStatus:
      "Unreviewed",

    sourceRecordIds: [
      `github:${repository.owner.id}`,
    ],

    firstDiscoveredAt:
      new Date().toISOString(),

   };
}

/**
 * GitHub technical talent source adapter.
 */
export class GitHubTechnicalTalentSource
  implements TechnicalTalentDiscoverySourceAdapter
{
  readonly config =
    GITHUB_SOURCE_CONFIG;

  async search(
    request: TechnicalTalentSourceQuery,
  ): Promise<TechnicalTalentSourceResult> {
    const searchQuery =
      buildRepositorySearchQuery(
        request.query,
      );

    const url =
      buildSearchUrl(
        searchQuery,
        DEFAULT_PER_PAGE,
      );

    const response =
      await githubFetch<GitHubRepositorySearchResponse>(
        url,
      );

    /**
     * GitHub repository search results can represent either
     * individual developers or organizations.
     *
     * Evidence-first mode deliberately does not promote
     * repository owners directly. It discovers people through
     * contributor activity instead.
     */
    let records: TechnicalTalentDiscoveryRecord[];


    if (
      request.evidenceObjectives &&
      request.evidenceObjectives.length > 0
    ) {
      /**
       * Evidence-first discovery promotes people from the
       * contributors of relevant repositories rather than
       * treating the repository owner as the only candidate.
       *
       * Only GitHub users returned by the contributor endpoint
       * are eligible. Organizations and non-user identities
       * never become candidates.
       */
      const repositoriesForContributorDiscovery =
        response.items.slice(
          0,
          EVIDENCE_FIRST_MAX_REPOSITORIES,
        );

      const contributorResults =
        await Promise.all(
          repositoriesForContributorDiscovery.map(
            async (repository) => {
              try {
                const contributors =
                  await fetchGitHubContributors(
                    repository.owner.login,
                    repository.name,
                  );

                return {
                  repository,
                  contributors,
                };
              } catch {
                return {
                  repository,
                  contributors: [],
                };
              }
            },
          ),
        );

      const contributorById =
        new Map<
          number,
          {
            contributor: GitHubContributor;
            repository: GitHubRepository;
          }
        >();

      for (
        const result of
        contributorResults
      ) {
        for (
          const contributor of
          result.contributors
        ) {
          if (
            !contributorById.has(
              contributor.id,
            )
          ) {
            contributorById.set(
              contributor.id,
              {
                contributor,
                repository:
                  result.repository,
              },
            );
          }
        }
      }

      const contributorEntries =
        Array.from(
          contributorById.values(),
        );

      const contributorProfileResults =
        await Promise.all(
          contributorEntries.map(
            async ({
              contributor,
            }) => {
              try {
                return [
                  contributor.id,
                  await fetchGitHubUserProfile(
                    contributor.login,
                  ),
                ] as const;
              } catch {
                return [
                  contributor.id,
                  undefined,
                ] as const;
              }
            },
          ),
        );

      const contributorProfiles =
        new Map(
          contributorProfileResults,
        );

      records =
        contributorEntries.map(
          ({
            contributor,
            repository,
          }) =>
            contributorToRecord(
              contributor,
              repository,
              contributorProfiles.get(
                contributor.id,
              ),
            ),
        );
    } else {
      /**
       * Legacy GitHub discovery remains owner-based.
       *
       * Only human-owned repositories become candidate
       * records. Organization-owned repositories remain
       * source evidence and discovery context.
       */
      const candidateRepositories =
        response.items.filter(
          (repository) =>
            repository.owner.type ===
            "User",
        );

      const uniqueOwners =
        Array.from(
          new Map(
            candidateRepositories.map(
              (repository) => [
                repository.owner.login,
                repository.owner.login,
              ],
            ),
          ).values(),
        );

      const profileResults =
        await Promise.all(
          uniqueOwners.map(
            async (login) => {
              try {
                return [
                  login,
                  await fetchGitHubUserProfile(
                    login,
                  ),
                ] as const;
              } catch {
                return [
                  login,
                  undefined,
                ] as const;
              }
            },
          ),
        );

      const profiles =
        new Map(
          profileResults,
        );

      records =
        candidateRepositories.map(
          (repository) =>
            repositoryToRecord(
              repository,
              profiles.get(
                repository.owner.login,
              ),
            ),
        );
    }

    const evidence =
      response.items.map(
        repositoryToEvidence,
      );

    return {
      source:
        GITHUB_SOURCE,

      query:
        request,

      records,

      evidence,

      total:
        response.total_count,

      hasMore:
        response.total_count >
        response.items.length,

      searchedAt:
        new Date().toISOString(),

      warnings:
        response.incomplete_results
          ? [
              "GitHub reported incomplete search results.",
            ]
          : undefined,
    };
  }
}

/**
 * Singleton GitHub adapter.
 */
export const githubTechnicalTalentSource =
  new GitHubTechnicalTalentSource();