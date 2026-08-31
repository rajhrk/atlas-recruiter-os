import { buildTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphBuilder";
import { queryTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphQuery";
import { scoreTechnicalTalentGraphMatch } from "@/lib/graph/technicalTalentGraphMatchScorer";
import type { GraphNode, GraphEdge } from "@/types/graph";

const requestedSignals = {
  skills: ["Machine Learning"],
  technologies: ["PyTorch", "Python"],
  researchAreas: ["Deep Learning", "Computer Vision"],
  repositories: ["ml-research-pytorch"],
  publications: ["Deep Learning with PyTorch"],
  conferences: ["NeurIPS"],
};

const candidates: any[] = [
  {
    id: "partial-a",
    name: "Candidate A — Full Signal",
    skills: [{ name: "Machine Learning", evidenceIds: ["e1"] }],
    technologies: [
      { name: "PyTorch", evidenceIds: ["e2"] },
      { name: "Python", evidenceIds: ["e3"] },
    ],
    researchAreas: [
      "Deep Learning",
      "Computer Vision",
    ],
    repositories: [
      {
        url: "https://github.com/example/ml-research-pytorch",
        repository: "ml-research-pytorch",
      },
    ],
    publications: [
      { title: "Deep Learning with PyTorch" },
    ],
    conferences: [
      { name: "NeurIPS" },
    ],
  },

  {
    id: "partial-b",
    name: "Candidate B — Six Signals",
    skills: [{ name: "Machine Learning" }],
    technologies: [
      { name: "PyTorch" },
      { name: "Python" },
    ],
    researchAreas: [
      "Deep Learning",
      "Computer Vision",
    ],
    repositories: [
      {
        url: "https://github.com/example/ml-research-pytorch",
        repository: "ml-research-pytorch",
      },
    ],
    publications: [],
    conferences: [],
  },

  {
    id: "partial-c",
    name: "Candidate C — Three Signals",
    skills: [{ name: "Machine Learning" }],
    technologies: [{ name: "Python" }],
    researchAreas: ["Computer Vision"],
    repositories: [],
    publications: [],
    conferences: [],
  },
] as any[];

console.log("\n=== PARTIAL-SIGNAL GRAPH TEST ===");

const graphParts = candidates.map((candidate: any) =>
  buildTechnicalTalentGraph(candidate),
);

const graph = {
  nodes: graphParts
    .flatMap((part: any) => part.nodes)
    .filter(
      (node: any, index: number, nodes: any[]) =>
        nodes.findIndex(
          (existing: any) =>
            existing.id === node.id &&
            existing.type === node.type,
        ) === index,
    ),

  edges: graphParts.flatMap(
    (part) => part.edges,
  ),
};

console.log(
  `Graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges`,
);

const matches = queryTechnicalTalentGraph(
  graph,
  requestedSignals,
);

console.log("\n=== MATCHES ===");

for (const candidate of candidates) {
  const match = matches.find(
    (item) =>
      item.candidateId === `candidate:${candidate.id}`,
  );

  if (!match) {
    throw new Error(
      `FAIL: No graph match returned for ${candidate.name}`,
    );
  }

  const score = scoreTechnicalTalentGraphMatch(
    match,
    8,
  );

  console.log({
    candidate: candidate.name,
    matchCount: match.matchCount,
    graphScore: score.score,
    paths: match.paths.map(
      (path) => path.nodeLabel,
    ),
  });
}

console.log("\n=== ASSERTIONS ===");

const full = matches.find(
  (match) =>
    match.candidateId === "candidate:partial-a",
);

const six = matches.find(
  (match) =>
    match.candidateId === "candidate:partial-b",
);

const three = matches.find(
  (match) =>
    match.candidateId === "candidate:partial-c",
);

if (!full || !six || !three) {
  throw new Error("FAIL: Expected all candidates to match.");
}

const fullScore =
  scoreTechnicalTalentGraphMatch(full, 8).score;

const sixScore =
  scoreTechnicalTalentGraphMatch(six, 8).score;

const threeScore =
  scoreTechnicalTalentGraphMatch(three, 8).score;

if (fullScore !== 100) {
  throw new Error(
    `FAIL: Full-signal candidate expected 100, got ${fullScore}`,
  );
}

if (!(sixScore < fullScore)) {
  throw new Error(
    "FAIL: Six-signal candidate was not ranked below full-signal candidate.",
  );
}

if (!(threeScore < sixScore)) {
  throw new Error(
    "FAIL: Three-signal candidate was not ranked below six-signal candidate.",
  );
}

console.log("PASS: Full signal = 100");

console.log(
  `PASS: Six signals = ${sixScore} (< 100)`,
);

console.log(
  `PASS: Three signals = ${threeScore} (< ${sixScore})`,
);

console.log(
  "PASS: Missing graph evidence does not become positive evidence.",
);

console.log(
  "\n=== PARTIAL-SIGNAL GRAPH TEST PASSED ===",
);
