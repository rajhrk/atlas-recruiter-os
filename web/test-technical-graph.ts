import { buildTechnicalTalentGraph } from "./lib/graph/technicalTalentGraphBuilder";
import { queryTechnicalTalentGraph } from "./lib/graph/technicalTalentGraphQuery";
import { scoreTechnicalTalentGraphMatch } from "./lib/graph/technicalTalentGraphMatchScorer";

const candidate = {
  id: "test-pytorch-001",
  name: "Test PyTorch Candidate",
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

  publications: [
    {
      title: "Deep Learning with PyTorch",
      url: "https://example.com/publication",
      year: 2025,
      venue: "Test Conference",
      citationCount: 10,
    },
  ],

  repositories: [
    {
      repository: "test/pytorch-project",
      url: "https://github.com/test/pytorch-project",
      description: "PyTorch machine learning project",
    },
  ],

  conferences: [],
  affiliations: [],
  signals: [],
  evidence: [],
} as any;

const graph = buildTechnicalTalentGraph(candidate);

console.log("\n=== GRAPH ===");
console.log("Nodes:", graph.nodes.length);
console.log("Edges:", graph.edges.length);

console.log("\nTechnology nodes:");
console.log(
  graph.nodes.filter(
    (n) => n.type === "technology",
  ),
);

console.log("\nResearch area nodes:");
console.log(
  graph.nodes.filter(
    (n) => n.type === "researchArea",
  ),
);

console.log("\n=== PYTORCH QUERY ===");

const matches = queryTechnicalTalentGraph(
  graph,
  {
    technologies: ["PyTorch"],
    minimumMatches: 1,
  },
);

console.log(JSON.stringify(matches, null, 2));

if (matches.length > 0) {
  const scored = scoreTechnicalTalentGraphMatch(
    matches[0],
    1,
  );

  console.log("\n=== GRAPH SCORE ===");
  console.log(JSON.stringify(scored, null, 2));
}
