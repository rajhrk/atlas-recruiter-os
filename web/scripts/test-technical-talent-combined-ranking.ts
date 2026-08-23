import {
  rankTechnicalTalentCandidate,
  rankTechnicalTalentCandidates,
} from "@/lib/graph/technicalTalentCombinedRanking";

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

const strongGraphMatch = {
  candidateId:
    "candidate:strong-graph",
  candidateLabel:
    "Strong Graph Candidate",
  matchCount: 3,
  score: 100,
  paths: [
    {
      candidateId:
        "candidate:strong-graph",
      candidateLabel:
        "Strong Graph Candidate",
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
        "candidate:strong-graph",
      candidateLabel:
        "Strong Graph Candidate",
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
        "candidate:strong-graph",
      candidateLabel:
        "Strong Graph Candidate",
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

const weakGraphMatch = {
  candidateId:
    "candidate:weak-graph",
  candidateLabel:
    "Weak Graph Candidate",
  matchCount: 1,
  score: 100,
  paths: [
    {
      candidateId:
        "candidate:weak-graph",
      candidateLabel:
        "Weak Graph Candidate",
      nodeId:
        "skill:python",
      nodeType:
        "skill" as const,
      nodeLabel:
        "Python",
      relationship:
        "demonstrates",
    },
  ],
};

function main(): void {
  console.log(
    "===== ATLAS TECHNICAL TALENT COMBINED RANKING TEST =====",
  );

  const strong =
    rankTechnicalTalentCandidate({
      candidateId:
        "candidate:strong-graph",
      candidateLabel:
        "Strong Graph Candidate",
      fitScore: 80,
      graphMatch:
        strongGraphMatch,
      graphMatchRequestedSignalCount:
        3,
    });

  console.log(
    "\n===== STRONG FIT + STRONG GRAPH =====",
  );

  console.log(
    "FIT:",
    strong.fitScore,
  );

  console.log(
    "GRAPH:",
    strong.graphScore,
  );

  console.log(
    "COMBINED:",
    strong.combinedScore,
  );

  assert(
    strong.combinedScore === 86,
    `Expected 86 combined score, received ${strong.combinedScore}.`,
  );

  const weakGraph =
    rankTechnicalTalentCandidate({
      candidateId:
        "candidate:weak-graph",
      candidateLabel:
        "Weak Graph Candidate",
      fitScore: 80,
      graphMatch: {
        ...weakGraphMatch,
        matchCount: 1,
        paths: [
          weakGraphMatch.paths[0],
        ],
      },
      graphMatchRequestedSignalCount:
        3,
    });

  console.log(
    "\n===== STRONG FIT + WEAK GRAPH =====",
  );

  console.log(
    "FIT:",
    weakGraph.fitScore,
  );

  console.log(
    "GRAPH:",
    weakGraph.graphScore,
  );

  console.log(
    "COMBINED:",
    weakGraph.combinedScore,
  );

  assert(
    weakGraph.graphScore === 42,
    `Expected weak graph coverage to score 42, received ${weakGraph.graphScore}.`,
  );

  assert(
    weakGraph.combinedScore <
      strong.combinedScore,
    "Strong graph evidence did not improve combined ranking.",
  );

  const noGraph =
    rankTechnicalTalentCandidate({
      candidateId:
        "candidate:no-graph",
      candidateLabel:
        "No Graph Match Candidate",
      fitScore: 80,
      graphEvidenceAvailable:
        true,
    });

  console.log(
    "\n===== STRONG FIT + NO GRAPH =====",
  );

  console.log(
    "FIT:",
    noGraph.fitScore,
  );

  console.log(
    "GRAPH:",
    noGraph.graphScore,
  );

  console.log(
    "COMBINED:",
    noGraph.combinedScore,
  );

  assert(
    noGraph.combinedScore === 56,
    `Expected checked-but-unmatched graph evidence to score 56, received ${noGraph.combinedScore}.`,
  );

  const unavailableGraph =
    rankTechnicalTalentCandidate({
      candidateId:
        "candidate:unavailable-graph",
      candidateLabel:
        "Unavailable Graph Candidate",
      fitScore: 80,
      graphEvidenceAvailable:
        false,
    });

  console.log(
    "\n===== GRAPH UNAVAILABLE =====",
  );

  console.log(
    "FIT:",
    unavailableGraph.fitScore,
  );

  console.log(
    "GRAPH:",
    unavailableGraph.graphScore,
  );

  console.log(
    "COMBINED:",
    unavailableGraph.combinedScore,
  );

  console.log(
    "EXPLANATION:",
    unavailableGraph.explanation,
  );

  assert(
    unavailableGraph.combinedScore ===
      80,
    `Graph-unavailable candidate was incorrectly penalized: ${unavailableGraph.combinedScore}.`,
  );

  assert(
    unavailableGraph.graphMatchCount ===
      0,
    "Graph-unavailable candidate incorrectly received graph matches.",
  );

  assert(
    unavailableGraph.explanation.includes(
      "no graph penalty was applied",
    ),
    "Graph-unavailable explanation did not explain the absence of a penalty.",
  );

  const ranked =
    rankTechnicalTalentCandidates([
      {
        candidateId:
          "candidate:a",
        candidateLabel:
          "Candidate A",
        fitScore: 80,
        graphMatch:
          strongGraphMatch,
        graphMatchRequestedSignalCount:
          3,
      },
      {
        candidateId:
          "candidate:b",
        candidateLabel:
          "Candidate B",
        fitScore: 90,
      },
      {
        candidateId:
          "candidate:c",
        candidateLabel:
          "Candidate C",
        fitScore: 70,
        graphMatch:
          strongGraphMatch,
        graphMatchRequestedSignalCount:
          3,
      },
    ]);

  console.log(
    "\n===== RANKING =====",
  );

  ranked.forEach(
    (candidate, index) => {
      console.log(
        `${index + 1}. ${candidate.candidateLabel} | fit=${candidate.fitScore} | graph=${candidate.graphScore} | combined=${candidate.combinedScore}`,
      );
    },
  );

  assert(
    ranked[0].candidateLabel ===
      "Candidate B",
    "Combined ranking did not preserve the strongest fit when graph evidence was unavailable.",
  );

  assert(
    ranked[0].combinedScore ===
      90,
    "Top candidate combined score is incorrect.",
  );

  assert(
    ranked[1].candidateLabel ===
      "Candidate A",
    "Strong graph evidence did not correctly improve the second candidate's ranking.",
  );

  assert(
    ranked[1].combinedScore ===
      86,
    "Graph-enhanced candidate combined score is incorrect.",
  );

  console.log(
    "\n===== WEIGHTING =====",
  );

  console.log(
    "FIT WEIGHT: 70%",
  );

  console.log(
    "GRAPH WEIGHT: 30%",
  );

  console.log(
    "\n===== EXPLANATION =====",
  );

  console.log(
    strong.explanation,
  );

  console.log(
    "\n✅ TECHNICAL TALENT COMBINED RANKING TEST PASSED",
  );
}

main();
