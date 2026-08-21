import type {
  DiscoveryEvidence,
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

const GITHUB_API_BASE =
  "https://api.github.com";

const GITHUB_SOURCE =
  "GitHub" as DiscoverySource;

const GITHUB_CAPABILITIES: TechnicalTalentSourceCapabilities = {
  identity: true,
  technicalProfile: true,
  skills: true,
  technologies: true,
  repositories: true,
  openSource: true,
  locations: true,
};

const CONFIG: TechnicalTalentEnrichmentConfig = {
  source: GITHUB_SOURCE,

  name: "GitHub",

  description:
    "Enrich an existing Atlas technical talent record with public GitHub profile, repository, language, topic, and open-source evidence.",

  capabilities:
    GITHUB_CAPABILITIES,

  enabled: true,
};

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

  public_repos: number;

  followers: number;
}

interface GitHubRepository {
  id: number;

  name: string;

  full_name: string;

  html_url: string;

  description:
    | string
    | null;

  language:
    | string
    | null;

  topics?: string[];

  stargazers_count: number;

  forks_count: number;

  fork: boolean;
}

type GitHubRepositoryResponse =
  GitHubRepository[];

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

async function githubFetch<T>(
  url: string,
): Promise<T> {
  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers:
          createHeaders(),

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with status ${response.status}.`,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Extract a GitHub login from an already-resolved
 * Atlas identity.
 *
 * We intentionally only trust explicit GitHub
 * source identity here. We do NOT guess a GitHub
 * account from a person's name.
 */
function getGitHubLogin(
  candidate: TechnicalTalentDiscoveryRecord,
): string | undefined {
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
          "github:",
        )
    ) {
      continue;
    }

    /*
     * Existing Atlas GitHub IDs use the stable numeric
     * GitHub owner ID. The normalized candidate may also
     * contain the explicit GitHub login in repository
     * ownership signals.
     *
     * This is trusted source identity, not name-based
     * account guessing.
     */
    for (
      const repository of
      candidate.repositories ?? []
    ) {
      const owner =
        repository.owner?.trim();

      if (owner) {
        return owner;
      }
    }
  }

  return undefined;
}

function buildProfileEvidence(
  profile: GitHubUserProfile,
): DiscoveryEvidence {
  return {
    id:
      `github-enrichment-profile:${profile.id}`,

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
        profile.bio ??
          "",
        profile.location
          ? `Location: ${profile.location}`
          : "",
        profile.company
          ? `GitHub-declared affiliation: ${profile.company}`
          : "",
        profile.blog
          ? `Public website: ${profile.blog}`
          : "",
        `Public repositories: ${profile.public_repos}`,
        `Followers: ${profile.followers}`,
      ]
        .filter(Boolean)
        .join(" "),

    confidence:
      "High",

    supports: [
      "GitHub Identity",

      ...(profile.company
        ? [
            `GitHub-declared affiliation: ${profile.company}`,
          ]
        : []),

      ...(profile.location
        ? [profile.location]
        : []),

      ...(profile.blog
        ? [
            `Public website: ${profile.blog}`,
          ]
        : []),
    ],

    relevance:
      `Public GitHub profile for ${profile.login}.`,
  };
}

function buildRepositoryEvidence(
  repository: GitHubRepository,
): DiscoveryEvidence {
  return {
    id:
      `github-enrichment-repository:${repository.id}`,

    type:
      "Repository",

    source:
      GITHUB_SOURCE,

    title:
      repository.name,

    url:
      repository.html_url,

    description:
      repository.description ??
      undefined,

    confidence:
      repository.stargazers_count >= 100
        ? "High"
        : repository.stargazers_count >= 10
          ? "Medium"
          : "Low",

    supports: [
      ...(repository.language
        ? [repository.language]
        : []),

      ...(repository.topics ?? []),

      `${repository.stargazers_count} stars`,

      `${repository.forks_count} forks`,
    ],

    relevance:
      `Public GitHub repository ${repository.full_name}.`,
  };
}

function buildPatch(
  profile: GitHubUserProfile,
  repositories: GitHubRepository[],
): TechnicalTalentEnrichmentPatch {
  const technologies = new Map<
    string,
    {
      name: string;
    }
  >();

  const skills = new Map<
    string,
    {
      name: string;
    }
  >();

  for (
    const repository of
    repositories
  ) {
    if (
      repository.language
    ) {
      const key =
        repository.language
          .trim()
          .toLowerCase();

      technologies.set(
        key,
        {
          name:
            repository.language,
        },
      );
    }

    for (
      const topic of
      repository.topics ?? []
    ) {
      const key =
        topic
          .trim()
          .toLowerCase();

      if (!key) {
        continue;
      }

      technologies.set(
        key,
        {
          name: topic,
        },
      );

      skills.set(
        key,
        {
          name: topic,
        },
      );
    }
  }

  const repositorySignals =
    repositories.map(
      (repository) => ({
        repository:
          repository.full_name,

        url:
          repository.html_url,

        owner:
          repository.full_name.split("/")[0],

        description:
          repository.description ??
          undefined,

        languages:
          repository.language
            ? [repository.language]
            : undefined,

        technologies:
          repository.topics ??
          undefined,

        stars:
          repository.stargazers_count,

        evidenceId:
          `github-enrichment-repository:${repository.id}`,
      }),
    );

  return {
    headline:
      profile.bio ??
      undefined,

    location:
      profile.location ??
      undefined,

    affiliations:
      profile.company
        ? [
            {
              organization:
                profile.company,

              current:
                true,

              evidenceIds: [
                `github-enrichment-profile:${profile.id}`,
              ],
            },
          ]
        : undefined,

    skills:
      Array.from(
        skills.values(),
      ),

    technologies:
      Array.from(
        technologies.values(),
      ),

    repositories:
      repositorySignals,

    sourcingSignals:
      ([
        {
          type:
            "Open Source",

          signal:
            `GitHub public repositories: ${profile.public_repos}`,

          strength:
            profile.public_repos >= 10
              ? "High"
              : "Medium",

          evidenceIds: [
            `github-profile:${profile.id}`,
          ],

          explanation:
            `The candidate has ${profile.public_repos} public GitHub repositories.`,
        },

        {
          type:
            "Open Source",

          signal:
            `GitHub followers: ${profile.followers}`,

          strength:
            profile.followers >= 100
              ? "High"
              : "Medium",

          evidenceIds: [
            `github-profile:${profile.id}`,
          ],

          explanation:
            `The candidate has ${profile.followers} GitHub followers.`,
        },

        ...(repositories.length > 0
          ? [
              {
                type:
                  "Technical Depth",

                signal:
                  "GitHub technical repositories enriched",

                strength:
                  repositories.length >= 5
                    ? "High"
                    : "Medium",

                evidenceIds:
                  repositories.map(
                    (repository) =>
                      `github-repository:${repository.id}`,
                  ),

                explanation:
                  `Atlas enriched ${repositories.length} public GitHub repositories associated with this candidate.`,
              },
            ]
          : []),
      ] as DiscoverySourcingSignal[]),
  };
}

export class GitHubTechnicalTalentEnrichment
  implements TechnicalTalentEnrichmentAdapter
{
  readonly config =
    CONFIG;

  async enrich(
    candidate: TechnicalTalentDiscoveryRecord,
  ): Promise<TechnicalTalentEnrichmentResult> {
    const login =
      getGitHubLogin(
        candidate,
      );

    if (!login) {
      return {
        source:
          GITHUB_SOURCE,

        candidateId:
          candidate.id,

        evidence: [],

        confidence:
          "Low",

        warnings: [
          "No explicit GitHub identity is available on this Atlas candidate. GitHub account discovery is intentionally not guessed from the candidate name.",
        ],

        searchedAt:
          new Date().toISOString(),
      };
    }

    const profile =
      await githubFetch<GitHubUserProfile>(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(login)}`,
      );

    const repositoriesResponse =
      await githubFetch<GitHubRepositoryResponse>(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated`,
      );

    const repositories =
      repositoriesResponse.filter(
        (repository) =>
          !repository.fork,
      );

    const evidence: DiscoveryEvidence[] = [
      buildProfileEvidence(
        profile,
      ),

      ...repositories.map(
        buildRepositoryEvidence,
      ),
    ];

    return {
      source:
        GITHUB_SOURCE,

      candidateId:
        candidate.id,

      patch:
        buildPatch(
          profile,
          repositories,
        ),

      evidence,

      confidence:
        repositories.length >= 5
          ? "High"
          : "Medium",

      searchedAt:
        new Date().toISOString(),
    };
  }
}

export const githubTechnicalTalentEnrichment =
  new GitHubTechnicalTalentEnrichment();
