import {
  buildTechnicalTalentGraphForCandidate,
} from "@/lib/technicalTalent/technicalTalentGraphService";

import type {
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `FAIL: ${message}`,
    );
  }
}

async function main(): Promise<void> {
  console.log(
    "===== ATLAS TECHNICAL TALENT GRAPH SERVICE TEST =====",
  );

  const candidate =
    {
      id:
        "candidate:graph-service-runtime",

      name:
        "Atlas Graph Service Candidate",

      headline:
        "Robotics Research Engineer",

      primaryDomain:
        "Robotics",

      talentType:
        "Research Engineer",

      roleFamily:
        "Research",

      normalizedRole:
        "Research Engineer",

      skills: [
        {
          name:
            "Computer Vision",
        },
      ],

      technologies: [
        {
          name:
            "PyTorch",
        },
      ],

      researchAreas: [
        "Embodied AI",
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
          year:
            2025,
          url:
            "https://example.com/publication/embodied-ai-runtime",
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

  const graph =
    buildTechnicalTalentGraphForCandidate(
      candidate,
    );

  console.log(
    "\n===== SERVICE RESULT =====",
  );

  console.log(
    "NODES:",
    graph.nodes.length,
  );

  console.log(
    "EDGES:",
    graph.edges.length,
  );

  assert(
    graph.nodes.length === 7,
    "Expected exactly 7 graph nodes.",
  );

  assert(
    graph.edges.length === 6,
    "Expected exactly 6 graph edges.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "candidate" &&
        node.label ===
          "Atlas Graph Service Candidate",
    ),
    "Candidate node was not returned.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "skill" &&
        node.label ===
          "Computer Vision",
    ),
    "Skill node was not returned.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "technology" &&
        node.label ===
          "PyTorch",
    ),
    "Technology node was not returned.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "repository" &&
        node.label ===
          "atlas/robotics-runtime",
    ),
    "Repository node was not returned.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "publication" &&
        node.label ===
          "Embodied AI Runtime Systems",
    ),
    "Publication node was not returned.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "researchArea" &&
        node.label ===
          "Embodied AI",
    ),
    "Research-area node was not returned.",
  );

  assert(
    graph.nodes.some(
      (node) =>
        node.type === "conference" &&
        node.label ===
          "ICRA",
    ),
    "Conference node was not returned.",
  );

  console.log(
    "\n===== RELATIONSHIPS =====",
  );

  graph.edges.forEach(
    (edge) => {
      console.log(
        `- ${edge.relationship} | ${edge.from} -> ${edge.to}`,
      );
    },
  );

  console.log(
    "\n✅ TECHNICAL TALENT GRAPH SERVICE TEST PASSED",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ TECHNICAL TALENT GRAPH SERVICE TEST FAILED",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);
