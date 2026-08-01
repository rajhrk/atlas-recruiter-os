export type GraphNodeType =
  | "company"
  | "role"
  | "skill"
  | "certification"
  | "vendor"
  | "technology"
  | "region";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface AtlasGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}