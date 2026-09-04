import assert from "node:assert/strict";

import type {
  DiscoverySource,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

import {
  planEvidenceFirstDiscovery,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscovery";

function createAdapter(
  source: DiscoverySource,
  capabilities: TechnicalTalentDiscoverySourceAdapter["config"]["capabilities"],
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config: {
      source,
      name: `${source} test adapter`,
      description: `${source} test adapter for evidence-first discovery.`,
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
    locations: true,
  }),

  createAdapter("OpenAlex", {
    identity: true,
    employment: false,
    technicalProfile: true,
    skills: true,
    technologies: true,
    publications: true,
    citations: true,
    patents: false,
    repositories: false,
    openSource: false,
    conferences: true,
    education: false,
    researchProjects: true,
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
  roleFamilies: ["Machine Learning Engineer"],
  technologies: ["PyTorch"],
  companies: ["Meta"],
  locations: ["Singapore"],
  minimumExperienceYears: 5,
  researchAreas: ["Machine Learning"],
  openSourceFocused: true,
};

const initial =
  planEvidenceFirstDiscovery(
    query,
    adapters,
  );

assert.equal(
  initial.nextSource,
  "GitHub",
);

assert.ok(
  initial.objectives.some(
    (objective) =>
      objective.source === "GitHub" &&
      objective.requirement === "Technical" &&
      objective.evidenceSlot ===
        "technology: PyTorch",
  ),
);

assert.ok(
  initial.objectives.some(
    (objective) =>
      objective.source === "GitHub" &&
      objective.requirement ===
        "Open Source",
  ),
);

assert.ok(
  initial.objectives.some(
    (objective) =>
      objective.source === "OpenReview" &&
      objective.requirement ===
        "Research" &&
      objective.evidenceSlot ===
        "research area: Machine Learning",
  ),
);

assert.ok(
  initial.objectives.some(
    (objective) =>
      objective.source === "Other" &&
      objective.requirement ===
        "Employment" &&
      objective.evidenceSlot ===
        "employment: Meta",
  ),
);

assert.equal(
  initial.objectives.some(
    (objective) =>
      objective.requirement ===
      "Experience",
  ),
  false,
);

const afterGitHub =
  planEvidenceFirstDiscovery(
    query,
    adapters,
    ["GitHub"],
  );

assert.equal(
  afterGitHub.nextSource,
  "Other",
);

assert.equal(
  afterGitHub.objectives.some(
    (objective) =>
      objective.source === "GitHub",
  ),
  false,
);

assert.ok(
  afterGitHub.objectives.some(
    (objective) =>
      objective.source === "Other" &&
      objective.requirement ===
        "Employment",
  ),
);

assert.ok(
  afterGitHub.objectives.some(
    (objective) =>
      objective.source ===
        "OpenReview" &&
      objective.requirement ===
        "Research",
  ),
);

assert.equal(
  afterGitHub.objectives.some(
    (objective) =>
      objective.requirement ===
      "Experience",
  ),
  false,
);

const afterGitHubAndOpenReview =
  planEvidenceFirstDiscovery(
    query,
    adapters,
    ["GitHub", "OpenReview"],
  );

assert.equal(
  afterGitHubAndOpenReview.nextSource,
  "Other",
);

assert.equal(
  afterGitHubAndOpenReview.objectives.length,
  1,
);

assert.equal(
  afterGitHubAndOpenReview.objectives[0]
    ?.source,
  "Other",
);

assert.equal(
  afterGitHubAndOpenReview.objectives[0]
    ?.requirement,
  "Employment",
);

console.log(
  "Evidence-first Candidate Discovery v1 tests passed.",
);
