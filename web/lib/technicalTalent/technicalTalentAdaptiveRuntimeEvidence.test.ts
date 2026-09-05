import assert from "node:assert/strict";
import test from "node:test";

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";
import type {
  EvidenceFirstDiscoveryExecution,
  EvidenceFirstCandidateSurface,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscoveryExecutor";
import type {
  EvidenceFirstDiscoveryObjective,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscovery";
import type {
  TechnicalTalentEvidenceTrailPlan,
} from "@/lib/technicalTalent/technicalTalentEvidenceTrailPlanner";
import {
  buildAdaptiveRuntimeEvidenceState,
  getRuntimeCandidateEvidence,
} from "@/lib/technicalTalent/technicalTalentAdaptiveRuntimeEvidence";

function candidate(
  id: string,
  source: DiscoverySource,
  evidenceId: string,
  supports: string[],
): TechnicalTalentDiscoveryRecord {
  return {
    id,
    sourceRecordIds: [`${source.toLowerCase()}:${id}`],
    name: id,
    primaryDomain: "AI / ML",
    skills: [],
    technologies: [],
    approvalStatus: "Unreviewed",
    evidence: [
      {
        id: evidenceId,
        type: "Technical Profile",
        source,
        title: id,
        supports,
        confidence: "High",
      },
    ],
  };
}

function surface(
  record: TechnicalTalentDiscoveryRecord,
  requirement: EvidenceFirstDiscoveryObjective["requirement"],
  evidenceSlot: string,
  evidenceId: string,
  evidenceSource: DiscoverySource = "GitHub",
): EvidenceFirstCandidateSurface {
  return {
    candidateId: record.id,
    candidate: record,
    source: evidenceSource,
    matchedObjectives: [
      {
        requirement,
        evidenceSlot,
        source: evidenceSource,
        evidenceIds: [evidenceId],
        rationale: "test",
      },
    ],
  };
}

function execution(
  source: DiscoverySource,
  surfaces: EvidenceFirstCandidateSurface[],
): EvidenceFirstDiscoveryExecution {
  return {
    source,
    objectives: surfaces.flatMap((item) =>
      item.matchedObjectives.map((match) => ({
        requirement: match.requirement,
        evidenceSlot: match.evidenceSlot,
        source,
        priority: 100,
        rationale: match.rationale,
      })),
    ),
    candidates: surfaces,
    durationMs: 1,
  };
}

function plan(
  overrides: Partial<TechnicalTalentEvidenceTrailPlan> = {},
): TechnicalTalentEvidenceTrailPlan {
  return {
    requirements: [
      {
        requirement: "Identity",
        required: true,
        rationale: "identity",
        evidenceSlots: ["person identity"],
        capableSources: ["GitHub", "OpenAlex"],
        recommendedSources: ["GitHub", "OpenAlex"],
        minimumIndependentSources: 1,
        coverage: "Covered",
      },
      {
        requirement: "Technical",
        required: true,
        rationale: "technical",
        evidenceSlots: ["technology: PyTorch"],
        capableSources: ["GitHub", "OpenAlex"],
        recommendedSources: ["GitHub", "OpenAlex"],
        minimumIndependentSources: 1,
        coverage: "Covered",
      },
      {
        requirement: "Employment",
        required: true,
        rationale: "employment",
        evidenceSlots: ["employment: Meta"],
        capableSources: ["Other"],
        recommendedSources: ["Other"],
        minimumIndependentSources: 1,
        coverage: "Partially Covered",
      },
      {
        requirement: "Experience",
        required: true,
        rationale: "experience",
        evidenceSlots: ["minimum experience: 5 years"],
        capableSources: [],
        recommendedSources: [],
        minimumIndependentSources: 1,
        coverage: "Uncovered",
      },
      {
        requirement: "Research",
        required: true,
        rationale: "research",
        evidenceSlots: ["research area: Machine Learning"],
        capableSources: ["OpenAlex", "OpenReview"],
        recommendedSources: ["OpenReview", "OpenAlex"],
        minimumIndependentSources: 1,
        coverage: "Covered",
      },
      {
        requirement: "Open Source",
        required: true,
        rationale: "open source",
        evidenceSlots: ["open-source contribution"],
        capableSources: ["GitHub"],
        recommendedSources: ["GitHub"],
        minimumIndependentSources: 1,
        coverage: "Partially Covered",
      },
      {
        requirement: "Verification",
        required: true,
        rationale: "verification",
        evidenceSlots: ["independent source corroboration"],
        capableSources: [],
        recommendedSources: [],
        minimumIndependentSources: 2,
        coverage: "Covered",
      },
    ],
    recommendedSources: ["GitHub", "OpenReview", "OpenAlex", "Other"],
    uncoveredRequirements: ["Experience"],
    partiallyCoveredRequirements: ["Employment", "Open Source"],
    minimumIndependentSources: 2,
    ...overrides,
  };
}

test("queried source without matching evidence does not satisfy a requirement", () => {

  const state = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [execution("GitHub", [])],
    ["GitHub"],
  );

  assert.ok(state.missingRequirements.includes("Technical"));
  assert.equal(
    state.evidenceByRequirement.find(
      (item) => item.requirement === "Technical",
    )?.evidenceIds.length,
    0,
  );
});

test("one source with matching evidence satisfies a single-source requirement", () => {
  const alice = candidate(
    "alice",
    "GitHub",
    "gh-technical",
    ["technology: PyTorch"],
  );

  const state = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      execution(
        "GitHub",
        [
          surface(
            alice,
            "Technical",
            "technology: PyTorch",
            "gh-technical",
          ),
        ],
      ),
    ],
    ["GitHub"],
  );

  assert.ok(state.completedRequirements.includes("Technical"));
  assert.ok(!state.missingRequirements.includes("Technical"));
});

test("verification remains incomplete until two independent sources provide evidence", () => {
  const alice = candidate(
    "alice",
    "GitHub",
    "gh-technical",
    ["technology: PyTorch"],
  );

  const openAlexAlice = candidate(
    "alice-openalex",
    "OpenAlex",
    "oa-technical",
    ["technology: PyTorch"],
  );

  const oneSource = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      execution(
        "GitHub",
        [
          surface(
            alice,
            "Technical",
            "technology: PyTorch",
            "gh-technical",
          ),
        ],
      ),
    ],
    ["GitHub"],
  );

  assert.ok(oneSource.missingRequirements.includes("Verification"));

  const twoSources = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      execution(
        "GitHub",
        [
          surface(
            alice,
            "Technical",
            "technology: PyTorch",
            "gh-technical",
          ),
        ],
      ),
      execution(
        "OpenAlex",
        [
          surface(
            openAlexAlice,
            "Technical",
            "technology: PyTorch",
            "oa-technical",
          ),
        ],
      ),
    ],
    ["GitHub", "OpenAlex"],
  );

  assert.ok(twoSources.completedRequirements.includes("Verification"));
  assert.ok(!twoSources.missingRequirements.includes("Verification"));
});

test("evidence for one requirement does not satisfy another requirement", () => {
  const alice = candidate(
    "alice",
    "GitHub",
    "gh-pytorch",
    ["technology: PyTorch"],
  );

  const state = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      execution(
        "GitHub",
        [
          surface(
            alice,
            "Technical",
            "technology: PyTorch",
            "gh-pytorch",
          ),
        ],
      ),
    ],
    ["GitHub"],
  );

  assert.ok(state.completedRequirements.includes("Technical"));
  assert.ok(state.missingRequirements.includes("Employment"));
  assert.ok(state.missingRequirements.includes("Research"));
});

test("failed or empty execution does not create runtime coverage", () => {
  const state = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      {
        source: "OpenReview",
        objectives: [],
        candidates: [],
        error: "rate limited",
        durationMs: 1,
      },
    ],
    ["OpenReview"],
  );

  assert.ok(state.missingRequirements.includes("Research"));
  assert.equal(
    state.evidenceByRequirement.find(
      (item) => item.requirement === "Research",
    )?.sources.length,
    0,
  );
});

test("partial coverage is evidence-backed rather than query-backed", () => {
  const alice = candidate(
    "alice",
    "GitHub",
    "gh-technical",
    ["technology: PyTorch"],
  );

  const state = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      execution(
        "GitHub",
        [
          surface(
            alice,
            "Technical",
            "technology: PyTorch",
            "gh-technical",
          ),
        ],
      ),
    ],
    ["GitHub"],
  );

  assert.ok(state.completedRequirements.includes("Technical"));
  assert.ok(state.missingRequirements.includes("Verification"));
  assert.ok(
    state.partiallyCoveredRequirements.includes("Verification"),
  );
});

test("runtime state exposes candidate-level requirement evidence", () => {
  const alice = candidate(
    "alice",
    "GitHub",
    "gh-technical",
    ["technology: PyTorch"],
  );

  const state = buildAdaptiveRuntimeEvidenceState(
    plan(),
    [
      execution(
        "GitHub",
        [
          surface(
            alice,
            "Technical",
            "technology: PyTorch",
            "gh-technical",
          ),
        ],
      ),
    ],
    ["GitHub"],
  );

  const evidence = getRuntimeCandidateEvidence(state, "alice");

  assert.equal(evidence.length, 2);
  assert.ok(
    evidence.some((item) => item.requirement === "Technical"),
  );
  assert.ok(
    evidence.some((item) => item.requirement === "Verification"),
  );
  assert.ok(
    evidence.some(
      (item) =>
        item.requirement === "Technical" &&
        item.evidenceIds.length === 1 &&
        item.evidenceIds[0] === "gh-technical",
    ),
  );
});
