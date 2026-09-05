import type {
  TechnicalTalentDiscoveryRecord,
} from "./types/technicalTalentDiscovery";

import {
  buildTechnicalTalentGraph,
} from "./lib/graph/technicalTalentGraphBuilder";

const candidate: TechnicalTalentDiscoveryRecord = {
  id: "openalex:test-pytorch-001",
  name: "Test PyTorch Researcher",
  primaryDomain: "AI / ML",
  talentType: "Research Scientist",

  skills: [
    {
      name: "machine learning",
      normalizedName: "machine learning",
      domain: "AI / ML",
      evidenceIds: [],
    },
  ],

  technologies: [
    {
      name: "PyTorch",
      normalizedName: "pytorch",
      domain: "AI / ML",
      evidenceIds: [],
    },
  ],

  researchAreas: [
    "Deep Learning",
  ],

  publications: [],
  repositories: [],
  conferences: [],
  affiliations: [],
  signals: [],
  evidence: [],
} as any;

const graph =
  buildTechnicalTalentGraph(candidate);

console.log("\n=== OPENALEX TECHNOLOGY TEST ===");

console.log("\nTechnologies:");
console.log(
  candidate.technologies,
);

console.log("\nTechnology graph nodes:");
console.log(
  graph.nodes.filter(
    (node) =>
      node.type === "technology",
  ),
);

console.log("\nTechnology graph edges:");
console.log(
  graph.edges.filter(
    (edge) =>
      edge.to ===
      "technology:pytorch",
  ),
);

const pytorchNode =
  graph.nodes.find(
    (node) =>
      node.id ===
      "technology:pytorch",
  );

const pytorchEdge =
  graph.edges.find(
    (edge) =>
      edge.to ===
      "technology:pytorch",
  );

if (!pytorchNode) {
  throw new Error(
    "FAIL: PyTorch technology node was not created.",
  );
}

if (!pytorchEdge) {
  throw new Error(
    "FAIL: PyTorch technology edge was not created.",
  );
}

console.log(
  "\nPASS: PyTorch technology signal reaches the graph.",
);
