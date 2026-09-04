import assert from "node:assert/strict";

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

import {
  executeEvidenceFirstDiscovery,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscoveryExecutor";

import type {
  EvidenceFirstDiscoveryObjective,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscovery";

function createCandidate(): TechnicalTalentDiscoveryRecord {
  return {
    id: "github:alex-researcher",
    name: "Alex Researcher",
    evidence: [
      {
        id: "github:repo:pytorch-project",
        source: "GitHub",
        type: "Repository",
        confidence: "Very High",
        supports: [
          "PyTorch",
          "Machine Learning",
        ],
      },
    ],
    sourceRecordIds: [
      "github:alex-researcher",
    ],
  } as TechnicalTalentDiscoveryRecord;
}

let capturedRequest:
  Parameters<TechnicalTalentDiscoverySourceAdapter["search"]>[0] | undefined;

function createAdapter(
  source: DiscoverySource,
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config: {
      source,
      name: `${source} test adapter`,
      description: "Evidence-first executor test adapter.",
      enabled: true,
      capabilities: {
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
      },
    },
    async search(request) {
      capturedRequest = request;

      return {
        source,
        query: request,
        evidence: [
          {
            id: "github:repo:pytorch-project",
            source: "GitHub",
            sourceRecordId: "github:repo:pytorch-project",
            type: "Repository",
            confidence: "Very High",
            supports: [
              "PyTorch",
              "Machine Learning",
            ],
          },
        ],
        records: [createCandidate()],
        total: 1,
        searchedAt: new Date().toISOString(),
      };
    },
  };
}

const objectives: EvidenceFirstDiscoveryObjective[] = [
  {
    requirement: "Technical",
    evidenceSlot: "technology: PyTorch",
    source: "GitHub",
    priority: 140,
    rationale:
      "GitHub is used to discover candidates through Technical evidence: technology: PyTorch.",
  },
  {
    requirement: "Open Source",
    evidenceSlot: "open-source contribution",
    source: "GitHub",
    priority: 140,
    rationale:
      "GitHub is used to discover candidates through Open Source evidence: open-source contribution.",
  },
];

async function run() {
  const query = {
    keywords: ["PyTorch"],
  };

  const executions =
    await executeEvidenceFirstDiscovery(
      query,
      objectives,
      [createAdapter("GitHub")],
    );

  assert.equal(executions.length, 1);

  assert.ok(capturedRequest);

  assert.deepEqual(
    capturedRequest?.evidenceObjectives,
    [
      {
        requirement: "Technical",
        evidenceSlot: "technology: PyTorch",
        rationale:
          "GitHub is used to discover candidates through Technical evidence: technology: PyTorch.",
      },
      {
        requirement: "Open Source",
        evidenceSlot: "open-source contribution",
        rationale:
          "GitHub is used to discover candidates through Open Source evidence: open-source contribution.",
      },
    ],
  );

  assert.equal(
    capturedRequest?.query.keywords?.[0],
    "PyTorch",
  );

  const execution = executions[0];

assert.equal(
  execution?.source,
  "GitHub",
);

assert.equal(
  execution?.candidates.length,
  1,
);

assert.equal(
  execution?.candidates[0]?.candidateId,
  "github:alex-researcher",
);

assert.equal(
  execution?.candidates[0]?.candidate.name,
  "Alex Researcher",
);

const candidateSurface = execution?.candidates[0];

assert.ok(candidateSurface);

assert.equal(
  candidateSurface?.matchedObjectives.length,
  1,
);

const matchedObjective =
  candidateSurface?.matchedObjectives[0];

assert.equal(
  matchedObjective?.requirement,
  "Technical",
);

assert.equal(
  matchedObjective?.evidenceSlot,
  "technology: PyTorch",
);

assert.equal(
  matchedObjective?.source,
  "GitHub",
);

assert.deepEqual(
  matchedObjective?.evidenceIds,
  ["github:repo:pytorch-project"],
);

assert.equal(
  matchedObjective?.rationale,
  "GitHub is used to discover candidates through Technical evidence: technology: PyTorch.",
);

  console.log(
    "Evidence-first Discovery Executor v1 tests passed.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
