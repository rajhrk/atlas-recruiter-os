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
    throw new Error(`FAIL: ${message}`);
  }
}

async function main(): Promise<void> {
  console.log(
    "===== ATLAS TECHNICAL TALENT GRAPH TEST =====",
  );

  const candidate =
    {
      id:
        "candidate:graph-runtime",

      name:
        "Atlas Graph Runtime Candidate",

      headline:
        "Robotics Research Engineer",

      primaryDomain:
        "Robotics",

      secondaryDomains: [
        "AI / ML",
      ],

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
          owner:
            "atlas",
          description:
            "Robotics runtime fixture.",
          languages: [
            "Python",
            "C++",
          ],
          technologies: [
            "ROS2",
            "PyTorch",
          ],
          contributions:
            42,
        },
      ],

      publications: [
        {
          title:
            "Embodied AI Runtime Systems",
          venue:
            "Robotics Conference",
          year:
            2025,
          url:
            "https://example.com/publication/embodied-ai-runtime",
          researchAreas: [
            "Embodied AI",
            "Robotics",
          ],
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
          paperTitle:
            "Embodied AI Runtime Systems",
          url:
            "https://example.com/icra",
        },
      ],

      evidence: [],

      approvalStatus:
        "Unreviewed",
    } as TechnicalTalentDiscoveryRecord;

  const graph =
    buildTechnicalTalentGraph(
      candidate,
    );

  console.log(
    "\n===== GRAPH RESULT =====",
  );

  console.log(
    "NODES:",
    graph.nodes.length,
  );

  console.log(
    "EDGES:",
    graph.edges.length,
  );

  console.log(
    "NODE TYPES:",
    Array.from(
      new Set(
        graph.nodes.map(
          (node) =>
            node.type,
        ),
      ),
    ),
  );

  console.log(
    "RELATIONSHIPS:",
    Array.from(
      new Set(
        graph.edges.map(
          (edge) =>
            edge.relationship,
        ),
      ),
    ),
  );

  assert(
    graph.nodes.length > 0,
    "Graph contains no nodes.",
  );

  assert(
    graph.edges.length > 0,
    "Graph contains no edges.",
  );

  const candidateNode =
    graph.nodes.find(
      (node) =>
        node.id ===
        "candidate:candidate:graph-runtime",
    );

  assert(
    candidateNode,
    "Candidate node was not created.",
  );

  const skillNode =
    graph.nodes.find(
      (node) =>
        node.type === "skill" &&
        node.label ===
          "Computer Vision",
    );

  assert(
    skillNode,
    "Computer Vision skill node was not created.",
  );

  const technologyNode =
    graph.nodes.find(
      (node) =>
        node.type === "technology" &&
        node.label ===
          "PyTorch",
    );

  assert(
    technologyNode,
    "PyTorch technology node was not created.",
  );

  const repositoryNode =
    graph.nodes.find(
      (node) =>
        node.type === "repository" &&
        node.label ===
          "atlas/robotics-runtime",
    );

  assert(
    repositoryNode,
    "Repository node was not created.",
  );

  const publicationNode =
    graph.nodes.find(
      (node) =>
        node.type === "publication" &&
        node.label ===
          "Embodied AI Runtime Systems",
    );

  assert(
    publicationNode,
    "Publication node was not created.",
  );

  const researchAreaNode =
    graph.nodes.find(
      (node) =>
        node.type === "researchArea" &&
        node.label ===
          "Embodied AI",
    );

  assert(
    researchAreaNode,
    "Research-area node was not created.",
  );

  const conferenceNode =
    graph.nodes.find(
      (node) =>
        node.type === "conference" &&
        node.label ===
          "ICRA",
    );

  assert(
    conferenceNode,
    "Conference node was not created.",
  );

  assert(
    graph.edges.some(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          skillNode.id &&
        edge.relationship ===
          "demonstrates",
    ),
    "Candidate → skill relationship was not created.",
  );

  assert(
    graph.edges.some(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          technologyNode.id &&
        edge.relationship ===
          "uses",
    ),
    "Candidate → technology relationship was not created.",
  );

  assert(
    graph.edges.some(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          repositoryNode.id &&
        edge.relationship ===
          "contributes_to",
    ),
    "Candidate → repository relationship was not created.",
  );

  assert(
    graph.edges.some(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          publicationNode.id &&
        edge.relationship ===
          "authored",
    ),
    "Candidate → publication relationship was not created.",
  );

  assert(
    graph.edges.some(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          researchAreaNode.id &&
        edge.relationship ===
          "researches",
    ),
    "Candidate → research-area relationship was not created.",
  );

  assert(
    graph.edges.some(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          conferenceNode.id &&
        edge.relationship ===
          "participates_in",
    ),
    "Candidate → conference relationship was not created.",
  );

  const duplicateCandidateSkillEdges =
    graph.edges.filter(
      (edge) =>
        edge.from ===
          candidateNode.id &&
        edge.to ===
          skillNode.id &&
        edge.relationship ===
          "demonstrates",
    );

  assert(
    duplicateCandidateSkillEdges.length ===
      1,
    "Duplicate candidate → skill edges were created.",
  );

  console.log(
    "\n===== FIRST 10 NODES =====",
  );

  graph.nodes
    .slice(0, 10)
    .forEach(
      (node) => {
        console.log(
          `- ${node.type} | ${node.label} | ${node.id}`,
        );
      },
    );

  console.log(
    "\n===== FIRST 10 EDGES =====",
  );

  graph.edges
    .slice(0, 10)
    .forEach(
      (edge) => {
        console.log(
          `- ${edge.relationship} | ${edge.from} -> ${edge.to}`,
        );
      },
    );

  console.log(
    "\n✅ TECHNICAL TALENT GRAPH TEST PASSED",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ TECHNICAL TALENT GRAPH TEST FAILED",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);
