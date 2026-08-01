import { buildAtlasGraph } from "./graphBuilder";

const graph = buildAtlasGraph();

export function getConnectedNodes(id: string) {
  const connectedEdges = graph.edges.filter(
    (edge) => edge.from === id || edge.to === id
  );

  return connectedEdges.map((edge) => ({
    edge,
    from: graph.nodes.find((node) => node.id === edge.from),
    to: graph.nodes.find((node) => node.id === edge.to),
  }));
}

export function getNode(id: string) {
  return graph.nodes.find((node) => node.id === id);
}