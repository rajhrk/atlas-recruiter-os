import {
  discoverTechnicalTalent,
} from "@/lib/technicalTalent/technicalTalentDiscoveryEngine";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(
      `FAIL: ${message}`,
    );
  }
}

function main(): void {
  console.log(
    "===== ATLAS TECHNICAL TALENT DISCOVERY GRAPH TEST =====",
  );

  const result =
    discoverTechnicalTalent({
      skills: [
        "Computer Vision",
      ],

      technologies: [
        "PyTorch",
      ],

      researchAreas: [
        "Embodied AI",
      ],

      limit: 10,
    });

  console.log(
    "\n===== DISCOVERY RESULT =====",
  );

  console.log(
    "CANDIDATES:",
    result.candidates.length,
  );

  console.log(
    "TOTAL:",
    result.total,
  );

  console.log(
    "GRAPH MATCHES:",
    result.graphMatches?.length ?? 0,
  );

  assert(
    Array.isArray(
      result.graphMatches,
    ),
    "Discovery result does not contain graphMatches.",
  );

  assert(
    result.graphMatches!.length > 0,
    "Discovery query produced no graph matches.",
  );

  const graphMatch =
    result.graphMatches![0];

  assert(
    typeof graphMatch.candidateId ===
      "string",
    "Graph match candidateId is missing.",
  );

  assert(
    typeof graphMatch.candidateLabel ===
      "string",
    "Graph match candidateLabel is missing.",
  );

  assert(
    graphMatch.matchCount > 0,
    "Graph match contains no matched paths.",
  );

  assert(
    graphMatch.score > 0,
    "Graph match score was not calculated.",
  );

  assert(
    Array.isArray(
      graphMatch.paths,
    ) &&
      graphMatch.paths.length > 0,
    "Graph match contains no explainable paths.",
  );

  /*
   * Verify that graph evidence points to a candidate
   * that actually participated in the discovery result.
   */
  const candidateWasDiscovered =
    result.candidates.some(
      (candidate) =>
        candidate.id ===
          graphMatch.candidateId.replace(
            /^candidate:/,
            "",
          ),
    );

  assert(
    candidateWasDiscovered,
    "Graph match introduced a candidate that was not part of the discovery result.",
  );

  /*
   * Verify the requested technical signals are represented
   * in the graph explanation.
   */
  assert(
    graphMatch.paths.some(
      (path) =>
        path.nodeType ===
          "skill" &&
        path.nodeLabel ===
          "Computer Vision",
    ),
    "Computer Vision graph evidence was not returned.",
  );

  assert(
    graphMatch.paths.some(
      (path) =>
        path.nodeType ===
          "technology" &&
        path.nodeLabel ===
          "PyTorch",
    ),
    "PyTorch graph evidence was not returned.",
  );

  assert(
    graphMatch.paths.some(
      (path) =>
        path.nodeType ===
          "researchArea" &&
        path.nodeLabel ===
          "Embodied AI",
    ),
    "Embodied AI graph evidence was not returned.",
  );

  /*
   * Graph evidence must not silently replace or mutate the
   * existing deterministic candidate fit score.
   */
  const matchedCandidate =
    result.candidates.find(
      (candidate) =>
        candidate.id ===
        graphMatch.candidateId.replace(
          /^candidate:/,
          "",
        ),
    );

  assert(
    matchedCandidate !== undefined,
    "Graph-matched candidate was not found in discovery results.",
  );

  assert(
    typeof matchedCandidate!.fitScore?.overall ===
      "number",
    "Graph-matched candidate does not have an existing fit score.",
  );

  console.log(
    "\n===== FIT SCORE INTEGRITY =====",
  );

  console.log(
    "GRAPH SCORE:",
    graphMatch.score,
  );

  console.log(
    "DISCOVERY FIT SCORE:",
    matchedCandidate!.fitScore?.overall,
  );

  console.log(
    "FIT SCORE INTEGRITY: PASS",
  );

  console.log(
    "\n===== GRAPH MATCH =====",
  );

  console.log(
    "CANDIDATE:",
    graphMatch.candidateLabel,
  );

  console.log(
    "CANDIDATE ID:",
    graphMatch.candidateId,
  );

  console.log(
    "MATCH COUNT:",
    graphMatch.matchCount,
  );

  console.log(
    "GRAPH SCORE:",
    graphMatch.score,
  );

  console.log(
    "\n===== GRAPH PATHS =====",
  );

  graphMatch.paths.forEach(
    (path) => {
      console.log(
        `- ${path.relationship} | ${path.candidateLabel} -> ${path.nodeLabel}`,
      );
    },
  );

  /*
   * Pagination integrity.
   *
   * Graph matches must correspond to the candidates returned
   * by the same discovery page. Graph evidence must never
   * leak candidates from another page.
   */
  const paginatedResult =
    discoverTechnicalTalent({
      skills: [
        "Computer Vision",
      ],

      technologies: [
        "PyTorch",
      ],

      researchAreas: [
        "Embodied AI",
      ],

      limit: 1,

      offset: 0,
    });

  assert(
    paginatedResult.candidates.length === 1,
    `Expected one paginated candidate, received ${paginatedResult.candidates.length}.`,
  );

  assert(
    paginatedResult.graphMatches !== undefined,
    "Paginated discovery result does not contain graphMatches.",
  );

  const paginatedCandidateIds =
    new Set(
      paginatedResult.candidates.map(
        (candidate) =>
          candidate.id,
      ),
    );

  assert(
    paginatedResult.graphMatches!.every(
      (match) =>
        paginatedCandidateIds.has(
          match.candidateId.replace(
            /^candidate:/,
            "",
          ),
        ),
    ),
    "Graph matches contain candidates outside the returned discovery page.",
  );

  console.log(
    "\n===== PAGINATION INTEGRITY =====",
  );

  console.log(
    "RETURNED CANDIDATES:",
    paginatedResult.candidates.length,
  );

  console.log(
    "RETURNED GRAPH MATCHES:",
    paginatedResult.graphMatches!.length,
  );

  console.log(
    "PAGINATION GRAPH INTEGRITY: PASS",
  );

  console.log(
    "\n===== DISCOVERY CANDIDATES =====",
  );

  result.candidates.forEach(
    (candidate, index) => {
      console.log(
        `${index + 1}. ${candidate.name} | fit=${candidate.fitScore?.overall ?? 0}`,
      );
    },
  );

  console.log(
    "\n✅ TECHNICAL TALENT DISCOVERY GRAPH TEST PASSED",
  );
}

try {
  main();
} catch (error) {
  console.error(
    "\n❌ TECHNICAL TALENT DISCOVERY GRAPH TEST FAILED",
  );

  console.error(
    error,
  );

  process.exit(1);
}
