// ============================================================
// Atlas Recruiter OS
// SerpApi Google Scholar Provider Test
// ============================================================

import {
  createSerpApiGoogleScholarProvider,
} from "@/lib/technicalTalent/providers/research/SerpApiGoogleScholarProvider";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(
      `FAIL: ${message}`,
    );
  }

  console.log(
    `PASS: ${message}`,
  );
}

async function main(): Promise<void> {
  console.log(
    "===== ATLAS SERPAPI GOOGLE SCHOLAR PROVIDER TEST =====",
  );

  /*
   * ------------------------------------------------------------
   * MOCK FETCH
   * ------------------------------------------------------------
   */

  let capturedUrl = "";

  const mockFetch = async (
    input: RequestInfo | URL,
    _init?: RequestInit,
  ): Promise<Response> => {
    capturedUrl =
      String(input);

    return new Response(
      JSON.stringify({
        search_metadata: {
          status:
            "Success",
        },

        search_information: {
          total_results:
            1234,
        },

        organic_results: [
          {
            title:
              "Learning Robust Visual Representations for Robot Manipulation",

            link:
              "https://example.com/paper",

            snippet:
              "Research on visual representation learning for robotic manipulation.",

            publication_info: {
              summary:
                "Example Researcher, Example Robotics Lab - Robotics Conference, 2026",

              authors: [
                {
                  name:
                    "Dr. Example Researcher",

                  author_id:
                    "author-123",

                  link:
                    "https://scholar.google.com/citations?user=author-123",
                },
              ],
            },

            inline_links: {
              cited_by: {
                total:
                  42,
              },
            },
          },

          {
            title:
              "Computer Vision for Autonomous Robots",

            link:
              "https://example.com/paper-2",

            snippet:
              "Computer vision research for autonomous robotics.",

            publication_info: {
              summary:
                "Second Researcher - Robotics Journal, 2025",

              authors: [
                {
                  name:
                    "Second Researcher",
                },
              ],
            },

            inline_links: {
              cited_by: {
                total:
                  7,
              },
            },
          },
        ],

        serpapi_pagination: {
          current:
            2,

          next:
            "https://serpapi.com/search?engine=google_scholar&start=20",
        },
      }),
      {
        status:
          200,

        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );
  };

  /*
   * ------------------------------------------------------------
   * PROVIDER
   * ------------------------------------------------------------
   */

  const originalApiKey =
    process.env.SERPAPI_API_KEY;

  process.env.SERPAPI_API_KEY =
    "test-serpapi-key";

  try {
    const provider =
      createSerpApiGoogleScholarProvider(
        mockFetch,
      );

    const result =
      await provider.search(
        '"robot learning"',
        2,
        10,
      );

    /*
     * ----------------------------------------------------------
     * REQUEST
     * ----------------------------------------------------------
     */

    const requestUrl =
      new URL(
        capturedUrl,
      );

    assert(
      requestUrl.searchParams.get(
        "engine",
      ) ===
        "google_scholar",
      "SerpApi uses Google Scholar engine",
    );

    assert(
      requestUrl.searchParams.get(
        "q",
      ) ===
        '"robot learning"',
      "Atlas query is passed to SerpApi",
    );

    assert(
      requestUrl.searchParams.get(
        "start",
      ) ===
        "10",
      "Scholar page 2 maps to start 10",
    );

    assert(
      requestUrl.searchParams.get(
        "num",
      ) ===
        "10",
      "Scholar result limit is passed to SerpApi",
    );

    assert(
      requestUrl.searchParams.get(
        "api_key",
      ) ===
        "test-serpapi-key",
      "SerpApi API key is passed from environment",
    );

    /*
     * ----------------------------------------------------------
     * RESULT
     * ----------------------------------------------------------
     */

    assert(
      result.publications.length ===
        2,
      "Two Scholar publications are normalized",
    );

    assert(
      result.total ===
        1234,
      "Scholar total result count is preserved",
    );

    assert(
      result.nextPage ===
        3,
      "Scholar next page is normalized",
    );

    /*
     * ----------------------------------------------------------
     * FIRST PUBLICATION
     * ----------------------------------------------------------
     */

    const publication =
      result.publications[0];

    assert(
      publication?.title ===
        "Learning Robust Visual Representations for Robot Manipulation",
      "Publication title is preserved",
    );

    assert(
      publication?.url ===
        "https://example.com/paper",
      "Publication URL is preserved",
    );

    assert(
      publication?.description?.includes(
        "visual representation",
      ) === true,
      "Publication snippet becomes description",
    );

    assert(
      publication?.year ===
        2026,
      "Publication year is extracted",
    );

    assert(
      publication?.venue ===
        "Robotics Conference",
      "Publication venue is extracted",
    );

    assert(
      publication?.citationCount ===
        42,
      "Citation count is extracted",
    );

    /*
     * ----------------------------------------------------------
     * AUTHOR
     * ----------------------------------------------------------
     */

    const author =
      publication?.authors?.[0];

    assert(
      author?.name ===
        "Dr. Example Researcher",
      "Author name is preserved",
    );

    assert(
      author?.authorId ===
        "author-123",
      "Scholar author ID is preserved",
    );

    assert(
      author?.profileUrl ===
        "https://scholar.google.com/citations?user=author-123",
      "Scholar author profile URL is preserved",
    );

    /*
     * ----------------------------------------------------------
     * MISSING KEY
     * ----------------------------------------------------------
     */

    delete process.env.SERPAPI_API_KEY;

    const unconfigured =
      await provider.search(
        "robotics",
        1,
        10,
      );

    assert(
      unconfigured.publications.length ===
        0,
      "Missing API key returns no publications",
    );

    assert(
      (unconfigured.warnings?.length ?? 0) >
        0,
      "Missing API key returns configuration warning",
    );

    console.log(
      "\nPASS: SerpApi Google Scholar provider contract is validated.",
    );
  } finally {
    if (
      originalApiKey ===
      undefined
    ) {
      delete process.env.SERPAPI_API_KEY;
    } else {
      process.env.SERPAPI_API_KEY =
        originalApiKey;
    }
  }
}

main().catch(
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
