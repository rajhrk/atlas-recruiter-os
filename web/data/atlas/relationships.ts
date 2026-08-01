import { GraphEdge } from "@/types/graph";

export const graphRelationships: GraphEdge[] = [
  {
    from: "Microsoft",
    to: "Critical Facilities Engineer",
    relationship: "hires",
  },
  {
    from: "Microsoft",
    to: "Mechanical Engineer",
    relationship: "hires",
  },
  {
    from: "Microsoft",
    to: "UPS",
    relationship: "requires",
  },
  {
    from: "Microsoft",
    to: "EPMS",
    relationship: "requires",
  },
  {
    from: "Microsoft",
    to: "CDCP",
    relationship: "prefers",
  },
  {
    from: "Microsoft",
    to: "Singapore",
    relationship: "operates",
  },

  {
    from: "Meta",
    to: "Critical Facilities Engineer",
    relationship: "hires",
  },
  {
    from: "Meta",
    to: "Generator Systems",
    relationship: "requires",
  },
  {
    from: "Meta",
    to: "CDCS",
    relationship: "prefers",
  },

  {
    from: "Google",
    to: "Critical Facilities Engineer",
    relationship: "hires",
  },
  {
    from: "Google",
    to: "UPS",
    relationship: "requires",
  },
  {
    from: "Google",
    to: "Singapore",
    relationship: "operates",
  },
];