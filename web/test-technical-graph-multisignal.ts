import { buildTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphBuilder";
import { queryTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphQuery";
import { scoreTechnicalTalentGraphMatch } from "@/lib/graph/technicalTalentGraphMatchScorer";
import { rankTechnicalTalentCandidates } from "@/lib/graph/technicalTalentCombinedRanking";

const candidate = {
  id: "test-multisignal-001",
  name: "Multi-Signal ML Researcher",
  primaryDomain: "AI / ML",
  talentType: "Research Scientist",

  skills: [
    {
      name: "Machine Learning",
      strength: "High",
      evidenceIds: [],
    },
  ],

  technologies: [
    {
      name: "PyTorch",
      strength: "High",
      evidenceIds: [],
    },
    {
      name: "Python",
      strength: "High",
      evidenceIds: [],
    },
  ],

  researchAreas: [
    "Deep Learning",
    "Computer Vision",
  ],

  conferences: [
    {
      name: "NeurIPS",
      evidenceIds: [],
    },
  ],

  publications: [
    {
      title: "Deep Learning with PyTorch",
      url: "https://example.com/publication",
      year: 2025,
    },
  ],

  repositories: [
    {
      repository: "ml-research-pytorch",
      url: "https://github.com/example/ml-research-pytorch",
    },
  ],

  affiliations: [],
  signals: [],
  evidence: [],
} as any;

console.log("\n=== 1. BUILD MULTI-SIGNAL GRAPH ===");

const graph = buildTechnicalTalentGraph(candidate);

console.log("Nodes:", graph.nodes.length);
console.log("Edges:", graph.edges.length);

console.log("\nNodes:");
console.log(JSON.stringify(graph.nodes, null, 2));

console.log("\nEdges:");
console.log(JSON.stringify(graph.edges, null, 2));

console.log("\n=== 2. QUERY MULTIPLE SIGNALS ===");

const matches = queryTechnicalTalentGraph(
  graph,
  {
    skills: ["Machine Learning"],
    technologies: ["PyTorch", "Python"],
    repositories: ["ml-research-pytorch"],
    publications: ["Deep Learning with PyTorch"],
    researchAreas: [
      "Deep Learning",
      "Computer Vision",
    ],
    conferences: ["NeurIPS"],
    minimumMatches: 1,
  },
);

console.log(JSON.stringify(matches, null, 2));

if (matches.length === 0) {
  throw new Error(
    "FAIL: Multi-signal graph query returned no matches.",
  );
}

console.log("\n=== 3. GRAPH SCORE ===");

const scored = scoreTechnicalTalentGraphMatch(
  matches[0],
  8,
);

console.log(JSON.stringify(scored, null, 2));

if (scored.matchCount < 8) {
  throw new Error(
    `FAIL: Expected at least 5 graph matches, got ${scored.matchCount}.`,
  );
}

if (scored.score <= 0) {
  throw new Error(
    "FAIL: Multi-signal graph score should be greater than zero.",
  );
}

console.log(
  "\nPASS: Multiple technical signals contribute to graph evidence.",
);

console.log("\n=== 4. COMBINED RANKING ===");

const rankings = rankTechnicalTalentCandidates([
  {
    candidateId: candidate.id,
    candidateLabel: candidate.name,
    fitScore: 80,
    graphMatch: matches[0],
    graphEvidenceAvailable: true,
    graphMatchRequestedSignalCount: 8,
  },
]);

console.log(JSON.stringify(rankings, null, 2));

if (
  rankings.length !== 1 ||
  rankings[0].combinedScore <= 80
) {
  throw new Error(
    "FAIL: Graph evidence did not improve the combined ranking.",
  );
}

console.log(
  "\nPASS: Multi-signal graph evidence improves combined ranking.",
);

console.log("\n=== MULTI-SIGNAL GRAPH TEST PASSED ===");
