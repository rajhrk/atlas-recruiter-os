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
    "===== ATLAS SERPAPI GOOGLE SCHOLAR AUTHOR PROVIDER TEST =====",
  );

  const originalApiKey =
    process.env.SERPAPI_API_KEY;

  process.env.SERPAPI_API_KEY =
    "test-serpapi-key";

  let capturedUrl = "";

  const mockFetch = async (
    input: RequestInfo | URL,
  ): Promise<Response> => {
    capturedUrl =
      String(input);

    return new Response(
      JSON.stringify({
        search_parameters: {
          engine:
            "google_scholar_author",

          author_id:
            "q-buMEoAAAAJ",
        },

        author: {
          name:
            "Sebastian Thrun",

          affiliations:
            "Professor of Computer Science, Stanford",

          email:
            "Verified email at stanford.edu",

          website:
            "http://robot.cc/",

          interests: [
            {
              title:
                "Machine Learning",
            },
            {
              title:
                "Artificial Intelligence",
            },
            {
              title:
                "Robotics",
            },
          ],
        },

        cited_by: {
          table: [
            {
              citations: {
                all:
                  180903,

                since_2021:
                  62118,
              },
            },
            {
              h_index: {
                all:
                  167,

                since_2021:
                  81,
              },
            },
            {
              i10_index: {
                all:
                  438,

                since_2021:
                  274,
              },
            },
          ],

          graph: [
            {
              year:
                2025,

              citations:
                12255,
            },
            {
              year:
                2026,

              citations:
                8562,
            },
          ],
        },

        articles: [
          {
            title:
              "Probabilistic robotics",

            link:
              "https://scholar.google.com/citations?view_op=view_citation",

            citation_id:
              "q-buMEoAAAAJ:JoZmwDi-zQgC",

            authors:
              "S Thrun",

            publication:
              "Communications of the ACM 45 (3), 52-57, 2002",

            year:
              "2002",

            cited_by: {
              value:
                16454,
            },
          },
        ],
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

  try {
    const provider =
      createSerpApiGoogleScholarProvider(
        mockFetch,
      );

    const profile =
      await provider.getAuthorProfile(
        "q-buMEoAAAAJ",
      );

    assert(
      capturedUrl.includes(
        "engine=google_scholar_author",
      ),
      "SerpApi uses Google Scholar author engine",
    );

    assert(
      capturedUrl.includes(
        "author_id=q-buMEoAAAAJ",
      ),
      "Scholar author ID is passed to SerpApi",
    );

    assert(
      profile !== null,
      "Author profile is returned",
    );

    assert(
      profile?.authorId ===
        "q-buMEoAAAAJ",
      "Author ID is preserved",
    );

    assert(
      profile?.name ===
        "Sebastian Thrun",
      "Author name is preserved",
    );

    assert(
      profile?.affiliation ===
        "Professor of Computer Science, Stanford",
      "Author affiliation is preserved",
    );

    assert(
      profile?.website ===
        "http://robot.cc/",
      "Author website is preserved",
    );

    assert(
      profile?.researchInterests?.includes(
        "Machine Learning",
      ) === true,
      "Machine Learning research interest is preserved",
    );

    assert(
      profile?.researchInterests?.includes(
        "Robotics",
      ) === true,
      "Robotics research interest is preserved",
    );

    assert(
      profile?.citationCount ===
        180903,
      "Total citation count is preserved",
    );

    assert(
      profile?.citationsSince2021 ===
        62118,
      "Recent citation count is preserved",
    );

    assert(
      profile?.hIndex ===
        167,
      "h-index is preserved",
    );

    assert(
      profile?.hIndexSince2021 ===
        81,
      "Recent h-index is preserved",
    );

    assert(
      profile?.i10Index ===
        438,
      "i10-index is preserved",
    );

    assert(
      profile?.i10IndexSince2021 ===
        274,
      "Recent i10-index is preserved",
    );

    assert(
      profile?.citationHistory?.length ===
        2,
      "Citation history is normalized",
    );

    assert(
      profile?.citationHistory?.some(
        (item) =>
          item.year === 2026 &&
          item.citations === 8562,
      ) === true,
      "Citation history values are preserved",
    );

    assert(
      profile?.articles?.length ===
        1,
      "Author articles are normalized",
    );

    assert(
      profile?.articles?.[0]?.title ===
        "Probabilistic robotics",
      "Author publication title is preserved",
    );

    assert(
      profile?.articles?.[0]?.citationCount ===
        16454,
      "Author publication citation count is preserved",
    );

    assert(
      profile?.articles?.[0]?.year ===
        2002,
      "Author publication year is normalized",
    );

    /*
     * The verified email is deliberately not part of the
     * normalized Atlas author profile.
     */
    assert(
      !("email" in (profile ?? {})),
      "Verified Scholar email is not imported into Atlas profile",
    );

    /*
     * Missing API key.
     */
    delete process.env.SERPAPI_API_KEY;

    const unconfiguredProvider =
      createSerpApiGoogleScholarProvider(
        async () => {
          throw new Error(
            "Fetch must not be called without an API key.",
          );
        },
      );

    const missingKeyProfile =
      await unconfiguredProvider.getAuthorProfile(
        "q-buMEoAAAAJ",
      );

    assert(
      missingKeyProfile === null,
      "Missing API key returns no author profile",
    );

    /*
     * Empty author ID.
     */
    process.env.SERPAPI_API_KEY =
      "test-serpapi-key";

    const emptyIdProvider =
      createSerpApiGoogleScholarProvider(
        async () => {
          throw new Error(
            "Fetch must not be called for an empty author ID.",
          );
        },
      );

    const emptyIdProfile =
      await emptyIdProvider.getAuthorProfile(
        "   ",
      );

    assert(
      emptyIdProfile === null,
      "Empty author ID returns no profile",
    );

    console.log(
      "\nPASS: SerpApi Google Scholar author enrichment contract is validated.",
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
    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exit(1);
  },
);
