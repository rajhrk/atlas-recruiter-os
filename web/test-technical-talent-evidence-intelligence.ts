import assert from "node:assert/strict";

import {
  assessCrossSourceEvidence,
} from "./lib/technicalTalent/technicalTalentEvidenceVerifier";

import type {
  DiscoveryEvidence,
} from "./types/technicalTalentDiscovery";

function evidence(
  overrides: Partial<DiscoveryEvidence>,
): DiscoveryEvidence {
  return {
    id: "test:evidence",
    type: "Technical Profile",
    source: "GitHub",
    title: "Test evidence",
    confidence: "High",
    ...overrides,
  };
}

function findFact(
  assessments: ReturnType<
    typeof assessCrossSourceEvidence
  >,
  fact: string,
) {
  const result = assessments.find(
    (assessment) =>
      assessment.fact === fact,
  );

  assert.ok(
    result,
    `Expected assessment for "${fact}"`,
  );

  return result;
}

/**
 * 1. Two independent sources supporting
 *    the same fact must be corroborated.
 */
{
  const assessments =
    assessCrossSourceEvidence([
      evidence({
        id: "github:1",
        source: "GitHub",
        supports: ["PyTorch"],
        confidence: "High",
      }),
      evidence({
        id: "openalex:1",
        source: "OpenAlex",
        supports: ["PyTorch"],
        confidence: "High",
      }),
    ]);

  const result =
    findFact(
      assessments,
      "pytorch",
    );

  assert.equal(
    result.status,
    "Corroborated",
  );

  assert.equal(
    result.independentSourceCount,
    2,
  );

  assert.equal(
    result.strength,
    "High",
  );

  assert.deepEqual(
    result.sources,
    ["GitHub", "OpenAlex"],
  );

  console.log(
    "PASS: Two independent sources corroborate the same fact",
  );
}

/**
 * 2. Multiple evidence items from the
 *    same source must NOT count as
 *    independent corroboration.
 */
{
  const assessments =
    assessCrossSourceEvidence([
      evidence({
        id: "github:1",
        source: "GitHub",
        supports: ["PyTorch"],
        confidence: "High",
      }),
      evidence({
        id: "github:2",
        source: "GitHub",
        supports: ["PyTorch"],
        confidence: "High",
      }),
      evidence({
        id: "github:3",
        source: "GitHub",
        supports: ["PyTorch"],
        confidence: "High",
      }),
    ]);

  const result =
    findFact(
      assessments,
      "pytorch",
    );

  assert.equal(
    result.status,
    "Single Source",
  );

  assert.equal(
    result.independentSourceCount,
    1,
  );

  assert.equal(
    result.strength,
    "Medium",
  );

  assert.equal(
    result.evidenceIds.length,
    3,
  );

  console.log(
    "PASS: Multiple same-source items do not inflate corroboration",
  );
}

/**
 * 3. Two sources with High/Medium
 *    confidence should produce High
 *    strength because corroboration is
 *    stronger than either source alone.
 */
{
  const assessments =
    assessCrossSourceEvidence([
      evidence({
        id: "github:2",
        source: "GitHub",
        supports: ["Computer Vision"],
        confidence: "High",
      }),
      evidence({
        id: "openreview:2",
        source: "OpenReview",
        supports: ["Computer Vision"],
        confidence: "Medium",
      }),
    ]);

  const result =
    findFact(
      assessments,
      "computer vision",
    );

  assert.equal(
    result.status,
    "Corroborated",
  );

  assert.equal(
    result.independentSourceCount,
    2,
  );

  assert.equal(
    result.strength,
    "High",
  );

  console.log(
    "PASS: High + Medium corroboration produces High strength",
  );
}

/**
 * 4. Three independent sources including
 *    Very High evidence should reach
 *    Very High strength.
 */
{
  const assessments =
    assessCrossSourceEvidence([
      evidence({
        id: "github:3",
        source: "GitHub",
        supports: ["Robotics Research"],
        confidence: "Very High",
      }),
      evidence({
        id: "openalex:3",
        source: "OpenAlex",
        supports: ["Robotics Research"],
        confidence: "High",
      }),
      evidence({
        id: "openreview:3",
        source: "OpenReview",
        supports: ["Robotics Research"],
        confidence: "High",
      }),
    ]);

  const result =
    findFact(
      assessments,
      "robotics research",
    );

  assert.equal(
    result.status,
    "Corroborated",
  );

  assert.equal(
    result.independentSourceCount,
    3,
  );

  assert.equal(
    result.strength,
    "Very High",
  );

  console.log(
    "PASS: Three independent sources produce Very High strength",
  );
}

/**
 * 5. Duplicate evidence IDs must not
 *    appear multiple times in the result.
 */
{
  const duplicate =
    evidence({
      id: "github:duplicate",
      source: "GitHub",
      supports: ["Python"],
      confidence: "High",
    });

  const assessments =
    assessCrossSourceEvidence([
      duplicate,
      duplicate,
    ]);

  const result =
    findFact(
      assessments,
      "python",
    );

  assert.equal(
    result.evidenceIds.length,
    1,
  );

  assert.equal(
    result.independentSourceCount,
    1,
  );

  console.log(
    "PASS: Duplicate evidence IDs are deduplicated",
  );
}

/**
 * 6. Evidence without supports should
 *    not create a fact assessment.
 */
{
  const assessments =
    assessCrossSourceEvidence([
      evidence({
        id: "github:unsupported",
        source: "GitHub",
        supports: [],
      }),
      evidence({
        id: "openalex:unsupported",
        source: "OpenAlex",
      }),
    ]);

  assert.equal(
    assessments.length,
    0,
  );

  console.log(
    "PASS: Evidence without explicit supports is ignored",
  );
}

/**
 * 7. Fact normalization should merge
 *    casing and whitespace variants.
 */
{
  const assessments =
    assessCrossSourceEvidence([
      evidence({
        id: "github:normalization",
        source: "GitHub",
        supports: ["  Machine   Learning  "],
        confidence: "High",
      }),
      evidence({
        id: "openalex:normalization",
        source: "OpenAlex",
        supports: ["machine learning"],
        confidence: "High",
      }),
    ]);

  assert.equal(
    assessments.length,
    1,
  );

  const result =
    findFact(
      assessments,
      "machine learning",
    );

  assert.equal(
    result.status,
    "Corroborated",
  );

  assert.equal(
    result.independentSourceCount,
    2,
  );

  console.log(
    "PASS: Fact normalization merges equivalent facts",
  );
}

console.log(
  "\nEvidence intelligence regression suite passed.",
);
