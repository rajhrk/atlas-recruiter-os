import assert from "node:assert/strict";
import test from "node:test";

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

import {
  planAdaptiveRuntimeSourceRouting,
} from "@/lib/technicalTalent/technicalTalentAdaptiveRuntimeSourceRouter";

import type {
  AdaptiveRuntimeEvidenceState,
} from "@/lib/technicalTalent/technicalTalentAdaptiveRuntimeEvidence";

function adapter(
  source: DiscoverySource,
  capabilities: TechnicalTalentDiscoverySourceAdapter["config"]["capabilities"],
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config: {
      source,
      enabled: true,
      name: source,
      description: `${source} adapter`,
      capabilities,
    },
    search: async () => {
      throw new Error("not executed");
    },
  };
}

function runtimeState(
  overrides: Partial<AdaptiveRuntimeEvidenceState> = {},
): AdaptiveRuntimeEvidenceState {
  return {
    queriedSources: [],
    exhaustedSources: [],
    evidenceByRequirement: [],
    completedRequirements: [],
    missingRequirements: [
      "Identity",
      "Technical",
      "Verification",
    ],
    partiallyCoveredRequirements: [],
    ...overrides,
  };
}

const query: TechnicalTalentDiscoveryQuery = {
  technologies: ["PyTorch"],
};

const adapters = [
  adapter("GitHub", {
    identity: true,
    technicalProfile: true,
    technologies: true,
    repositories: true,
    openSource: true,
  }),
  adapter("OpenReview", {
    identity: true,
    technicalProfile: true,
    publications: true,
    conferences: true,
  }),
  adapter("OpenAlex", {
    identity: true,
    technicalProfile: true,
    publications: true,
  }),
];

test("runtime router follows actual missing requirements", () => {
  const plan = planAdaptiveRuntimeSourceRouting(
    query,
    adapters,
    runtimeState({
      missingRequirements: ["Technical", "Verification"],
    }),
  );

  assert.equal(plan.nextSource, "GitHub");
  assert.ok(plan.routes[0]?.targets.includes("Technical"));
});

test("queried source with no useful evidence is not selected again", () => {
  const plan = planAdaptiveRuntimeSourceRouting(
    query,
    adapters,
    runtimeState({
      queriedSources: ["GitHub"],
      missingRequirements: ["Technical", "Verification"],
      partiallyCoveredRequirements: ["Technical"],
    }),
  );

  assert.notEqual(plan.nextSource, "GitHub");
  assert.ok(
    plan.routes.every(
      (route) => route.source !== "GitHub",
    ),
  );
});

test("runtime-completed requirement is removed from route targets", () => {
  const plan = planAdaptiveRuntimeSourceRouting(
    query,
    adapters,
    runtimeState({
      completedRequirements: ["Technical"],
      missingRequirements: ["Verification"],
    }),
  );

  assert.ok(
    plan.routes.every(
      (route) => !route.targets.includes("Technical"),
    ),
  );
});

test("runtime router preserves unresolved requirements", () => {
  const plan = planAdaptiveRuntimeSourceRouting(
    query,
    adapters,
    runtimeState({
      missingRequirements: ["Verification"],
    }),
  );

  assert.ok(
    plan.state.missingRequirements.includes(
      "Verification",
    ),
  );
});

test("no missing or partial requirements produces no route", () => {
  const plan = planAdaptiveRuntimeSourceRouting(
    query,
    adapters,
    runtimeState({
      completedRequirements: [
        "Identity",
        "Technical",
        "Verification",
      ],
      missingRequirements: [],
      partiallyCoveredRequirements: [],
    }),
  );

  assert.equal(plan.routes.length, 0);
  assert.equal(plan.nextSource, undefined);
});
