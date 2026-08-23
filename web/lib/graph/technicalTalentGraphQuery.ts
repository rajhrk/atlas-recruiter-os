import type {
  AtlasGraph,
  GraphEdge,
  GraphNode,
} from "@/types/graph";

export interface TechnicalTalentGraphQuery {
  skills?: string[];
  technologies?: string[];
  researchAreas?: string[];
  repositories?: string[];
  publications?: string[];
  conferences?: string[];
  relationships?: string[];

  minimumMatches?: number;

  /**
   * Maximum number of ranked candidates returned.
   */
  limit?: number;
}

export interface TechnicalTalentGraphMatchPath {
  candidateId: string;
  candidateLabel: string;
  nodeId: string;
  nodeType: GraphNode["type"];
  nodeLabel: string;
  relationship: string;
}

export interface TechnicalTalentGraphQueryResult {
  candidateId: string;
  candidateLabel: string;
  matchCount: number;
  score: number;
  paths: TechnicalTalentGraphMatchPath[];
}

/**
 * Normalize a graph query value for deterministic matching.
 */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase();
}

/**
 * Return true when a graph node matches a requested label.
 *
 * Matching is intentionally exact after normalization.
 * This keeps the first graph-query layer deterministic and
 * prevents fuzzy matching from hiding incorrect graph links.
 */
function nodeMatches(
  node: GraphNode,
  requested: string,
): boolean {
  return (
    normalize(node.label) ===
    normalize(requested)
  );
}

/**
 * Return the graph node IDs requested by the query.
 */
function requestedValues(
  query: TechnicalTalentGraphQuery,
): Array<{
  type: GraphNode["type"];
  values: string[];
}> {
  return [
    {
      type: "skill",
      values: query.skills ?? [],
    },
    {
      type: "technology",
      values:
        query.technologies ?? [],
    },
    {
      type: "researchArea",
      values:
        query.researchAreas ?? [],
    },
    {
      type: "repository",
      values:
        query.repositories ?? [],
    },
    {
      type: "publication",
      values:
        query.publications ?? [],
    },
    {
      type: "conference",
      values:
        query.conferences ?? [],
    },
  ];
}

/**
 * Find candidate nodes connected to graph attributes
 * requested by the recruiter.
 *
 * The result includes the explicit graph path so Atlas can
 * explain why a candidate matched.
 */
export function queryTechnicalTalentGraph(
  graph: AtlasGraph,
  query: TechnicalTalentGraphQuery,
): TechnicalTalentGraphQueryResult[] {
  const candidateNodes =
    graph.nodes.filter(
      (node) =>
        node.type === "candidate",
    );

  const requested =
    requestedValues(query);

  const relationshipFilter =
    new Set(
      (query.relationships ?? [])
        .map(normalize),
    );

  const minimumMatches =
    Math.max(
      1,
      query.minimumMatches ?? 1,
    );

  const results: TechnicalTalentGraphQueryResult[] =
    [];

  for (
    const candidate of candidateNodes
  ) {
    const candidateEdges =
      graph.edges.filter(
        (edge) =>
          edge.from ===
          candidate.id &&
          (
            relationshipFilter.size === 0 ||
            relationshipFilter.has(
              normalize(
                edge.relationship,
              ),
            )
          ),
      );

    const paths: TechnicalTalentGraphMatchPath[] =
      [];

    for (
      const requestedGroup of requested
    ) {
      for (
        const requestedValue of
          requestedGroup.values
      ) {
        const matchedEdges =
          candidateEdges.filter(
            (edge) => {
              const target =
                graph.nodes.find(
                  (node) =>
                    node.id ===
                    edge.to,
                );

              return (
                !!target &&
                target.type ===
                  requestedGroup.type &&
                nodeMatches(
                  target,
                  requestedValue,
                )
              );
            },
          );

        for (
          const edge of matchedEdges
        ) {
          const target =
            graph.nodes.find(
              (node) =>
                node.id === edge.to,
            );

          if (!target) continue;

          const duplicate =
            paths.some(
              (path) =>
                path.nodeId ===
                  target.id &&
                path.relationship ===
                  edge.relationship,
            );

          if (duplicate) continue;

          paths.push({
            candidateId:
              candidate.id,
            candidateLabel:
              candidate.label,
            nodeId:
              target.id,
            nodeType:
              target.type,
            nodeLabel:
              target.label,
            relationship:
              edge.relationship,
          });
        }
      }
    }

    if (
      paths.length <
      minimumMatches
    ) {
      continue;
    }

    const requestedCount =
      requested.reduce(
        (total, group) =>
          total +
          group.values.length,
        0,
      );

    const score =
      requestedCount === 0
        ? 0
        : Math.round(
            Math.min(
              100,
              (paths.length /
                requestedCount) *
                100,
            ),
          );

    results.push({
      candidateId:
        candidate.id,
      candidateLabel:
        candidate.label,
      matchCount:
        paths.length,
      score,
      paths,
    });
  }

  const rankedResults =
    results.sort(
      (a, b) =>
        b.score - a.score ||
        b.matchCount -
          a.matchCount ||
        a.candidateLabel.localeCompare(
          b.candidateLabel,
        ),
    );

  if (
    typeof query.limit === "number" &&
    query.limit > 0
  ) {
    return rankedResults.slice(
      0,
      Math.floor(query.limit),
    );
  }

  return rankedResults;
}
