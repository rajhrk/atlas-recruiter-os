import {
  resolveTechnicalTalentIdentity,
} from "@/lib/technicalTalent/technicalTalentIdentityResolver";

import type {
  DiscoveryEvidence,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function evidence(
  input: DiscoveryEvidence,
): DiscoveryEvidence {
  return input;
}

function candidate(
  input: Partial<TechnicalTalentDiscoveryRecord> &
    Pick<
      TechnicalTalentDiscoveryRecord,
      "id" | "name" | "primaryDomain"
    >,
): TechnicalTalentDiscoveryRecord {
  return {
    skills: [],
    technologies: [],
    evidence: [],
    approvalStatus: "Unreviewed",
    confidence: "High",
    ...input,
  };
}

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

function runTest(
  label: string,
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  expectations: {
    shouldMerge: boolean;
    requiresReview?: boolean;
  },
): void {
  console.log(`\n=== ${label} ===`);

  const result =
    resolveTechnicalTalentIdentity(
      left,
      right,
    );

  console.log(
    JSON.stringify(
      result,
      null,
      2,
    ),
  );

  assert(
    result.shouldMerge ===
      expectations.shouldMerge,
    `shouldMerge = ${expectations.shouldMerge}`,
  );

  if (
    expectations.requiresReview !==
    undefined
  ) {
    assert(
      result.requiresReview ===
        expectations.requiresReview,
      `requiresReview = ${expectations.requiresReview}`,
    );
  }

  return;
}

const openAlexOrcid =
  "0000-0002-1234-5678";

const openAlexCandidate =
  candidate({
    id:
      "openalex:author:A123456789",

    name:
      "Alex Researcher",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "openalex:author:A123456789",
    ],

    affiliations: [
      {
        organization:
          "Example AI Lab",

        current:
          true,
      },
    ],

    evidence: [
      evidence({
        id:
          "openalex:author:A123456789",

        source:
          "OpenAlex",

        type:
          "Technical Profile",

        title:
          "Alex Researcher — OpenAlex",

        url:
          "https://openalex.org/A123456789",

        confidence:
          "Very High",

        supports: [
          "OpenAlex author identity",
        ],

        evidenceRole:
          "Profile",
      }),

      evidence({
        id:
          `openalex:orcid:${openAlexOrcid}`,

        source:
          "OpenAlex",

        type:
          "Technical Profile",

        title:
          `ORCID: ${openAlexOrcid}`,

        description:
          "OpenAlex author record contains this ORCID.",

        confidence:
          "Very High",

        supports: [
          "Person identity",
        ],

        evidenceRole:
          "Profile",
      }),
    ],
  });

const githubCandidate =
  candidate({
    id:
      "github:alex-researcher",

    name:
      "Alex Researcher",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "github:user:alex-researcher",
    ],

    affiliations: [
      {
        organization:
          "Example AI Lab",

        current:
          true,
      },
    ],

    evidence: [
      evidence({
        id:
          "github:user:alex-researcher",

        source:
          "GitHub",

        type:
          "Technical Profile",

        title:
          "Alex Researcher — GitHub",

        url:
          "https://github.com/alex-researcher",

        confidence:
          "Very High",

        supports: [
          "GitHub person identity",
        ],

        evidenceRole:
          "Profile",
      }),

      evidence({
        id:
          `github:orcid:${openAlexOrcid}`,

        source:
          "GitHub",

        type:
          "Technical Profile",

        title:
          `ORCID: ${openAlexOrcid}`,

        description:
          "GitHub profile independently identifies the same ORCID.",

        confidence:
          "Very High",

        supports: [
          "Person identity",
        ],

        evidenceRole:
          "Profile",
      }),
    ],
  });

/**
 * 1. Same ORCID
 */
runTest(
  "OPENALEX ↔ GITHUB SAME ORCID",
  openAlexCandidate,
  githubCandidate,
  {
    shouldMerge:
      true,
  },
);

/**
 * 2. Same name only
 */
const sameNameOnlyOpenAlex =
  candidate({
    id:
      "openalex:author:B111111111",

    name:
      "Jordan Smith",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "openalex:author:B111111111",
    ],
  });

const sameNameOnlyGitHub =
  candidate({
    id:
      "github:jordan-smith",

    name:
      "Jordan Smith",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "github:user:jordan-smith",
    ],
  });

runTest(
  "SAME NAME ONLY",
  sameNameOnlyOpenAlex,
  sameNameOnlyGitHub,
  {
    shouldMerge:
      false,
  },
);

/**
 * 3. Same name + affiliation.
 *
 * This is supporting evidence, not automatic
 * identity proof by itself.
 */
const affiliationOpenAlex =
  candidate({
    id:
      "openalex:author:C111111111",

    name:
      "Taylor Chen",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "openalex:author:C111111111",
    ],

    affiliations: [
      {
        organization:
          "Example AI Lab",

        current:
          true,
      },
    ],
  });

const affiliationGitHub =
  candidate({
    id:
      "github:taylor-chen",

    name:
      "Taylor Chen",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "github:user:taylor-chen",
    ],

    affiliations: [
      {
        organization:
          "Example AI Lab",

        current:
          true,
      },
    ],
  });

runTest(
  "SAME NAME + AFFILIATION",
  affiliationOpenAlex,
  affiliationGitHub,
  {
    shouldMerge:
      false,

    requiresReview:
      true,
  },
);

/**
 * 4. Different OpenAlex authors with
 * the same name must remain separate.
 */
const openAlexPersonOne =
  candidate({
    id:
      "openalex:author:D111111111",

    name:
      "Chris Lee",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "openalex:author:D111111111",
    ],

    evidence: [
      evidence({
        id:
          "openalex:author:D111111111",

        source:
          "OpenAlex",

        type:
          "Technical Profile",

        title:
          "Chris Lee — OpenAlex",

        url:
          "https://openalex.org/D111111111",

        confidence:
          "Very High",

        evidenceRole:
          "Profile",
      }),
    ],
  });

const openAlexPersonTwo =
  candidate({
    id:
      "openalex:author:E222222222",

    name:
      "Chris Lee",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "openalex:author:E222222222",
    ],

    evidence: [
      evidence({
        id:
          "openalex:author:E222222222",

        source:
          "OpenAlex",

        type:
          "Technical Profile",

        title:
          "Chris Lee — OpenAlex",

        url:
          "https://openalex.org/E222222222",

        confidence:
          "Very High",

        evidenceRole:
          "Profile",
      }),
    ],
  });

runTest(
  "TWO DIFFERENT OPENALEX AUTHORS — SAME NAME",
  openAlexPersonOne,
  openAlexPersonTwo,
  {
    shouldMerge:
      false,
  },
);

/**
 * Same-source GitHub identities must remain
 * separate without an explicit identity bridge.
 *
 * This protects against common-name, affiliation,
 * and technical-signal collisions between distinct
 * GitHub accounts.
 */
const githubPersonOne =
  candidate({
    id:
      "github:alex-researcher-one",

    name:
      "Alex Researcher",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "github:user:alex-researcher-one",
    ],

    affiliations: [
      {
        organization:
          "Example AI Lab",

        current:
          true,
      },
    ],

    technologies: [
      {
        name:
          "PyTorch",
      },
    ],
  });

const githubPersonTwo =
  candidate({
    id:
      "github:alex-researcher-two",

    name:
      "Alex Researcher",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "github:user:alex-researcher-two",
    ],

    affiliations: [
      {
        organization:
          "Example AI Lab",

        current:
          true,
      },
    ],

    technologies: [
      {
        name:
          "PyTorch",
      },
    ],
  });

runTest(
  "TWO DIFFERENT GITHUB ACCOUNTS — SAME NAME",
  githubPersonOne,
  githubPersonTwo,
  {
    shouldMerge:
      false,
  },
);

/**
 * 5. Same publication alone must not
 * establish identity.
 */
const publicationOne =
  candidate({
    id:
      "openalex:author:F111111111",

    name:
      "Morgan Patel",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "openalex:author:F111111111",
    ],

    publications: [
      {
        title:
          "Deep Learning with PyTorch",

        url:
          "https://openalex.org/W999",

        evidenceId:
          "openalex:work:W999",
      },
    ],
  });

const publicationTwo =
  candidate({
    id:
      "github:morgan-patel",

    name:
      "Morgan Patel",

    primaryDomain:
      "AI / ML",

    sourceRecordIds: [
      "github:user:morgan-patel",
    ],

    publications: [
      {
        title:
          "Deep Learning with PyTorch",

        url:
          "https://openalex.org/W999",

        evidenceId:
          "openalex:work:W999",
      },
    ],
  });

runTest(
  "SHARED PUBLICATION ONLY",
  publicationOne,
  publicationTwo,
  {
    shouldMerge:
      false,
  },
);

console.log(
  "\n=== OPENALEX IDENTITY TESTS PASSED ===",
);
