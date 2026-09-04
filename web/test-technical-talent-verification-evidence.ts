import assert from "node:assert/strict";

import {
  verifyTechnicalTalentCandidate,
} from "./lib/technicalTalent/technicalTalentCandidateVerifier";

import type {
  TechnicalTalentDiscoveryRecord,
} from "./types/technicalTalentDiscovery";

const record = {
  id: "test:candidate",
  name: "Evidence Researcher",

  primaryDomain: "AI / ML",

  skills: [
    {
      name: "Machine Learning",
      normalizedName: "machinelearning",
    },
    {
      name: "Deep Learning",
      normalizedName: "deeplearning",
    },
  ],

  technologies: [
    {
      name: "Python",
      normalizedName: "python",
    },
    {
      name: "PyTorch",
      normalizedName: "pytorch",
    },
  ],

  approvalStatus: "Unreviewed",

  sourceRecordIds: [
    "github:evidence-researcher",
    "openalex:author:test",
    "openreview:author:test",
  ],
  evidence: [
    {
      id: "github:pytorch",
      type: "Repository",
      source: "GitHub",
      title: "PyTorch Research Project",
      confidence: "High",
      supports: ["PyTorch"],
    },
    {
      id: "github:python",
      type: "Repository",
      source: "GitHub",
      title: "Python Project",
      confidence: "High",
      supports: ["Python"],
    },
    {
      id: "github:python-2",
      type: "Open Source Contribution",
      source: "GitHub",
      title: "Python Contribution",
      confidence: "High",
      supports: ["Python"],
    },
    {
      id: "openalex:pytorch",
      type: "Publication",
      source: "OpenAlex",
      title: "Deep Learning with PyTorch",
      confidence: "High",
      supports: ["PyTorch"],
    },
    {
      id: "openreview:pytorch",
      type: "Conference Paper",
      source: "OpenReview",
      title: "PyTorch Research",
      confidence: "High",
      supports: ["PyTorch"],
    },
  ],
} satisfies TechnicalTalentDiscoveryRecord;

const verification =
  verifyTechnicalTalentCandidate(
    record,
  );

assert.ok(
  verification.evidenceAssessments,
  "Verification should contain evidence assessments",
);

const pytorch =
  verification.evidenceAssessments.find(
    (assessment) =>
      assessment.fact === "pytorch",
  );

assert.ok(
  pytorch,
  "PyTorch assessment should exist",
);

assert.equal(
  pytorch.status,
  "Corroborated",
);

assert.equal(
  pytorch.independentSourceCount,
  3,
);

assert.equal(
  pytorch.strength,
  "Very High",
);

assert.deepEqual(
  pytorch.sources,
  [
    "GitHub",
    "OpenAlex",
    "OpenReview",
  ],
);

const python =
  verification.evidenceAssessments.find(
    (assessment) =>
      assessment.fact === "python",
  );

assert.ok(
  python,
  "Python assessment should exist",
);

assert.equal(
  python.status,
  "Single Source",
);

assert.equal(
  python.independentSourceCount,
  1,
);

assert.equal(
  python.strength,
  "Medium",
);

assert.equal(
  python.evidenceIds.length,
  2,
);

/*
 * Regression:
 * the verification score must reflect
 * independent-source corroboration.
 *
 * This fixture has PyTorch supported by
 * GitHub, OpenAlex, and OpenReview, so
 * the research category receives the
 * corresponding corroboration bonus.
 */
assert.equal(
  verification.score,
  74,
);

console.log(
  "PASS: Verification exposes fact-level evidence assessments",
);

function makeTechnicalRecord(
  evidence: Array<{
    id: string;
    source: "GitHub" | "OpenAlex" | "OpenReview" | "Semantic Scholar";
    confidence: "High";
  }>,
): TechnicalTalentDiscoveryRecord {
  return {
    id: "test:scoring",
    name: "Scoring Researcher",
    primaryDomain: "AI / ML",
    skills: [],
    technologies: [],
    approvalStatus: "Unreviewed",
    sourceRecordIds: [
      "github:scoring",
      "openalex:scoring",
      "openreview:scoring",
      "semantic-scholar:scoring",
    ],
    evidence: evidence.map((item) => ({
      ...item,
      type: "Repository",
      title: "Technical evidence",
      supports: ["PyTorch"],
    })),
  } satisfies TechnicalTalentDiscoveryRecord;
}

const oneSource = verifyTechnicalTalentCandidate(
  makeTechnicalRecord([
    {
      id: "github:1",
      source: "GitHub",
      confidence: "High",
    },
  ]),
);

const twoSources = verifyTechnicalTalentCandidate(
  makeTechnicalRecord([
    {
      id: "github:1",
      source: "GitHub",
      confidence: "High",
    },
    {
      id: "openalex:1",
      source: "OpenAlex",
      confidence: "High",
    },
  ]),
);

const threeSources = verifyTechnicalTalentCandidate(
  makeTechnicalRecord([
    {
      id: "github:1",
      source: "GitHub",
      confidence: "High",
    },
    {
      id: "openalex:1",
      source: "OpenAlex",
      confidence: "High",
    },
    {
      id: "openreview:1",
      source: "OpenReview",
      confidence: "High",
    },
  ]),
);

const fourSources = verifyTechnicalTalentCandidate(
  makeTechnicalRecord([
    {
      id: "github:1",
      source: "GitHub",
      confidence: "High",
    },
    {
      id: "openalex:1",
      source: "OpenAlex",
      confidence: "High",
    },
    {
      id: "openreview:1",
      source: "OpenReview",
      confidence: "High",
    },
    {
      id: "semantic-scholar:1",
      source: "Semantic Scholar",
      confidence: "High",
    },
  ]),
);

assert.equal(oneSource.score, 37);
assert.equal(twoSources.score, 51);
assert.equal(threeSources.score, 60);
assert.equal(fourSources.score, 65);

console.log(
  "PASS: Verification scoring applies 0/5/10/15 corroboration bonuses",
);



console.log(
  "PASS: PyTorch is Very High / 3-source corroborated",
);

console.log(
  "PASS: Python remains Single Source despite multiple GitHub items",
);

console.log(
  "PASS: Verification score reflects independent-source corroboration",
);

console.log(
  "\nVerification evidence integration regression suite passed.",
);
