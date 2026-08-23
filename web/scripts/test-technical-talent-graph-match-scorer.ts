import {
  scoreTechnicalTalentGraphMatch,
} from "@/lib/graph/technicalTalentGraphMatchScorer";

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
    "===== ATLAS TECHNICAL TALENT GRAPH MATCH SCORER TEST =====",
  );

  const match = {
    candidateId:
      "candidate:graph-score-runtime",
    candidateLabel:
      "Atlas Graph Score Candidate",
    matchCount: 3,
    score: 100,
    paths: [
      {
        candidateId:
          "candidate:graph-score-runtime",
        candidateLabel:
          "Atlas Graph Score Candidate",
        nodeId:
          "skill:computer-vision",
        nodeType:
          "skill" as const,
        nodeLabel:
          "Computer Vision",
        relationship:
          "demonstrates",
      },
      {
        candidateId:
          "candidate:graph-score-runtime",
        candidateLabel:
          "Atlas Graph Score Candidate",
        nodeId:
          "technology:pytorch",
        nodeType:
          "technology" as const,
        nodeLabel:
          "PyTorch",
        relationship:
          "uses",
      },
      {
        candidateId:
          "candidate:graph-score-runtime",
        candidateLabel:
          "Atlas Graph Score Candidate",
        nodeId:
          "research-area:embodied-ai",
        nodeType:
          "researchArea" as const,
        nodeLabel:
          "Embodied AI",
        relationship:
          "researches",
      },
    ],
  };

  const result =
    scoreTechnicalTalentGraphMatch(
      match,
      3,
    );

  console.log(
    "\n===== SCORE =====",
  );

  console.log(
    "GRAPH SCORE:",
    result.score,
  );

  console.log(
    "MATCH COUNT:",
    result.matchCount,
  );

  console.log(
    "WEIGHTED MATCH COUNT:",
    result.weightedMatchCount,
  );

  console.log(
    "EXPLANATION:",
    result.explanation,
  );

  assert(
    result.matchCount === 3,
    "Graph match count was not preserved.",
  );

  assert(
    result.weightedMatchCount > 3,
    "Relationship weighting was not applied.",
  );

  assert(
    result.score === 100,
    `Expected full graph coverage to score 100, received ${result.score}.`,
  );

  assert(
    result.explanation.includes(
      "Atlas Graph Score Candidate",
    ),
    "Candidate identity was not preserved in explanation.",
  );

  const partial =
    scoreTechnicalTalentGraphMatch(
      {
        ...match,
        matchCount: 1,
        paths: [
          match.paths[0],
        ],
      },
      3,
    );

  assert(
    partial.score < 100,
    "Partial graph coverage incorrectly received a perfect score.",
  );

  console.log(
    "\n===== PARTIAL SCORE =====",
  );

  console.log(
    "PARTIAL GRAPH SCORE:",
    partial.score,
  );

  console.log(
    "\n✅ TECHNICAL TALENT GRAPH MATCH SCORER TEST PASSED",
  );
}

main();
