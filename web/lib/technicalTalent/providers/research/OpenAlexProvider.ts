// ============================================================
// Atlas Recruiter OS
// OpenAlex Research Provider
//
// OpenAlex API adapter.
//
// This provider is responsible only for communicating with
// OpenAlex and normalizing API responses into Atlas-friendly
// research provider types.
//
// It does not:
// - create Atlas candidates
// - perform identity resolution
// - calculate candidate fit
// - approve candidates
// ============================================================

export interface OpenAlexAuthor {
  id: string;

  display_name?: string | null;

  orcid?: string | null;

  works_count?: number | null;

  cited_by_count?: number | null;

  summary_stats?: {
    "2yr_mean_citedness"?: number | null;
    h_index?: number | null;
    i10_index?: number | null;
  } | null;

  affiliations?: Array<{
    institution?: {
      id?: string | null;
      display_name?: string | null;
      country_code?: string | null;
      type?: string | null;
    } | null;

    years?: number[];
  }>;

  last_known_institutions?: Array<{
    id?: string | null;
    display_name?: string | null;
    country_code?: string | null;
    type?: string | null;
  }>;

  topics?: Array<{
    id?: string | null;
    display_name?: string | null;
    subfield?: {
      id?: string | null;
      display_name?: string | null;
    } | null;
    field?: {
      id?: string | null;
      display_name?: string | null;
    } | null;
    domain?: {
      id?: string | null;
      display_name?: string | null;
    } | null;
  }>;

  works_api_url?: string | null;
  updated_date?: string | null;
}

export interface OpenAlexWork {
  id: string;

  doi?: string | null;

  title?: string | null;

  publication_year?: number | null;

  publication_date?: string | null;

  type?: string | null;

  cited_by_count?: number | null;

  authorships?: Array<{
    author?: {
      id?: string | null;
      display_name?: string | null;
      orcid?: string | null;
    } | null;

    institutions?: Array<{
      id?: string | null;
      display_name?: string | null;
      country_code?: string | null;
    }>;
  }>;

  primary_location?: {
    landing_page_url?: string | null;

    source?: {
      id?: string | null;
      display_name?: string | null;
      issn_l?: string | null;
      type?: string | null;
    } | null;
  } | null;

  topics?: Array<{
    id?: string | null;
    display_name?: string | null;
    subfield?: {
      display_name?: string | null;
    } | null;
    field?: {
      display_name?: string | null;
    } | null;
    domain?: {
      display_name?: string | null;
    } | null;
  }>;

  abstract_inverted_index?: Record<string, number[]> | null;
}

export interface OpenAlexAuthorSearchResponse {
  meta?: {
    count?: number;
    per_page?: number;
    page?: number;
  };

  results?: OpenAlexAuthor[];
}

export interface OpenAlexWorkSearchResponse {
  meta?: {
    count?: number;
    per_page?: number;
    page?: number;
  };

  results?: OpenAlexWork[];
}

export interface OpenAlexProvider {
  searchAuthors(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
    },
  ): Promise<OpenAlexAuthorSearchResponse>;

  searchWorks(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
    },
  ): Promise<OpenAlexWorkSearchResponse>;

  getAuthor(
    authorId: string,
  ): Promise<OpenAlexAuthor>;

  getAuthorWorks(
    authorId: string,
    options?: {
      page?: number;
      perPage?: number;
    },
  ): Promise<OpenAlexWorkSearchResponse>;
}

const OPENALEX_API_BASE =
  "https://api.openalex.org";

const DEFAULT_PER_PAGE = 25;

const MAX_PER_PAGE = 100;

function normalizePerPage(
  value?: number,
): number {
  return Math.min(
    Math.max(
      value ?? DEFAULT_PER_PAGE,
      1,
    ),
    MAX_PER_PAGE,
  );
}

async function openAlexFetch<T>(
  path: string,
  params?: URLSearchParams,
): Promise<T> {
  const url =
    `${OPENALEX_API_BASE}${path}${
      params && params.toString()
        ? `?${params.toString()}`
        : ""
    }`;

  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    const retryAfter =
      response.headers.get(
        "retry-after",
      );

    let message =
      `OpenAlex request failed with HTTP ${response.status}.`;

    try {
      const body =
        (await response.json()) as {
          error?: string;
          message?: string;
        };

      if (body.error) {
        message =
          `OpenAlex API error: ${body.error}`;
      } else if (body.message) {
        message =
          `OpenAlex API error: ${body.message}`;
      }
    } catch {
      // Preserve the HTTP status message.
    }

    if (
      response.status === 429
    ) {
      message =
        retryAfter
          ? `${message} Retry after ${retryAfter} seconds.`
          : `${message} OpenAlex rate limit is active; retry later.`;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function createPaginationParams(
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): URLSearchParams {
  const params =
    new URLSearchParams();

  params.set(
    "page",
    String(
      Math.max(page, 1),
    ),
  );

  params.set(
    "per-page",
    String(
      normalizePerPage(perPage),
    ),
  );

  return params;
}

export const openAlexProvider:
  OpenAlexProvider = {
  async searchAuthors(
    query,
    options = {},
  ) {
    const params =
      createPaginationParams(
        options.page,
        options.perPage,
      );

    params.set(
      "search",
      query,
    );

    params.set(
      "select",
      [
        "id",
        "display_name",
        "orcid",
        "works_count",
        "cited_by_count",
        "summary_stats",
        "affiliations",
        "last_known_institutions",
        "topics",
        "works_api_url",
        "updated_date",
      ].join(","),
    );

    return openAlexFetch<OpenAlexAuthorSearchResponse>(
      "/authors",
      params,
    );
  },

  async searchWorks(
    query,
    options = {},
  ) {
    const params =
      createPaginationParams(
        options.page,
        options.perPage,
      );

    params.set(
      "search",
      query,
    );

    params.set(
      "select",
      [
        "id",
        "doi",
        "title",
        "publication_year",
        "publication_date",
        "type",
        "cited_by_count",
        "authorships",
        "primary_location",
        "topics",
        "abstract_inverted_index",
      ].join(","),
    );

    return openAlexFetch<OpenAlexWorkSearchResponse>(
      "/works",
      params,
    );
  },

  async getAuthor(
    authorId,
  ) {
    const normalizedId =
      authorId
        .replace(
          /^https?:\/\/openalex\.org\//,
          "",
        )
        .replace(
          /^authors\//,
          "",
        );

    const params =
      new URLSearchParams();

    params.set(
      "select",
      [
        "id",
        "display_name",
        "orcid",
        "works_count",
        "cited_by_count",
        "summary_stats",
        "affiliations",
        "last_known_institutions",
        "topics",
        "works_api_url",
        "updated_date",
      ].join(","),
    );

    return openAlexFetch<OpenAlexAuthor>(
      `/authors/${encodeURIComponent(
        normalizedId,
      )}`,
      params,
    );
  },

  async getAuthorWorks(
    authorId,
    options = {},
  ) {
    const normalizedId =
      authorId
        .replace(
          /^https?:\/\/openalex\.org\//,
          "",
        )
        .replace(
          /^authors\//,
          "",
        );

    const params =
      createPaginationParams(
        options.page,
        options.perPage,
      );

    params.set(
      "filter",
      `author.id:${normalizedId}`,
    );

    params.set(
      "sort",
      "publication_year:desc",
    );

    params.set(
      "select",
      [
        "id",
        "doi",
        "title",
        "publication_year",
        "publication_date",
        "type",
        "cited_by_count",
        "authorships",
        "primary_location",
        "topics",
        "abstract_inverted_index",
      ].join(","),
    );

    return openAlexFetch<OpenAlexWorkSearchResponse>(
      "/works",
      params,
    );
  },
};
