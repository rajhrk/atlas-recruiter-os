import {
  orchestrateTechnicalTalentDiscovery,
} from "@/lib/technicalTalent/technicalTalentDiscoveryOrchestrator";

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import {
  mockTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/MockTechnicalTalentSource";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

async function main() {
  console.log(
    "===== ATLAS TECHNICAL TALENT ORCHESTRATOR GRAPH RANKING TEST =====",
  );

  /*
   * The application runtime initializes live-capable source
   * adapters, but the deterministic integration test needs
   * the repository's existing mock source.
   *
   * Register the real mock adapter rather than creating a
   * test-only implementation.
   */
  technicalTalentSourceRegistry.register(
    mockTechnicalTalentSource,
  );

  const result =
    await orchestrateTechnicalTalentDiscovery(
      {
        domains: [
          "Robotics",
        ],

        skills: [
          "Computer Vision",
        ],

        technologies: [
          "PyTorch",
        ],

        researchAreas: [
          "Embodied AI",
        ],
      },
      {
        limit: 3,
        offset: 0,
      },
    );

  console.log(
    "\n===== RESULT =====",
  );

  console.log(
    "TOTAL:",
    result.total,
  );

  console.log(
    "RECORDS:",
    result.records.length,
  );

  console.log(
    "GRAPH MATCHES:",
    result.graphMatches?.length ?? 0,
  );

  console.log(
    "RANKINGS:",
    result.rankings?.length ?? 0,
  );

  assert(
    result.records.length > 0,
    "Orchestrator returned no candidates.",
  );

  assert(
    (result.graphMatches?.length ?? 0) > 0,
    "Orchestrator produced no graph matches.",
  );

  assert(
    (result.rankings?.length ?? 0) ===
      result.records.length,
    "Ranking count does not match returned candidate count.",
  );

  console.log(
    "\n===== CANDIDATES =====",
  );

  result.records.forEach(
    (candidate, index) => {
      const ranking =
        result.rankings?.find(
          (item) =>
            item.candidateId ===
            candidate.id,
        );

      console.log(
        `${index + 1}. ${candidate.name} | fit=${ranking?.fitScore} | graph=${ranking?.graphScore} | combined=${ranking?.combinedScore}`,
      );
    },
  );

  console.log(
    "\n===== GRAPH MATCHES =====",
  );

  result.graphMatches?.forEach(
    (match) => {
      console.log(
        `${match.candidateLabel} | candidate=${match.candidateId} | matches=${match.matchCount} | graph=${match.score}`,
      );

      for (
        const path of match.paths
      ) {
        console.log(
          `- ${path.relationship} | ${path.candidateLabel} -> ${path.nodeLabel}`,
        );
      }
    },
  );

  console.log(
    "\n===== RANKING INTEGRITY =====",
  );

  const rankingIds =
    result.rankings?.map(
      (ranking) =>
        ranking.candidateId,
    ) ?? [];

  const recordIds =
    result.records.map(
      (candidate) =>
        candidate.id,
    );

  assert(
    JSON.stringify(
      rankingIds,
    ) ===
      JSON.stringify(
        recordIds,
      ),
    "Returned records and rankings are not in the same combined-ranking order.",
  );

  for (
    let index = 1;
    index <
    (result.rankings?.length ?? 0);
    index += 1
  ) {
    const previous =
      result.rankings?.[index - 1];

    const current =
      result.rankings?.[index];

    if (
      previous &&
      current
    ) {
      assert(
        previous.combinedScore >=
          current.combinedScore,
        "Returned candidates are not ordered by descending combined score.",
      );
    }
  }

  console.log(
    "COMBINED RANKING ORDER: PASS",
  );

  console.log(
    "\n===== PAGINATION INTEGRITY =====",
  );

  const paginated =
    await orchestrateTechnicalTalentDiscovery(
      {
        domains: [
          "Robotics",
        ],

        skills: [
          "Computer Vision",
        ],

        technologies: [
          "PyTorch",
        ],

        researchAreas: [
          "Embodied AI",
        ],
      },
      {
        limit: 1,
        offset: 0,
      },
    );

  assert(
    paginated.records.length === 1,
    "Pagination did not return exactly one candidate.",
  );

  assert(
    (paginated.rankings?.length ?? 0) ===
      1,
    "Pagination did not return exactly one ranking.",
  );

  assert(
    (paginated.graphMatches?.length ?? 0) <=
      1,
    "Pagination returned graph matches for candidates outside the requested page.",
  );

  const firstFullRanking =
    result.rankings?.[0];

  const firstPagedRanking =
    paginated.rankings?.[0];

  assert(
    firstFullRanking?.candidateId ===
      firstPagedRanking?.candidateId,
    "Pagination changed the top combined-ranked candidate.",
  );

  console.log(
    "PAGINATION AFTER GRAPH RANKING: PASS",
  );

  console.log(
    "\n===== GRAPH/FIT INTEGRITY =====",
  );

  for (
    const ranking of
      result.rankings ?? []
  ) {
    const candidate =
      result.records.find(
        (record) =>
          record.id ===
          ranking.candidateId,
      );

    assert(
      candidate !== undefined,
      `Ranking references unknown candidate ${ranking.candidateId}.`,
    );

    if (!candidate) {
      throw new Error(
        `FAIL: Ranking references unknown candidate ${ranking.candidateId}.`,
      );
    }

    assert(
      ranking.fitScore ===
        candidate.fitScore?.overall,
      `Fit score was mutated for ${ranking.candidateId}.`,
    );
  }

  console.log(
    "FIT SCORE INTEGRITY: PASS",
  );

  console.log(
    "\n===== FINAL RESULT =====",
  );

  console.log(
    "GRAPH RANKING INTEGRATION: PASS",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ TECHNICAL TALENT ORCHESTRATOR GRAPH RANKING TEST FAILED",
    );

    console.error(error);

    process.exit(1);
  },
);
