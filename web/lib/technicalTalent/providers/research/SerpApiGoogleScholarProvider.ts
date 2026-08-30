// ============================================================
// Atlas Recruiter OS
// SerpApi Google Scholar Provider
//
// External retrieval provider for the Google Scholar
// technical-talent discovery adapter.
//
// Responsibilities:
// - call SerpApi's Google Scholar endpoint
// - normalize SerpApi publication/author results into the
//   GoogleScholarProvider contract
// - preserve pagination and citation signals
//
// This provider does NOT:
// - verify identities
// - score candidates
// - deduplicate candidates
// - perform Atlas normalization
// ============================================================

import type {
  GoogleScholarAuthor,
  GoogleScholarAuthorProfile,
  GoogleScholarPublication,
  GoogleScholarProvider,
  GoogleScholarProviderResult,
} from "@/lib/technicalTalent/sources/research/GoogleScholarTechnicalTalentSource";

const SERPAPI_BASE_URL =
  "https://serpapi.com/search.json";

const DEFAULT_LIMIT =
  10;

const MAX_LIMIT =
  20;

interface SerpApiAuthor {
  name?: string;
  author_id?: string;
  link?: string;
}

interface SerpApiPublicationInfo {
  summary?: string;
  authors?: SerpApiAuthor[];
}

interface SerpApiCitedBy {
  total?: number;
}

interface SerpApiInlineLinks {
  cited_by?: SerpApiCitedBy;
}

interface SerpApiOrganicResult {
  title?: string;
  link?: string;
  snippet?: string;
  publication_info?: SerpApiPublicationInfo;
  inline_links?: SerpApiInlineLinks;
}

interface SerpApiError {
  error?: string;
  message?: string;
}

interface SerpApiAuthorProfileArticle {
  title?: string;
  link?: string;
  citation_id?: string;
  authors?: string;
  publication?: string;
  year?: string | number;
  cited_by?: {
    value?: number;
  };
}

interface SerpApiAuthorProfileResponse {
  author?: {
    name?: string;
    affiliations?: string;
    email?: string;
    website?: string;
    interests?: Array<{
      title?: string;
    }>;
  };

  cited_by?: {
    table?: Array<{
      citations?: {
        all?: number;
        since_2021?: number;
      };

      h_index?: {
        all?: number;
        since_2021?: number;
      };

      i10_index?: {
        all?: number;
        since_2021?: number;
      };
    }>;

    graph?: Array<{
      year?: number;
      citations?: number;
    }>;
  };

  articles?: SerpApiAuthorProfileArticle[];

  error?: string;
}

interface SerpApiResponse {
  search_metadata?: {
    status?: string;
  };

  search_information?: {
    total_results?: number;
  };

  organic_results?: SerpApiOrganicResult[];

  serpapi_pagination?: {
    current?: number;
    next?: string;
  };

  error?: string;
}

/**
 * Fetch implementation is injectable so tests never need to
 * contact SerpApi.
 */
export type SerpApiFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

/**
 * Extract a four-digit publication year from Scholar's
 * publication summary.
 *
 * Example:
 * "A. Researcher, 2026, Robotics Conference"
 */
function extractYear(
  summary:
    | string
    | undefined,
): number | undefined {
  if (!summary) {
    return undefined;
  }

  const match =
    summary.match(
      /\b(19|20)\d{2}\b/,
    );

  return match
    ? Number(match[0])
    : undefined;
}

/**
 * Extract the venue from Scholar's publication summary.
 *
 * Scholar commonly returns:
 * "Author A, Author B - Venue, 2026"
 *
 * This deliberately remains conservative. The summary is
 * preserved only when a useful venue can be inferred.
 */
function extractVenue(
  summary:
    | string
    | undefined,
): string | undefined {
  if (!summary) {
    return undefined;
  }

  const yearMatch =
    summary.match(
      /\b(19|20)\d{2}\b/,
    );

  if (!yearMatch) {
    return undefined;
  }

  const beforeYear =
    summary
      .slice(
        0,
        yearMatch.index,
      )
      .trim();

  const separator =
    beforeYear.lastIndexOf(
      " - ",
    );

  if (separator < 0) {
    return undefined;
  }

  const venue =
    beforeYear
      .slice(
        separator + 3,
      )
      .trim()
      .replace(
        /[,.]+$/,
        "",
      )
      .trim();

  return venue || undefined;
}

/**
 * Normalize a SerpApi Scholar author.
 */
function normalizeAuthor(
  author: SerpApiAuthor,
): GoogleScholarAuthor | null {
  const name =
    author.name?.trim();

  if (!name) {
    return null;
  }

  return {
    authorId:
      author.author_id,

    name,

    profileUrl:
      author.link,
  };
}

/**
 * Normalize one SerpApi Scholar result.
 */
function normalizePublication(
  result: SerpApiOrganicResult,
): GoogleScholarPublication | null {
  const title =
    result.title?.trim();

  if (!title) {
    return null;
  }

  const summary =
    result.publication_info?.summary;

  const authors =
    (
      result.publication_info?.authors ??
      []
    )
      .map(normalizeAuthor)
      .filter(
        (
          author,
        ): author is GoogleScholarAuthor =>
          author !== null,
      );

  const citationCount =
    result.inline_links?.cited_by?.total;

  return {
    title,

    url:
      result.link,

    authors,

    year:
      extractYear(summary),

    venue:
      extractVenue(summary),

    citationCount,

    description:
      result.snippet,

    researchAreas: [],
  };
}

/**
 * Create a SerpApi Google Scholar provider.
 */
export function createSerpApiGoogleScholarProvider(
  fetchImpl:
    SerpApiFetch = fetch,
): GoogleScholarProvider {
  return {
    async getAuthorProfile(
      authorId,
    ): Promise<GoogleScholarAuthorProfile | null> {
      const apiKey =
        process.env.SERPAPI_API_KEY;

      if (!apiKey) {
        return null;
      }

      const safeAuthorId =
        authorId.trim();

      if (!safeAuthorId) {
        return null;
      }

      const params =
        new URLSearchParams();

      params.set(
        "engine",
        "google_scholar_author",
      );

      params.set(
        "author_id",
        safeAuthorId,
      );

      params.set(
        "hl",
        "en",
      );

      params.set(
        "num",
        "20",
      );

      params.set(
        "api_key",
        apiKey,
      );

      params.set(
        "output",
        "json",
      );

      const response =
        await fetchImpl(
          `${SERPAPI_BASE_URL}?${params.toString()}`,
          {
            method:
              "GET",

            headers: {
              Accept:
                "application/json",
            },

            cache:
              "no-store",
          },
        );

      if (!response.ok) {
        throw new Error(
          `SerpApi Google Scholar author request failed with HTTP ${response.status}.`,
        );
      }

      const body =
        (await response.json()) as
          SerpApiAuthorProfileResponse;

      if (body.error) {
        throw new Error(
          `SerpApi Google Scholar author error: ${body.error}`,
        );
      }

      const name =
        body.author?.name?.trim();

      if (!name) {
        return null;
      }

      const table =
        body.cited_by?.table ?? [];

      const citationStats =
        table.find(
          (item) =>
            item.citations !==
            undefined,
        )?.citations;

      const hIndex =
        table.find(
          (item) =>
            item.h_index !==
            undefined,
        )?.h_index;

      const i10Index =
        table.find(
          (item) =>
            item.i10_index !==
            undefined,
        )?.i10_index;

      return {
        authorId:
          safeAuthorId,

        name,

        profileUrl:
          `https://scholar.google.com/citations?user=${encodeURIComponent(safeAuthorId)}&hl=en`,

        affiliation:
          body.author?.affiliations,

        researchInterests:
          (
            body.author?.interests ??
            []
          )
            .map(
              (interest) =>
                interest.title?.trim(),
            )
            .filter(
              (
                interest,
              ): interest is string =>
                Boolean(interest),
            ),

        citationCount:
          citationStats?.all,

        citationsSince2021:
          citationStats?.since_2021,

        hIndex:
          hIndex?.all,

        hIndexSince2021:
          hIndex?.since_2021,

        i10Index:
          i10Index?.all,

        i10IndexSince2021:
          i10Index?.since_2021,

        website:
          body.author?.website,

        citationHistory:
          (
            body.cited_by?.graph ??
            []
          )
            .filter(
              (
                item,
              ): item is {
                year: number;
                citations: number;
              } =>
                item.year !== undefined &&
                item.citations !== undefined,
            ),

        articles:
          (
            body.articles ??
            []
          ).map(
            (article) => ({
              title:
                article.title ??
                "",

              url:
                article.link,

              citationId:
                article.citation_id,

              authors:
                article.authors,

              publication:
                article.publication,

              year:
                article.year !==
                undefined
                  ? Number(
                      article.year,
                    )
                  : undefined,

              citationCount:
                article.cited_by?.value,
            }),
          ),
      };
    },

    async search(
      query,
      page,
      limit,
    ): Promise<GoogleScholarProviderResult> {
      const apiKey =
        process.env.SERPAPI_API_KEY;

      if (!apiKey) {
        return {
          publications: [],

          warnings: [
            "SERPAPI_API_KEY is not configured.",
            "Google Scholar live discovery requires a configured SerpApi API key.",
          ],
        };
      }

      const safePage =
        Math.max(
          page,
          1,
        );

      const safeLimit =
        Math.min(
          Math.max(
            limit || DEFAULT_LIMIT,
            1,
          ),
          MAX_LIMIT,
        );

      const start =
        (safePage - 1) *
        safeLimit;

      const params =
        new URLSearchParams();

      params.set(
        "engine",
        "google_scholar",
      );

      params.set(
        "q",
        query,
      );

      params.set(
        "start",
        String(start),
      );

      params.set(
        "num",
        String(safeLimit),
      );

      params.set(
        "api_key",
        apiKey,
      );

      params.set(
        "output",
        "json",
      );

      const response =
        await fetchImpl(
          `${SERPAPI_BASE_URL}?${params.toString()}`,
          {
            method:
              "GET",

            headers: {
              Accept:
                "application/json",
            },

            cache:
              "no-store",
          },
        );

      if (!response.ok) {
        let message =
          `SerpApi Google Scholar request failed with HTTP ${response.status}.`;

        try {
          const body =
            (await response.json()) as
              SerpApiError;

          if (
            body.error ||
            body.message
          ) {
            message =
              body.error ??
              body.message ??
              message;
          }
        } catch {
          // Preserve HTTP error.
        }

        throw new Error(
          message,
        );
      }

      const body =
        (await response.json()) as
          SerpApiResponse;

      if (body.error) {
        throw new Error(
          `SerpApi Google Scholar error: ${body.error}`,
        );
      }

      const publications =
        (
          body.organic_results ??
          []
        )
          .map(
            normalizePublication,
          )
          .filter(
            (
              publication,
            ): publication is GoogleScholarPublication =>
              publication !== null,
          );

      const currentPage =
        body.serpapi_pagination?.current ??
        safePage;

      const hasNextPage =
        Boolean(
          body.serpapi_pagination?.next,
        );

      return {
        publications,

        total:
          body.search_information?.total_results ??
          publications.length,

        nextPage:
          hasNextPage
            ? currentPage + 1
            : undefined,

        warnings: [],
      };
    },
  };
}

/**
 * Default production provider.
 *
 * The Google Scholar adapter remains safe when the API key
 * is absent because the provider reports configuration
 * warnings instead of making an unauthenticated request.
 */
export const serpApiGoogleScholarProvider =
  createSerpApiGoogleScholarProvider();

export default serpApiGoogleScholarProvider;
