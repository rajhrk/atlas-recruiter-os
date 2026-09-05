export type GraphNodeType =
  | "company"
  | "role"
  | "skill"
  | "certification"
  | "vendor"
  | "technology"
  | "region"
  | "candidate"
  | "repository"
  | "publication"
  | "researchArea"
  | "conference";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  evidenceIds?: string[];
}

export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
  evidenceIds?: string[];
}

export interface AtlasGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}