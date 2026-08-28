import {
  buildGoogleScholarQuery,
  createGoogleScholarTechnicalTalentSource,
  type GoogleScholarProvider,
} from "@/lib/technicalTalent/sources/research/GoogleScholarTechnicalTalentSource";

import type {
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

async function main(): Promise<void> {
  console.log(
    "===== ATLAS GOOGLE SCHOLAR SOURCE TEST =====",
  );

  /*
   * ------------------------------------------------------------
   * MOCK PROVIDER
   * ------------------------------------------------------------
   */

  let capturedQuery = "";
  let capturedPage = 0;
  let capturedLimit = 0;

  const mockProvider:
    GoogleScholarProvider = {
    async search(
      query,
      page,
      limit,
    ) {
      capturedQuery = query;
      capturedPage = page;
      capturedLimit = limit;

      return {
        publications: [
          {
            title:
              "Learning Robust Visual Representations for Robot Manipulation",

            url:
              "https://scholar.google.com/example-paper",

            authors: [
              {
                authorId:
                  "author-123",

                name:
                  "Dr. Example Researcher",

                profileUrl:
                  "https://scholar.google.com/citations?user=author-123",

                affiliation:
                  "Example Robotics Lab",
              },
            ],

            year:
              2026,

            venue:
              "Robotics Conference",

            citationCount:
              42,

            description:
              "Research on visual representation learning for robotic manipulation.",

            researchAreas: [
              "Computer Vision",
              "Robot Learning",
              "Deep Learning",
            ],
          },
        ],

        total:
          1,

        nextPage:
          2,

        warnings: [],
      };
    },
  };

  const source =
    createGoogleScholarTechnicalTalentSource(
      mockProvider,
    );

  /*
   * ------------------------------------------------------------
   * QUERY
   * ------------------------------------------------------------
   */

  const discoveryQuery:
    TechnicalTalentDiscoveryQuery = {
    keywords: [
      "robot learning",
    ],

    domains: [
      "Robotics",
    ],
  };

  const builtQuery =
    buildGoogleScholarQuery(
      discoveryQuery,
    );

  assert(
    builtQuery.includes(
      "robot learning",
    ),
    "Scholar query contains keyword",
  );

  assert(
    builtQuery.includes(
      "robotics",
    ),
    "Scholar query contains Robotics domain terms",
  );

  /*
   * ------------------------------------------------------------
   * SEARCH
   * ------------------------------------------------------------
   */

  const result =
    await source.search({
      query:
        discoveryQuery,

      requestedSource:
        "Google Scholar",

      requestedAt:
        new Date().toISOString(),
    });

  assert(
    capturedQuery.length > 0,
    "Provider receives a constructed Scholar query",
  );

  assert(
    capturedPage === 1,
    "Scholar search starts at page 1",
  );

  assert(
    capturedLimit === 10,
    "Scholar search uses Atlas default limit",
  );

  assert(
    result.source ===
      "Google Scholar",
    "Result source is Google Scholar",
  );

  assert(
    result.records.length === 1,
    "One Scholar author record is created",
  );

  assert(
    result.total === 1,
    "Scholar total is preserved",
  );

  assert(
    result.hasMore === true,
    "Scholar pagination is detected",
  );

  assert(
    result.searchedAt.length > 0,
    "Scholar search timestamp is populated",
  );

  /*
   * ------------------------------------------------------------
   * CANDIDATE RECORD
   * ------------------------------------------------------------
   */

  const record =
    result.records[0];

  assert(
    record?.name ===
      "Dr. Example Researcher",
    "Author becomes a candidate record",
  );

  assert(
    record?.primaryDomain ===
      "Robotics",
    "Candidate primary domain is populated",
  );

  assert(
    record?.approvalStatus ===
      "Unreviewed",
    "Candidate approval status is Unreviewed",
  );

  assert(
    record?.evidence.some(
      (item) =>
        item.source ===
        "Google Scholar",
    ) === true,
    "Candidate evidence identifies Google Scholar as the source",
  );

  assert(
    record?.affiliations?.some(
      (affiliation) =>
        affiliation.organization ===
        "Example Robotics Lab",
    ) === true,
    "Author affiliation is preserved",
  );

  /*
   * ------------------------------------------------------------
   * SKILLS
   * ------------------------------------------------------------
   */

  assert(
    record?.skills.some(
      (skill) =>
        skill.name ===
        "Computer Vision",
    ) === true,
    "Research area becomes a normalized skill",
  );

  assert(
    record?.skills.some(
      (skill) =>
        skill.name ===
          "Robot Learning" &&
        skill.normalizedName ===
          "robot learning",
    ) === true,
    "Skill normalizedName is populated",
  );

  /*
   * ------------------------------------------------------------
   * PUBLICATION
   * ------------------------------------------------------------
   */

  assert(
    record?.publications?.length === 1,
    "Publication is attached to candidate",
  );

  assert(
    record?.publications?.[0]?.title ===
      "Learning Robust Visual Representations for Robot Manipulation",
    "Publication title is preserved",
  );

  assert(
    record?.publications?.[0]?.citationCount ===
      42,
    "Citation count is preserved",
  );

  /*
   * ------------------------------------------------------------
   * EVIDENCE
   * ------------------------------------------------------------
   */

  assert(
    result.evidence.length >= 1,
    "Source evidence is returned",
  );

  assert(
    record?.evidence.length >= 1,
    "Publication evidence is attached to candidate",
  );

  assert(
    record?.evidence.length >= 1,
    "Evidence is attached to candidate",
  );

  /*
   * ------------------------------------------------------------
   * SOURCING SIGNALS
   * ------------------------------------------------------------
   */

  assert(
    record?.sourcingSignals?.some(
      (signal) =>
        signal.type ===
        "Publication",
    ) === true,
    "Publication sourcing signal is created",
  );

  assert(
    record?.sourcingSignals?.some(
      (signal) =>
        signal.signal ===
        "Citation count",
    ) === true,
    "Citation sourcing signal is created",
  );

  /*
   * ------------------------------------------------------------
   * CONFIDENCE
   * ------------------------------------------------------------
   */

  assert(
    record?.confidence !==
      undefined,
    "Discovery confidence is populated",
  );

  /*
   * ------------------------------------------------------------
   * UNCONFIGURED PROVIDER
   * ------------------------------------------------------------
   */

  const unconfiguredSource =
    createGoogleScholarTechnicalTalentSource(
      null,
    );

  const unconfiguredResult =
    await unconfiguredSource.search({
      query:
        discoveryQuery,

      requestedSource:
        "Google Scholar",

      requestedAt:
        new Date().toISOString(),
    });

  assert(
    unconfiguredResult.records.length === 0,
    "Unconfigured Scholar provider returns no records",
  );

  assert(
    (unconfiguredResult.warnings?.length ?? 0) > 0,
    "Unconfigured Scholar provider returns warnings",
  );

  console.log(
    "\nPASS: Google Scholar adapter contract is validated.",
  );
}

main().catch(
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
