import {
  rankTechnicalTalentCandidates,
} from "@/lib/graph/technicalTalentCombinedRanking";

import type {
  TechnicalTalentGraphMatch,
} from "@/types/technicalTalentDiscovery";

const alexGraphMatch: TechnicalTalentGraphMatch = {
  candidateId: "candidate-a",
  candidateLabel: "Alex Researcher",
  matchCount: 4,
  score: 100,
  paths: [
    {
      candidateId: "candidate-a",
      candidateLabel: "Alex Researcher",
      nodeId: "skill:machine-learning",
      nodeType: "Skill",
      nodeLabel: "Machine Learning",
      relationship: "demonstrates",
    },
    {
      candidateId: "candidate-a",
      candidateLabel: "Alex Researcher",
      nodeId: "technology:pytorch",
      nodeType: "Technology",
      nodeLabel: "PyTorch",
      relationship: "uses",
    },
    {
      candidateId: "candidate-a",
      candidateLabel: "Alex Researcher",
      nodeId: "research:deep-learning",
      nodeType: "ResearchArea",
      nodeLabel: "Deep Learning",
      relationship: "researches",
    },
    {
      candidateId: "candidate-a",
      candidateLabel: "Alex Researcher",
      nodeId: "repo:ml-research-pytorch",
      nodeType: "Repository",
      nodeLabel: "ml-research-pytorch",
      relationship: "contributes_to",
    },
  ],
};

const jordanGraphMatch: TechnicalTalentGraphMatch = {
  candidateId: "candidate-b",
  candidateLabel: "Jordan Engineer",
  matchCount: 2,
  score: 100,
  paths: [
    {
      candidateId: "candidate-b",
      candidateLabel: "Jordan Engineer",
      nodeId: "skill:machine-learning",
      nodeType: "Skill",
      nodeLabel: "Machine Learning",
      relationship: "demonstrates",
    },
    {
      candidateId: "candidate-b",
      candidateLabel: "Jordan Engineer",
      nodeId: "technology:python",
      nodeType: "Technology",
      nodeLabel: "Python",
      relationship: "uses",
    },
  ],
};

const samGraphMatch: TechnicalTalentGraphMatch = {
  candidateId: "candidate-c",
  candidateLabel: "Sam Developer",
  matchCount: 1,
  score: 100,
  paths: [
    {
      candidateId: "candidate-c",
      candidateLabel: "Sam Developer",
      nodeId: "skill:machine-learning",
      nodeType: "Skill",
      nodeLabel: "Machine Learning",
      relationship: "demonstrates",
    },
  ],
};

console.log("\n=== CROSS-SOURCE CANDIDATE RANKING TEST ===");

const rankings =
  rankTechnicalTalentCandidates([
    {
      candidateId: "candidate-a",
      candidateLabel: "Alex Researcher",
      fitScore: 85,
      graphMatch: alexGraphMatch,
      graphEvidenceAvailable: true,
      graphMatchRequestedSignalCount: 4,
    },
    {
      candidateId: "candidate-b",
      candidateLabel: "Jordan Engineer",
      fitScore: 78,
      graphMatch: jordanGraphMatch,
      graphEvidenceAvailable: true,
      graphMatchRequestedSignalCount: 4,
    },
    {
      candidateId: "candidate-c",
      candidateLabel: "Sam Developer",
      fitScore: 65,
      graphMatch: samGraphMatch,
      graphEvidenceAvailable: true,
      graphMatchRequestedSignalCount: 4,
    },
  ]);

console.log(
  JSON.stringify(
    rankings,
    null,
    2,
  ),
);

if (rankings.length !== 3) {
  throw new Error(
    `FAIL: Expected 3 ranked candidates, got ${rankings.length}.`,
  );
}

if (
  rankings[0].candidateId !==
  "candidate-a"
) {
  throw new Error(
    `FAIL: Expected Alex Researcher to rank #1, got ${rankings[0].candidateLabel}.`,
  );
}

if (
  rankings[0].graphScore <=
  rankings[1].graphScore
) {
  throw new Error(
    "FAIL: Alex should have stronger graph evidence than Jordan.",
  );
}

if (
  rankings[1].graphScore <=
  rankings[2].graphScore
) {
  throw new Error(
    "FAIL: Jordan should have stronger graph evidence than Sam.",
  );
}

if (
  rankings[0].combinedScore <=
  rankings[1].combinedScore
) {
  throw new Error(
    "FAIL: #1 candidate does not have a higher combined score.",
  );
}

if (
  rankings[1].combinedScore <=
  rankings[2].combinedScore
) {
  throw new Error(
    "FAIL: Ranking order is not descending by combined score.",
  );
}

console.log(
  `PASS: ${rankings[0].candidateLabel} ranked #1.`,
);

console.log(
  `PASS: Graph scores descend ${rankings
    .map(
      (ranking) =>
        ranking.graphScore,
    )
    .join(" > ")}.`,
);

console.log(
  `PASS: Combined scores descend ${rankings
    .map(
      (ranking) =>
        ranking.combinedScore,
    )
    .join(" > ")}.`,
);

console.log(
  "\n=== CROSS-SOURCE CANDIDATE RANKING TEST PASSED ===",
);
