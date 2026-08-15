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
  const parts: string[] = [];

  for (const keyword of query.keywords ?? []) {
    const value =
      keyword.trim();

    if (value) {
      parts.push(
        `"${value}"`,
      );
    }
  }

  if (
    query.domains &&
    query.domains.length > 0
  ) {
    const domainTerms =
      query.domains
        .map((domain) =>
          domain.trim(),
        )
        .filter(Boolean);

    if (domainTerms.length > 0) {
      parts.push(
        domainTerms
          .map(
            (domain) =>
              `"${domain}"`,
          )
          .join(" OR "),
      );
    }
  }

  if (parts.length === 0) {
    return "language:C++";
  }

  return parts.join(" ");
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
function repositoryToRecord(
  repository: GitHubRepository,
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

  const talentType =
    "Engineer" as DiscoveryTalentType;

  return {
    id:
      `github:${repository.owner.id}`,

    name:
      repository.owner.login,

    headline:
      repository.description ??
      `GitHub contributor associated with ${repository.name}`,

    normalizedRole:
      "Technical Contributor",

    roleFamily:
      "Software Engineering",

    talentType,

    primaryDomain:
      "AI / ML",

    secondaryDomains: [],

    skills: [],

    technologies,

    affiliations: [],

    publications: [],

    patents: [],

    repositories: [],

    conferences: [],

    researchAreas: [],

    recruiterNotes: [
      "Discovered through GitHub repository evidence.",
      "Identity and employment should be verified using additional sources before recruiter action.",
    ],

    sourcingSignals: [],

    evidence: [],

    confidence:
      repository.stargazers_count >=
      100
        ? "High"
        : repository.stargazers_count >=
            10
          ? "Medium"
          : "Low",

    approvalStatus:
      "Unreviewed",
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

    const records =
      response.items.map(
        repositoryToRecord,
      );

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