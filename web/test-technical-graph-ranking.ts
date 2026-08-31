import { buildTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphBuilder";
import { queryTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphQuery";
import { scoreTechnicalTalentGraphMatch } from "@/lib/graph/technicalTalentGraphMatchScorer";
import { rankTechnicalTalentCandidates } from "@/lib/graph/technicalTalentCombinedRanking";

function candidate(
  id: string,
  name: string,
  signals: {
    skills?: string[];
    technologies?: string[];
    repositories?: string[];
    publications?: string[];
    researchAreas?: string[];
    conferences?: string[];
  },
): any {
  return {
    id,
    name,
    primaryDomain: "AI / ML",
    talentType: "Research Scientist",

    skills: (signals.skills ?? []).map((name) => ({
      name,
      normalizedName: name.toLowerCase(),
      domain: "AI / ML",
      evidenceIds: [],
    })),

    technologies: (signals.technologies ?? []).map((name) => ({
      name,
      normalizedName: name.toLowerCase(),
      domain: "AI / ML",
      evidenceIds: [],
    })),

    repositories: (signals.repositories ?? []).map((repository) => ({
      repository,
      url: `https://github.com/example/${repository}`,
      evidenceIds: [],
    })),

    publications: (signals.publications ?? []).map((title) => ({
      title,
      url: `https://example.com/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      evidenceIds: [],
    })),

    researchAreas: signals.researchAreas ?? [],
    conferences: (signals.conferences ?? []).map((name) => ({
      name,
      evidenceIds: [],
    })),

    affiliations: [],
    signals: [],
    evidence: [],
  };
}

const candidateA = candidate(
  "candidate-a",
  "Candidate A — Deep Technical",
  {
    skills: ["Machine Learning"],
    technologies: ["PyTorch", "Python"],
    repositories: ["ml-research-pytorch"],
    publications: ["Deep Learning with PyTorch"],
    researchAreas: ["Deep Learning", "Computer Vision"],
    conferences: ["NeurIPS"],
  },
);

const candidateB = candidate(
  "candidate-b",
  "Candidate B — Core ML",
  {
    skills: ["Machine Learning"],
    technologies: ["PyTorch", "Python"],
  },
);

const candidateC = candidate(
  "candidate-c",
  "Candidate C — Partial Match",
  {
    technologies: ["Python"],
    researchAreas: ["Computer Vision"],
  },
);

const candidates = [
  candidateA,
  candidateB,
  candidateC,
];

const graph = candidates
  .map(buildTechnicalTalentGraph)
  .reduce(
    (combined, part) => ({
      nodes: [...combined.nodes, ...part.nodes],
      edges: [...combined.edges, ...part.edges],
    }),
    { nodes: [], edges: [] } as any,
  );

console.log("\n=== 1. MULTI-CANDIDATE GRAPH ===");
console.log("Nodes:", graph.nodes.length);
console.log("Edges:", graph.edges.length);

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

console.log("\n=== 2. GRAPH MATCHES ===");

for (const match of matches) {
  const scored = scoreTechnicalTalentGraphMatch(
    match,
    8,
  );

  console.log(
    JSON.stringify(
      {
        candidate: match.candidateLabel,
        matchCount: match.matchCount,
        graphScore: scored.score,
        paths: match.paths.map(
          (path) => path.nodeLabel,
        ),
      },
      null,
      2,
    ),
  );
}

const matchByCandidate = new Map(
  matches.map((match) => [
    match.candidateId.replace(
      "candidate:",
      "",
    ),
    match,
  ]),
);

console.log("\n=== 3. COMBINED RANKING ===");

const rankings = rankTechnicalTalentCandidates(
  candidates.map((c) => ({
    candidateId: c.id,
    candidateLabel: c.name,
    fitScore:
      c.id === "candidate-a"
        ? 80
        : c.id === "candidate-b"
          ? 85
          : 90,
    graphMatch:
      matchByCandidate.get(c.id),
    graphEvidenceAvailable: true,
    graphMatchRequestedSignalCount: 8,
  })),
);

console.log(
  JSON.stringify(rankings, null, 2),
);

if (matches.length !== 3) {
  throw new Error(
    `FAIL: Expected 3 candidates to match, got ${matches.length}.`,
  );
}

const a = rankings.find(
  (r) => r.candidateId === "candidate-a",
);
const b = rankings.find(
  (r) => r.candidateId === "candidate-b",
);
const c = rankings.find(
  (r) => r.candidateId === "candidate-c",
);

if (!a || !b || !c) {
  throw new Error(
    "FAIL: Expected all three candidates in ranking.",
  );
}

if (
  a.graphMatchCount !== 8 ||
  b.graphMatchCount !== 3 ||
  c.graphMatchCount !== 2
) {
  throw new Error(
    `FAIL: Unexpected graph match counts: A=${a.graphMatchCount}, B=${b.graphMatchCount}, C=${c.graphMatchCount}`,
  );
}

if (
  a.graphScore <= b.graphScore ||
  b.graphScore <= c.graphScore
) {
  throw new Error(
    "FAIL: Graph scores did not differentiate candidates correctly.",
  );
}

if (a.combinedScore <= a.fitScore) {
  throw new Error(
    "FAIL: Strong graph evidence did not improve Candidate A.",
  );
}

console.log(
  "\nPASS: Graph evidence differentiates competing candidates.",
);

console.log(
  "\n=== COMPETING-CANDIDATE GRAPH TEST PASSED ===",
);
