import type {
  AtlasGraph,
  GraphEdge,
  GraphNode,
} from "@/types/graph";

import type {
  DiscoveryConferenceSignal,
  DiscoveryPublication,
  DiscoveryRepositorySignal,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function addNode(
  nodes: GraphNode[],
  node: GraphNode,
): void {
  if (
    !nodes.some(
      (existing) =>
        existing.id === node.id &&
        existing.type === node.type,
    )
  ) {
    nodes.push(node);
  }
}

function addEdge(
  edges: GraphEdge[],
  edge: GraphEdge,
): void {
  if (
    !edges.some(
      (existing) =>
        existing.from === edge.from &&
        existing.to === edge.to &&
        existing.relationship ===
          edge.relationship,
    )
  ) {
    edges.push(edge);
  }
}

function normalizeIdPart(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function skillNodeId(
  skillName: string,
): string {
  return `skill:${normalizeIdPart(skillName)}`;
}

function technologyNodeId(
  technologyName: string,
): string {
  return `technology:${normalizeIdPart(technologyName)}`;
}

function repositoryNodeId(
  repository: DiscoveryRepositorySignal,
  index: number,
): string {
  const value =
    repository.url ??
    repository.repository ??
    `repository-${index}`;

  return `repository:${normalizeIdPart(value)}`;
}

function publicationNodeId(
  publication: DiscoveryPublication,
  index: number,
): string {
  const value =
    publication.url ??
    publication.title ??
    `publication-${index}`;

  return `publication:${normalizeIdPart(value)}`;
}

function researchAreaNodeId(
  researchArea: string,
): string {
  return `research-area:${normalizeIdPart(
    researchArea,
  )}`;
}

function conferenceNodeId(
  conference: DiscoveryConferenceSignal,
  index: number,
): string {
  const value =
    conference.name ??
    conference.url ??
    `conference-${index}`;

  return `conference:${normalizeIdPart(value)}`;
}

function repositoryLabel(
  repository: DiscoveryRepositorySignal,
): string {
  return (
    repository.repository ??
    repository.url ??
    "Repository"
  );
}

function publicationLabel(
  publication: DiscoveryPublication,
): string {
  return (
    publication.title ??
    publication.url ??
    "Publication"
  );
}

function conferenceLabel(
  conference: DiscoveryConferenceSignal,
): string {
  return (
    conference.name ??
    conference.url ??
    "Conference"
  );
}

/**
 * Build a graph representation of one technical-talent
 * discovery record.
 *
 * This graph is intentionally candidate-centric.
 *
 * It converts existing normalized technical signals and
 * enrichment evidence into explicit graph relationships
 * without changing the underlying discovery record.
 */
export function buildTechnicalTalentGraph(
  candidate: TechnicalTalentDiscoveryRecord,
): AtlasGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const candidateNodeId =
    `candidate:${candidate.id}`;

  addNode(
    nodes,
    {
      id: candidateNodeId,
      type: "candidate",
      label: candidate.name,
    },
  );

  /*
   * Skills
   */
  for (
    const skill of candidate.skills ?? []
  ) {
    const name =
      skill.name?.trim();

    if (!name) continue;

    const nodeId =
      skillNodeId(name);

    addNode(
      nodes,
      {
        id: nodeId,
        type: "skill",
        label: name,
      },
    );

    addEdge(
      edges,
      {
        from: candidateNodeId,
        to: nodeId,
        relationship:
          "demonstrates",
      },
    );
  }

  /*
   * Technologies
   */
  for (
    const technology of
      candidate.technologies ?? []
  ) {
    const name =
      technology.name?.trim();

    if (!name) continue;

    const nodeId =
      technologyNodeId(name);

    addNode(
      nodes,
      {
        id: nodeId,
        type: "technology",
        label: name,
      },
    );

    addEdge(
      edges,
      {
        from: candidateNodeId,
        to: nodeId,
        relationship:
          "uses",
      },
    );
  }

  /*
   * Repositories
   */
  for (
    const [
      index,
      repository,
    ] of (
      candidate.repositories ??
      []
    ).entries()
  ) {
    const label =
      repositoryLabel(
        repository,
      );

    const nodeId =
      repositoryNodeId(
        repository,
        index,
      );

    addNode(
      nodes,
      {
        id: nodeId,
        type: "repository",
        label,
      },
    );

    addEdge(
      edges,
      {
        from: candidateNodeId,
        to: nodeId,
        relationship:
          "contributes_to",
      },
    );
  }

  /*
   * Publications
   */
  for (
    const [
      index,
      publication,
    ] of (
      candidate.publications ??
      []
    ).entries()
  ) {
    const label =
      publicationLabel(
        publication,
      );

    const nodeId =
      publicationNodeId(
        publication,
        index,
      );

    addNode(
      nodes,
      {
        id: nodeId,
        type: "publication",
        label,
      },
    );

    addEdge(
      edges,
      {
        from: candidateNodeId,
        to: nodeId,
        relationship:
          "authored",
      },
    );
  }

  /*
   * Research areas
   */
  for (
    const researchArea of
      candidate.researchAreas ??
      []
  ) {
    const name =
      researchArea?.trim();

    if (!name) continue;

    const nodeId =
      researchAreaNodeId(
        name,
      );

    addNode(
      nodes,
      {
        id: nodeId,
        type: "researchArea",
        label: name,
      },
    );

    addEdge(
      edges,
      {
        from: candidateNodeId,
        to: nodeId,
        relationship:
          "researches",
      },
    );
  }

  /*
   * Conferences
   */
  for (
    const [
      index,
      conference,
    ] of (
      candidate.conferences ??
      []
    ).entries()
  ) {
    const label =
      conferenceLabel(
        conference,
      );

    const nodeId =
      conferenceNodeId(
        conference,
        index,
      );

    addNode(
      nodes,
      {
        id: nodeId,
        type: "conference",
        label,
      },
    );

    addEdge(
      edges,
      {
        from: candidateNodeId,
        to: nodeId,
        relationship:
          "participates_in",
      },
    );
  }

  return {
    nodes,
    edges,
  };
}
