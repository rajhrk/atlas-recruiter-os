import assert from "node:assert/strict";
import test from "node:test";

import {
  verifyTechnicalTalentCandidate,
} from "./technicalTalentCandidateVerifier";

import type {
  DiscoveryEvidence,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function evidence(
  id: string,
  source: DiscoveryEvidence["source"],
  supports: string[],
  confidence: DiscoveryEvidence["confidence"],
  type: DiscoveryEvidence["type"] = "Technical Profile",
): DiscoveryEvidence {
  return {
    id,
    type,
    source,
    title: id,
    supports,
    confidence,
  };
}

function candidate(
  evidenceItems: DiscoveryEvidence[],
): TechnicalTalentDiscoveryRecord {
  return {
    id: "candidate-1",
    sourceRecordIds: ["test:candidate-1"],
    name: "Test Candidate",
    primaryDomain: "AI / ML",
    skills: [{ name: "Machine Learning" }],
    technologies: [{ name: "PyTorch" }],
    approvalStatus: "Unreviewed",
    evidence: evidenceItems,
  };
}

test("same-source evidence does not inflate corroboration", () => {
  const oneSource = verifyTechnicalTalentCandidate(
    candidate([
      evidence(
        "github-1",
        "GitHub",
        ["technology: PyTorch"],
        "High",
      ),
    ]),
  );

  const sameSourceDuplicates = verifyTechnicalTalentCandidate(
    candidate([
      evidence(
        "github-1",
        "GitHub",
        ["technology: PyTorch"],
        "High",
      ),
      evidence(
        "github-2",
        "GitHub",
        ["technology: PyTorch"],
        "High",
      ),
      evidence(
        "github-3",
        "GitHub",
        ["technology: PyTorch"],
        "Medium",
      ),
    ]),
  );

  assert.equal(oneSource.independentSourceCount, 1);
  assert.equal(sameSourceDuplicates.independentSourceCount, 1);
  assert.equal(oneSource.evidenceAssessments?.[0]?.independentSourceCount, 1);
  assert.equal(
    sameSourceDuplicates.evidenceAssessments?.[0]?.independentSourceCount,
    1,
  );
  assert.equal(
    sameSourceDuplicates.evidenceAssessments?.[0]?.status,
    "Single Source",
  );
  assert.equal(
    sameSourceDuplicates.evidenceAssessments?.[0]?.strength,
    "Medium",
  );
});

test("weak single-source evidence remains conservatively scored", () => {
  const result = verifyTechnicalTalentCandidate(
    candidate([
      evidence(
        "github-weak",
        "GitHub",
        ["technology: PyTorch"],
        "Low",
      ),
    ]),
  );

  const technicalAssessment =
    result.evidenceAssessments?.find(
      (assessment) => assessment.fact === "technology: pytorch",
    );

  assert.equal(result.independentSourceCount, 1);
  assert.equal(technicalAssessment?.status, "Single Source");
  assert.equal(technicalAssessment?.strength, "Low");
  assert.equal(result.technical, "Low");
  assert.ok(result.score < 50);
  assert.equal(result.status, "Unverified");
});

test("independent sources increase evidence strength only when supporting the same fact", () => {
  const result = verifyTechnicalTalentCandidate(
    candidate([
      evidence(
        "github-pytorch",
        "GitHub",
        ["technology: PyTorch"],
        "High",
      ),
      evidence(
        "openalex-pytorch",
        "OpenAlex",
        ["technology: PyTorch"],
        "High",
      ),
    ]),
  );

  const technicalAssessment =
    result.evidenceAssessments?.find(
      (assessment) => assessment.fact === "technology: pytorch",
    );

  assert.equal(result.independentSourceCount, 2);
  assert.equal(technicalAssessment?.status, "Corroborated");
  assert.equal(technicalAssessment?.strength, "High");
  assert.equal(technicalAssessment?.independentSourceCount, 2);
  assert.equal(result.technical, "High");
});

test("different facts from independent sources do not create false corroboration", () => {
  const result = verifyTechnicalTalentCandidate(
    candidate([
      evidence(
        "github-pytorch",
        "GitHub",
        ["technology: PyTorch"],
        "High",
      ),
      evidence(
        "openalex-tensorflow",
        "OpenAlex",
        ["technology: TensorFlow"],
        "High",
      ),
    ]),
  );

  const pytorch =
    result.evidenceAssessments?.find(
      (assessment) => assessment.fact === "technology: pytorch",
    );

  const tensorflow =
    result.evidenceAssessments?.find(
      (assessment) => assessment.fact === "technology: tensorflow",
    );

  assert.equal(pytorch?.status, "Single Source");
  assert.equal(pytorch?.independentSourceCount, 1);
  assert.equal(tensorflow?.status, "Single Source");
  assert.equal(tensorflow?.independentSourceCount, 1);
});
