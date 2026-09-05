import assert from "node:assert/strict";

import {
  planTechnicalTalentEvidenceTrail,
} from "@/lib/technicalTalent/technicalTalentEvidenceTrailPlanner";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

const github = {
  config: {
    source: "GitHub",
    name: "GitHub",
    description: "GitHub",
    enabled: true,
    capabilities: {
      identity: true,
      technicalProfile: true,
      skills: true,
      technologies: true,
      repositories: true,
      openSource: true,
      locations: true,
    },
  },
  search: async () => {
    throw new Error("not executed");
  },
} satisfies TechnicalTalentDiscoverySourceAdapter;

const openAlex = {
  config: {
    source: "OpenAlex",
    name: "OpenAlex",
    description: "OpenAlex",
    enabled: true,
    capabilities: {
      identity: true,
      technicalProfile: true,
      skills: true,
      publications: true,
      citations: true,
      locations: true,
    },
  },
  search: async () => {
    throw new Error("not executed");
  },
} satisfies TechnicalTalentDiscoverySourceAdapter;

const openReview = {
  config: {
    source: "OpenReview",
    name: "OpenReview",
    description: "OpenReview",
    enabled: true,
    capabilities: {
      identity: true,
      technicalProfile: true,
      skills: true,
      technologies: true,
      publications: true,
      conferences: true,
      researchProjects: true,
    },
  },
  search: async () => {
    throw new Error("not executed");
  },
} satisfies TechnicalTalentDiscoverySourceAdapter;

const employment = {
  config: {
    source: "Other",
    name: "Employment Test Source",
    description: "Employment",
    enabled: true,
    capabilities: {
      identity: true,
      employment: true,
    },
  },
  search: async () => {
    throw new Error("not executed");
  },
} satisfies TechnicalTalentDiscoverySourceAdapter;

const query = {
  roleFamilies: ["Machine Learning Engineer"],
  technologies: ["PyTorch"],
  companies: ["Meta"],
  locations: ["Singapore"],
  minimumExperienceYears: 5,
  researchAreas: ["Machine Learning"],
  openSourceFocused: true,
};

const plan =
  planTechnicalTalentEvidenceTrail(
    query,
    [
      github,
      openAlex,
      openReview,
      employment,
    ],
  );

const getRequirement = (
  requirement: string,
) =>
  plan.requirements.find(
    (item) =>
      item.requirement === requirement,
  );

const identity =
  getRequirement("Identity");

assert.equal(
  identity?.required,
  true,
);

assert.ok(
  identity?.capableSources.includes(
    "GitHub",
  ),
);

const technical =
  getRequirement("Technical");

assert.equal(
  technical?.required,
  true,
);

assert.ok(
  technical?.capableSources.includes(
    "GitHub",
  ),
);

const employmentPlan =
  getRequirement("Employment");

assert.equal(
  employmentPlan?.required,
  true,
);

assert.ok(
  employmentPlan?.capableSources.includes(
    "Other",
  ),
);

const location =
  getRequirement("Location");

assert.equal(
  location?.required,
  true,
);

assert.ok(
  location?.capableSources.includes(
    "GitHub",
  ),
);

const experience =
  getRequirement("Experience");

assert.equal(
  experience?.required,
  true,
);

assert.equal(
  experience?.coverage,
  "Uncovered",
);

assert.ok(
  experience?.evidenceSlots.includes(
    "minimum experience: 5 years",
  ),
);

assert.ok(
  plan.uncoveredRequirements.includes(
    "Experience",
  ),
);

assert.ok(
  plan.partiallyCoveredRequirements.includes(
    "Open Source",
  ),
);

const research =
  getRequirement("Research");

assert.equal(
  research?.required,
  true,
);

assert.ok(
  research?.capableSources.includes(
    "OpenAlex",
  ),
);

assert.ok(
  research?.capableSources.includes(
    "OpenReview",
  ),
);

const openSource =
  getRequirement("Open Source");

assert.equal(
  openSource?.required,
  true,
);

assert.ok(
  openSource?.capableSources.includes(
    "GitHub",
  ),
);

const verification =
  getRequirement("Verification");

assert.equal(
  verification?.required,
  true,
);

assert.equal(
  verification?.minimumIndependentSources,
  2,
);

assert.equal(
  plan.minimumIndependentSources,
  2,
);

assert.ok(
  plan.recommendedSources.includes(
    "GitHub",
  ),
);

console.log(
  "Evidence Trail Planner tests passed.",
);

console.log(
  JSON.stringify(
    plan,
    null,
    2,
  ),
);
