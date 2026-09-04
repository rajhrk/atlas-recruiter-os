import assert from "node:assert/strict";

import {
  orchestrateTechnicalTalentDiscovery,
} from "@/lib/technicalTalent/technicalTalentDiscoveryOrchestrator";

import type {
  DiscoverySource,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

function createAdapter(
  source: DiscoverySource,
  capturedRequests: Array<
    Parameters<TechnicalTalentDiscoverySourceAdapter["search"]>[0]
  >,
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config: {
      source,
      name: `${source} evidence-first orchestrator test`,
      description:
        "Deterministic adapter for evidence-first orchestrator activation.",
      enabled: true,
      capabilities: {
        identity: true,
        employment: true,
        technicalProfile: true,
        skills: true,
        technologies: true,
        publications: true,
        citations: false,
        patents: false,
        repositories: true,
        openSource: true,
        conferences: true,
        education: false,
        researchProjects: true,
        locations: true,
      },
    },

    async search(request) {
      capturedRequests.push(request);

      return {
        source,
        query: request,
        evidence: [
          {
            id: `${source.toLowerCase()}:test:evidence`,
            source,
            sourceRecordId: `${source.toLowerCase()}:test`,
            type: "Technical Profile",
            confidence: "High",
            supports: [
              "PyTorch",
              "Machine Learning",
            ],
          },
        ],
        records: [
          {
            id: `${source.toLowerCase()}:test`,
            name: "Evidence First Test Candidate",
            approvalStatus: "Unreviewed",
            normalizedRole: "Machine Learning Engineer",
            primaryDomain: "AI / ML",
            skills: [
              {
                name: "Machine Learning",
                normalizedName: "machine learning",
              },
            ],
            technologies: [
              {
                name: "PyTorch",
                normalizedName: "pytorch",
              },
            ],
            evidence: [
              {
                id: `${source.toLowerCase()}:test:evidence`,
                source,
                sourceRecordId: `${source.toLowerCase()}:test`,
                type: "Technical Profile",
                title: "Machine Learning Engineer Technical Profile",
                confidence: "High",
                supports: [
                  "PyTorch",
                  "Machine Learning",
                ],
              },
            ],
            sourceRecordIds: [
              `${source.toLowerCase()}:test`,
            ],
          },
        ],
        total: 1,
        searchedAt: new Date().toISOString(),
      };
    },
  };
}

async function run() {
  console.log(
    "===== ATLAS EVIDENCE-FIRST ORCHESTRATOR TEST =====",
  );

  /*
   * Use one deterministic source so the test isolates
   * orchestration-mode activation.
   */
  const capturedRequests: Array<
    Parameters<TechnicalTalentDiscoverySourceAdapter["search"]>[0]
  > = [];

  const adapter =
    createAdapter(
      "GitHub",
      capturedRequests,
    );

  /*
   * Temporarily register the deterministic adapter.
   *
   * The orchestrator is explicitly limited to GitHub,
   * so other registered sources cannot affect this test.
   */
  const { technicalTalentSourceRegistry } =
    await import(
      "@/lib/technicalTalent/technicalTalentSourceRegistry"
    );

  technicalTalentSourceRegistry.register(
    adapter,
  );

  const query = {
    technologies: ["PyTorch"],
    researchAreas: ["Machine Learning"],
    roleFamilies: ["Machine Learning Engineer"],
  };

  /*
   * ---------------------------------------------------------
   * Legacy path
   * ---------------------------------------------------------
   */
  capturedRequests.length = 0;

  const legacyResult =
    await orchestrateTechnicalTalentDiscovery(
      query,
      {
        sources: ["GitHub"],
        limit: 10,
        offset: 0,
      },
    );

  assert.equal(
    capturedRequests.length,
    1,
    "Legacy execution did not query GitHub exactly once.",
  );

  assert.equal(
    capturedRequests[0].evidenceObjectives,
    undefined,
    "Legacy execution unexpectedly included evidence objectives.",
  );

  assert.equal(
    legacyResult.records.length,
    1,
    "Legacy execution did not preserve the candidate result.",
  );

  /*
   * ---------------------------------------------------------
   * Evidence-first path
   * ---------------------------------------------------------
   */
  capturedRequests.length = 0;

  const evidenceFirstResult =
    await orchestrateTechnicalTalentDiscovery(
      query,
      {
        sources: ["GitHub"],
        limit: 10,
        offset: 0,
        evidenceFirst: true,
      },
    );

  assert.equal(
    capturedRequests.length,
    1,
    "Evidence-first execution did not query GitHub exactly once.",
  );

  const request =
    capturedRequests[0];

  assert.ok(
    request.evidenceObjectives,
    "Evidence-first execution did not pass evidence objectives to the adapter.",
  );

  assert.ok(
    request.evidenceObjectives.length > 0,
    "Evidence-first execution passed an empty objective list.",
  );

  assert.ok(
    request.evidenceObjectives.some(
      (objective) =>
        objective.requirement === "Technical" &&
        objective.evidenceSlot === "technology: PyTorch",
    ),
    "Evidence-first request did not contain the Technical/PyTorch objective.",
  );

  assert.ok(
    evidenceFirstResult.records.length > 0,
    "Evidence-first execution did not preserve discovered candidates.",
  );

  assert.equal(
    evidenceFirstResult.records.length,
    evidenceFirstResult.rankings?.length ?? 0,
    "Evidence-first execution broke downstream ranking integration.",
  );

  assert.equal(
    evidenceFirstResult.sourcesSuccessful.includes(
      "GitHub",
    ),
    true,
    "Evidence-first execution did not report GitHub as successful.",
  );

  console.log(
    "LEGACY PATH: PASS",
  );

  console.log(
    "EVIDENCE-FIRST OBJECTIVES: PASS",
  );

  console.log(
    "DOWNSTREAM PIPELINE: PASS",
  );

  console.log(
    "===== EVIDENCE-FIRST ORCHESTRATOR TEST PASSED =====",
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
