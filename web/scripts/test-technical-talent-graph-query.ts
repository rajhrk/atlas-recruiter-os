import {
  queryTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphQuery";

import {
  buildTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphBuilder";

import type {
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  console.log(
    "===== ATLAS TECHNICAL TALENT GRAPH QUERY TEST =====",
  );

  const candidate =
    {
      id:
        "candidate:graph-query-runtime",

      name:
        "Atlas Graph Query Candidate",

      primaryDomain:
        "Robotics",

      talentType:
        "Robotics Engineer",

      roleFamily:
        "Robotics",

      normalizedRole:
        "Robotics Engineer",

      skills: [
        {
          name:
            "Computer Vision",
        },
        {
          name:
            "Python",
        },
      ],

      technologies: [
        {
          name:
            "PyTorch",
        },
        {
          name:
            "ROS2",
        },
      ],

      researchAreas: [
        "Embodied AI",
        "Robotics",
      ],

      repositories: [
        {
          repository:
            "atlas/robotics-runtime",
          url:
            "https://github.com/atlas/robotics-runtime",
        },
      ],

      publications: [
        {
          title:
            "Embodied AI Runtime Systems",
          url:
            "https://example.com/publication/embodied-ai-runtime",
          year:
            2025,
        },
      ],

      conferences: [
        {
          name:
            "ICRA",
          year:
            2025,
          role:
            "Author",
        },
      ],

      evidence: [],

      approvalStatus:
        "Unreviewed",
    } as TechnicalTalentDiscoveryRecord;

  const secondCandidate =
    {
      id:
        "candidate:graph-query-partial",

      name:
        "Atlas Graph Partial Candidate",

      primaryDomain:
        "Robotics",

      talentType:
        "Robotics Engineer",

      roleFamily:
        "Robotics",

      normalizedRole:
        "Robotics Engineer",

      skills: [
        {
          name:
            "Python",
        },
      ],

      technologies: [
        {
          name:
            "ROS2",
        },
      ],

      researchAreas: [
        "Robotics",
      ],

      repositories: [],

      publications: [],

      conferences: [],

      evidence: [],

      approvalStatus:
        "Unreviewed",
    } as TechnicalTalentDiscoveryRecord;

  const graph =
    buildTechnicalTalentGraph(
      candidate,
    );

  const secondGraph =
    buildTechnicalTalentGraph(
      secondCandidate,
    );

  const combinedGraph = {
    nodes: [
      ...graph.nodes,
      ...secondGraph.nodes,
    ],
    edges: [
      ...graph.edges,
      ...secondGraph.edges,
    ],
  };

  console.log(
    "\n===== GRAPH =====",
  );

  console.log(
    "NODES:",
    graph.nodes.length,
  );

  console.log(
    "EDGES:",
    graph.edges.length,
  );

  const results =
    queryTechnicalTalentGraph(
      combinedGraph,
      {
        skills: [
          "Computer Vision",
        ],
        technologies: [
          "PyTorch",
        ],
        researchAreas: [
          "Embodied AI",
        ],
      },
    );

  console.log(
    "\n===== QUERY RESULT =====",
  );

  console.log(
    "RESULTS:",
    results.length,
  );

  assert(
    results.length === 1,
    "Expected exactly one candidate to satisfy the complete graph query.",
  );

  const result =
    results[0];

  assert(
    result.candidateId ===
      "candidate:candidate:graph-query-runtime",
    "The strongest candidate was not ranked first.",
  );

  assert(
    result.score === 100,
    `Expected strongest candidate score to be 100, received ${result.score}.`,
  );

  const rankedResults =
    queryTechnicalTalentGraph(
      combinedGraph,
      {
        skills: [
          "Computer Vision",
          "Python",
          "Robotics",
        ],
        technologies: [
          "PyTorch",
        ],
        researchAreas: [
          "Embodied AI",
        ],
      },
      );

  assert(
    result.candidateId ===
      "candidate:candidate:graph-query-runtime",
    "Candidate identity was not preserved.",
  );

  assert(
    result.matchCount === 3,
    `Expected 3 graph matches, received ${result.matchCount}.`,
  );

  assert(
    result.score === 100,
    `Expected a 100 graph match score, received ${result.score}.`,
  );

  assert(
    result.paths.some(
      (path) =>
        path.nodeType ===
          "skill" &&
        path.nodeLabel ===
          "Computer Vision" &&
        path.relationship ===
          "demonstrates",
    ),
    "Computer Vision graph path was not returned.",
  );

  assert(
    result.paths.some(
      (path) =>
        path.nodeType ===
          "technology" &&
        path.nodeLabel ===
          "PyTorch" &&
        path.relationship ===
          "uses",
    ),
    "PyTorch graph path was not returned.",
  );

  assert(
    result.paths.some(
      (path) =>
        path.nodeType ===
          "researchArea" &&
        path.nodeLabel ===
          "Embodied AI" &&
        path.relationship ===
          "researches",
    ),
    "Embodied AI graph path was not returned.",
  );

  assert(
    rankedResults.length === 2,
    "Expected both candidates to appear in the broader graph ranking query.",
  );

  assert(
    rankedResults[0].candidateId ===
      "candidate:candidate:graph-query-runtime",
    "The fully matching candidate was not ranked first.",
  );

  assert(
    rankedResults[0].score >
      rankedResults[1].score,
    "Graph ranking did not place the stronger candidate above the partial candidate.",
  );

  assert(
    rankedResults[1].score > 0 &&
      rankedResults[1].score < 100,
    `Expected partial candidate score between 0 and 100, received ${rankedResults[1].score}.`,
  );

  const limitedResults =
    queryTechnicalTalentGraph(
      combinedGraph,
      {
        skills: [
          "Computer Vision",
          "Python",
          "Robotics",
        ],
        technologies: [
          "PyTorch",
        ],
        researchAreas: [
          "Embodied AI",
        ],
        limit: 1,
      },
    );

  assert(
    limitedResults.length === 1,
    `Expected graph query limit=1 to return exactly one candidate, received ${limitedResults.length}.`,
  );

  assert(
    limitedResults[0].candidateId ===
      "candidate:candidate:graph-query-runtime",
    "Graph query limit did not retain the highest-ranked candidate.",
  );

  assert(
    limitedResults[0].score ===
      rankedResults[0].score,
    "Limited graph query returned a different score for the top-ranked candidate.",
  );

  console.log(
    "\n===== QUERY LIMIT =====",
  );

  console.log(
    `LIMIT: 1 | RETURNED: ${limitedResults.length} | TOP SCORE: ${limitedResults[0].score}`,
  );

  console.log(
    "\n===== MULTI-CANDIDATE RANKING =====",
  );

  rankedResults.forEach(
    (item, index) => {
      console.log(
        `${index + 1}. ${item.candidateLabel} | score=${item.score} | matches=${item.matchCount}`,
      );
    },
  );

  const filtered =
    queryTechnicalTalentGraph(
      graph,
      {
        skills: [
          "Computer Vision",
          "Python",
        ],
        minimumMatches: 2,
      },
    );

  assert(
    filtered.length === 1,
    "minimumMatches filtering failed.",
  );

  const relationshipFiltered =
    queryTechnicalTalentGraph(
      graph,
      {
        technologies: [
          "PyTorch",
        ],
        relationships: [
          "demonstrates",
        ],
      },
    );

  assert(
    relationshipFiltered.length === 0,
    "Relationship filtering incorrectly matched a 'uses' edge as 'demonstrates'.",
  );

  console.log(
    "\n===== MATCH PATHS =====",
  );

  result.paths.forEach(
    (path) => {
      console.log(
        `- ${path.relationship} | ${path.candidateLabel} -> ${path.nodeLabel}`,
      );
    },
  );

  console.log(
    "\n===== SCORE =====",
  );

  console.log(
    "GRAPH MATCH SCORE:",
    result.score,
  );

  console.log(
    "\n✅ TECHNICAL TALENT GRAPH QUERY TEST PASSED",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ TECHNICAL TALENT GRAPH QUERY TEST FAILED",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);
