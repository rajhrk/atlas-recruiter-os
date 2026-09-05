// ============================================================
// Atlas Recruiter OS
// Adaptive Source Routing v1 Tests
// ============================================================

import assert from "node:assert/strict";

import type {
  DiscoverySource,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

import {
  planAdaptiveSourceRouting,
} from "@/lib/technicalTalent/technicalTalentAdaptiveSourceRouter";

function createAdapter(
  source: DiscoverySource,
  capabilities: TechnicalTalentDiscoverySourceAdapter["config"]["capabilities"],
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config: {
      source,
      name: `${source} test adapter`,
      description: `${source} test adapter for adaptive routing.`,
      enabled: true,
      capabilities,
    },
    async search(request) {
      return {
        source,
        query: request,
        evidence: [],
        records: [],
        total: 0,
        searchedAt: new Date().toISOString(),
      };
    },
  };
}

const adapters = [
  createAdapter("GitHub", {
    identity: true,
    employment: false,
    technicalProfile: true,
    skills: true,
    technologies: true,
    publications: false,
    citations: false,
    patents: false,
    repositories: true,
    openSource: true,
    conferences: false,
    education: false,
    researchProjects: false,
    locations: true,
  }),

  createAdapter("OpenReview", {
    identity: true,
    employment: false,
    technicalProfile: true,
    skills: true,
    technologies: true,
    publications: true,
    citations: false,
    patents: false,
    repositories: false,
    openSource: false,
    conferences: true,
    education: false,
    researchProjects: true,
    locations: false,
  }),

  createAdapter("OpenAlex", {
    identity: true,
    employment: false,
    technicalProfile: true,
    skills: true,
    technologies: false,
    publications: true,
    citations: true,
    patents: false,
    repositories: false,
    openSource: false,
    conferences: false,
    education: false,
    researchProjects: false,
    locations: true,
  }),

  createAdapter("Other", {
    identity: true,
    employment: true,
    locations: true,
    technicalProfile: false,
    skills: false,
    technologies: false,
    publications: false,
    citations: false,
    patents: false,
    repositories: false,
    openSource: false,
    conferences: false,
    education: false,
    researchProjects: false,
  }),
];

const query = {
  roleFamilies: [
    "Machine Learning Engineer",
  ],
  technologies: [
    "PyTorch",
  ],
  companies: [
    "Meta",
  ],
  locations: [
    "Singapore",
  ],
  minimumExperienceYears: 5,
  researchAreas: [
    "Machine Learning",
  ],
  openSourceFocused: true,
};

const initial =
  planAdaptiveSourceRouting(
    query,
    adapters,
  );

assert.equal(
  initial.nextSource,
  "GitHub",
);

const initialGitHubRoute =
  initial.routes.find(
    (route) => route.source === "GitHub",
  );

assert.ok(initialGitHubRoute);
assert.ok(
  initialGitHubRoute.targets.includes("Open Source"),
);
assert.ok(
  initialGitHubRoute.targets.includes("Technical"),
);
assert.equal(initialGitHubRoute.priority, 140);

assert.ok(
  initial.routes.some(
    (route) =>
      route.source === "OpenReview" &&
      route.targets.includes("Research"),
  ),
);

assert.ok(
  initial.state.missingRequirements.includes(
    "Experience",
  ),
);

assert.deepEqual(
  initial.state.queriedSources,
  [],
);

const afterGitHub =
  planAdaptiveSourceRouting(
    query,
    adapters,
    ["GitHub"],
  );

assert.notEqual(
  afterGitHub.nextSource,
  "GitHub",
);

assert.ok(
  !afterGitHub.routes.some(
    (route) =>
      route.source === "GitHub",
  ),
);

assert.ok(
  afterGitHub.routes.some(
    (route) =>
      route.source === "OpenReview" &&
      route.targets.includes("Research"),
  ),
);

const afterGitHubAndOpenReview =
  planAdaptiveSourceRouting(
    query,
    adapters,
    [
      "GitHub",
      "OpenReview",
    ],
  );

assert.notEqual(
  afterGitHubAndOpenReview.nextSource,
  "GitHub",
);

assert.notEqual(
  afterGitHubAndOpenReview.nextSource,
  "OpenReview",
);

const finalOtherRoute =
  afterGitHubAndOpenReview.routes.find(
    (route) => route.source === "Other",
  );

assert.ok(finalOtherRoute);
assert.ok(
  finalOtherRoute.targets.includes(
    "Employment",
  ),
);
assert.equal(
  afterGitHubAndOpenReview.nextSource,
  "Other",
);

console.log(
  "Adaptive Source Routing v1 tests passed.",
);

console.log(
  JSON.stringify(
    {
      initial,
      afterGitHub,
      afterGitHubAndOpenReview,
    },
    null,
    2,
  ),
);
