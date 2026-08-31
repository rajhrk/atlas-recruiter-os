import type {
  OpenAlexAuthor,
  OpenAlexWork,
} from "@/lib/technicalTalent/providers/research/OpenAlexProvider";

import { buildTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphBuilder";
import { queryTechnicalTalentGraph } from "@/lib/graph/technicalTalentGraphQuery";
import { scoreTechnicalTalentGraphMatch } from "@/lib/graph/technicalTalentGraphMatchScorer";
import { rankTechnicalTalentCandidates } from "@/lib/graph/technicalTalentCombinedRanking";

const author: OpenAlexAuthor = {
  id: "https://openalex.org/A_TEST_PYTORCH",
  display_name: "Test PyTorch Researcher",
  works_count: 1,
  cited_by_count: 100,
  topics: [],
};

const work: OpenAlexWork = {
  id: "https://openalex.org/W_TEST_PYTORCH",
  title: "Deep Learning with PyTorch",
  publication_year: 2025,
  cited_by_count: 25,
  authorships: [
    {
      author: {
        id: author.id,
        display_name: author.display_name,
      },
    },
  ],
  abstract_inverted_index: {
    "We": [0],
    "use": [1],
    "PyTorch": [2],
    "for": [3],
    "machine": [4],
    "learning": [5],
  },
};

const searchableText = [
  work.title ?? "",
  Object.keys(
    work.abstract_inverted_index ?? {},
  ).join(" "),
]
  .join(" ")
  .toLowerCase();

const technologyName = "PyTorch";
const normalizedTechnology = technologyName
  .trim()
  .toLowerCase();

const technologyEvidenceIds =
  searchableText.includes(normalizedTechnology)
    ? [`openalex:work:${work.id.split("/").pop()}`]
    : [];

const candidate = {
  id: "openalex:A_TEST_PYTORCH",
  name: author.display_name!,
  primaryDomain: "AI / ML",
  talentType: "Research Scientist",

  skills: [
    {
      name: "Machine Learning",
      normalizedName: "machine learning",
      domain: "AI / ML",
      evidenceIds: [],
    },
  ],

  technologies:
    technologyEvidenceIds.length > 0
      ? [
          {
            name: technologyName,
            normalizedName: normalizedTechnology,
            domain: "AI / ML",
            evidenceIds: technologyEvidenceIds,
          },
        ]
      : [],

  researchAreas: [],
  publications: [
    {
      title: work.title!,
      url: work.id,
      year: work.publication_year!,
      citationCount: work.cited_by_count,
    },
  ],

  repositories: [],
  conferences: [],
  affiliations: [],
  signals: [],
  evidence: [],
} as any;

console.log("\n=== 1. TECHNOLOGY EXTRACTION ===");
console.log(
  JSON.stringify(candidate.technologies, null, 2),
);

if (candidate.technologies.length !== 1) {
  throw new Error(
    "FAIL: PyTorch technology was not extracted.",
  );
}

console.log("PASS: PyTorch extracted from publication text.");

console.log("\n=== 2. GRAPH BUILD ===");

const graph = buildTechnicalTalentGraph(candidate);

console.log(
  "Technology nodes:",
  graph.nodes.filter(
    (node) => node.type === "technology",
  ),
);

console.log(
  "Technology edges:",
  graph.edges.filter(
    (edge) =>
      edge.to === "technology:pytorch",
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

const expectedEvidenceId =
  "openalex:work:W_TEST_PYTORCH";

if (!pytorchNode) {
  throw new Error(
    "FAIL: PyTorch technology node was not created.",
  );
}

if (
  !pytorchNode.evidenceIds?.includes(
    expectedEvidenceId,
  )
) {
  throw new Error(
    "FAIL: PyTorch node lost its OpenAlex evidence provenance.",
  );
}

if (!pytorchEdge) {
  throw new Error(
    "FAIL: PyTorch technology edge was not created.",
  );
}

if (
  !pytorchEdge.evidenceIds?.includes(
    expectedEvidenceId,
  )
) {
  throw new Error(
    "FAIL: PyTorch edge lost its OpenAlex evidence provenance.",
  );
}

console.log(
  "PASS: PyTorch graph node retains OpenAlex evidence provenance.",
);

console.log(
  "PASS: PyTorch graph edge retains OpenAlex evidence provenance.",
);

console.log("\n=== 3. GRAPH QUERY ===");

const matches = queryTechnicalTalentGraph(
  graph,
  {
    technologies: ["PyTorch"],
    minimumMatches: 1,
  },
);

console.log(
  JSON.stringify(matches, null, 2),
);

if (matches.length !== 1) {
  throw new Error(
    "FAIL: PyTorch graph query returned no match.",
  );
}

console.log("PASS: PyTorch graph match found.");

console.log("\n=== 4. GRAPH SCORE ===");

const graphScore =
  scoreTechnicalTalentGraphMatch(
    matches[0],
    1,
  );

console.log(
  JSON.stringify(graphScore, null, 2),
);

if (graphScore.score <= 0) {
  throw new Error(
    "FAIL: Graph score is zero.",
  );
}

console.log("PASS: Graph score generated.");

console.log("\n=== 5. COMBINED RANKING ===");

const rankings =
  rankTechnicalTalentCandidates([
    {
      candidateId: candidate.id,
      candidateLabel: candidate.name,
      fitScore: 80,
      graphMatch: matches[0],
      graphEvidenceAvailable: true,
      graphMatchRequestedSignalCount: 1,
    },
  ]);

console.log(
  JSON.stringify(rankings, null, 2),
);

if (
  rankings.length !== 1 ||
  rankings[0].combinedScore <= 80
) {
  throw new Error(
    "FAIL: Combined ranking did not incorporate graph evidence.",
  );
}

console.log(
  "\nPASS: Graph evidence affects combined ranking.",
);

console.log(
  "\n=== END-TO-END TEST PASSED ===",
);
