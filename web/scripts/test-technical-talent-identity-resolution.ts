import {
  resolveTechnicalTalentIdentity,
} from "@/lib/technicalTalent/technicalTalentIdentityResolver";

import type {
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function record(
  overrides: Partial<TechnicalTalentDiscoveryRecord>,
): TechnicalTalentDiscoveryRecord {
  return {
    id: "test:record",
    name: "Alex Chen",
    primaryDomain: "AI / ML",
    skills: [],
    technologies: [],
    evidence: [],
    approvalStatus: "Unreviewed",
    ...overrides,
  };
}

function githubProfile(url: string) {
  return {
    id: "github-profile",
    type: "Technical Profile" as const,
    source: "GitHub" as const,
    title: "GitHub Profile",
    url,
    confidence: "Very High" as const,
  };
}

function main(): void {
  console.log(
    "===== ATLAS TECHNICAL TALENT IDENTITY RESOLUTION TEST =====",
  );

  const githubCandidate = record({
    id: "github:alexchen",
    name: "Alex Chen",
    affiliations: [
      {
        organization: "Atlas Robotics",
        current: true,
      },
    ],
    skills: [
      { name: "Computer Vision" },
      { name: "Machine Learning" },
    ],
    technologies: [
      { name: "PyTorch" },
    ],
    researchAreas: [
      "Embodied AI",
    ],
    normalizedRole: "Research Engineer",
    evidence: [
      githubProfile(
        "https://github.com/alexchen",
      ),
    ],
  });

  const semanticScholarCandidate = record({
    id: "semantic-scholar:author:alex-chen",
    name: "Alex Chen",
    affiliations: [
      {
        organization: "Atlas Robotics",
        current: true,
      },
    ],
    skills: [
      { name: "Computer Vision" },
      { name: "Machine Learning" },
    ],
    technologies: [
      { name: "PyTorch" },
    ],
    researchAreas: [
      "Embodied AI",
    ],
    normalizedRole: "Research Engineer",
  });

  const samePerson =
    resolveTechnicalTalentIdentity(
      githubCandidate,
      semanticScholarCandidate,
    );

  console.log(
    "\nSAME PERSON:",
    samePerson.score,
    samePerson.confidence,
    "merge=",
    samePerson.shouldMerge,
  );

  assert(
    samePerson.score >= 75,
    "Strong cross-source identity match did not reach the high-confidence threshold.",
  );

  assert(
    samePerson.reasons.length > 0,
    "Cross-source identity match has no explainable reasons.",
  );

  assert(
    !samePerson.shouldMerge ||
      samePerson.score >= 90,
    "Automatic merge occurred below the configured merge threshold.",
  );

  const sameNameA = record({
    id: "semantic-scholar:author:person-a",
    name: "Jordan Smith",
  });

  const sameNameB = record({
    id: "openreview:paper:person-b",
    name: "Jordan Smith",
  });

  const sameNameOnly =
    resolveTechnicalTalentIdentity(
      sameNameA,
      sameNameB,
    );

  console.log(
    "SAME NAME ONLY:",
    sameNameOnly.score,
    "merge=",
    sameNameOnly.shouldMerge,
  );

  assert(
    !sameNameOnly.shouldMerge,
    "Exact name alone incorrectly triggered an automatic merge.",
  );

  const openReviewAuthorA = record({
    id: "openreview:paper:123:author:0",
    name: "Priya Sharma",
    sourceRecordIds: [
      "openreview:paper:123:author:0",
    ],
    researchAreas: [
      "Robotics",
      "Embodied AI",
    ],
    publications: [
      {
        title: "Learning Manipulation",
        authors: [
          "Priya Sharma",
          "David Lee",
        ],
        researchAreas: [
          "Robotics",
        ],
      },
    ],
  });

  const openReviewAuthorB = record({
    id: "openreview:paper:123:author:1",
    name: "David Lee",
    sourceRecordIds: [
      "openreview:paper:123:author:1",
    ],
    researchAreas: [
      "Robotics",
      "Embodied AI",
    ],
    publications: [
      {
        title: "Learning Manipulation",
        authors: [
          "Priya Sharma",
          "David Lee",
        ],
        researchAreas: [
          "Robotics",
        ],
      },
    ],
  });

  const samePaperDifferentAuthors =
    resolveTechnicalTalentIdentity(
      openReviewAuthorA,
      openReviewAuthorB,
    );

  console.log(
    "SAME PAPER / DIFFERENT AUTHORS:",
    samePaperDifferentAuthors.score,
    "merge=",
    samePaperDifferentAuthors.shouldMerge,
  );

  assert(
    !samePaperDifferentAuthors.shouldMerge,
    "Different authors on the same OpenReview paper were incorrectly merged.",
  );

  assert(
    samePaperDifferentAuthors.score === 0,
    "Same-paper author isolation did not force identity score to zero.",
  );

  const openReviewA = record({
    id: "openreview:paper:111:author:0",
    name: "Maya Patel",
    sourceRecordIds: [
      "openreview:paper:111:author:0",
    ],
    researchAreas: [
      "Computer Vision",
      "Embodied AI",
    ],
    publications: [
      {
        title: "Vision Models",
        authors: [
          "Maya Patel",
          "John Smith",
        ],
        researchAreas: [
          "Computer Vision",
        ],
      },
    ],
  });

  const openReviewB = record({
    id: "openreview:paper:222:author:0",
    name: "Maya Patel",
    sourceRecordIds: [
      "openreview:paper:222:author:0",
    ],
    researchAreas: [
      "Computer Vision",
      "Embodied AI",
    ],
    publications: [
      {
        title: "Embodied Agents",
        authors: [
          "Maya Patel",
          "John Smith",
        ],
        researchAreas: [
          "Embodied AI",
        ],
      },
    ],
  });

  const sameOpenReviewAuthor =
    resolveTechnicalTalentIdentity(
      openReviewA,
      openReviewB,
    );

  console.log(
    "SAME OPENREVIEW AUTHOR:",
    sameOpenReviewAuthor.score,
    "merge=",
    sameOpenReviewAuthor.shouldMerge,
  );

  assert(
    sameOpenReviewAuthor.score > 0,
    "Same OpenReview author across different papers received no identity evidence.",
  );

  assert(
    sameOpenReviewAuthor.reasons.some(
      (reason) =>
        reason.signal ===
        "Shared co-author network",
    ),
    "Shared co-author identity evidence was not detected.",
  );

  const falsePositiveA = record({
    id: "github:johnsmith-a",
    name: "John Smith",
    affiliations: [
      {
        organization: "Company A",
      },
    ],
    skills: [
      { name: "Python" },
    ],
    technologies: [
      { name: "PyTorch" },
    ],
    researchAreas: [
      "Machine Learning",
    ],
    evidence: [
      githubProfile(
        "https://github.com/johnsmith-a",
      ),
    ],
  });

  const falsePositiveB = record({
    id: "semantic-scholar:johnsmith-b",
    name: "John Smith",
    affiliations: [
      {
        organization: "Company B",
      },
    ],
    skills: [
      { name: "Python" },
    ],
    technologies: [
      { name: "PyTorch" },
    ],
    researchAreas: [
      "Machine Learning",
    ],
  });

  const falsePositive =
    resolveTechnicalTalentIdentity(
      falsePositiveA,
      falsePositiveB,
    );

  console.log(
    "SIMILAR NAME / DIFFERENT IDENTITY:",
    falsePositive.score,
    "merge=",
    falsePositive.shouldMerge,
  );

  assert(
    !falsePositive.shouldMerge,
    "Different people with the same name were incorrectly merged.",
  );

  console.log(
    "\n===== IDENTITY RESOLUTION RESULT =====",
  );

  console.log(
    "CROSS-SOURCE IDENTITY: PASS",
  );

  console.log(
    "NAME-ONLY SAFETY: PASS",
  );

  console.log(
    "OPENREVIEW AUTHOR ISOLATION: PASS",
  );

  console.log(
    "OPENREVIEW CROSS-PAPER IDENTITY: PASS",
  );

  console.log(
    "FALSE-POSITIVE PROTECTION: PASS",
  );

  console.log(
    "\n✅ TECHNICAL TALENT IDENTITY RESOLUTION TEST PASSED",
  );
}

main();
