import { RecruiterKnowledgeTopic } from "../types";

export const chillersKnowledge: RecruiterKnowledgeTopic = {
  id: "chillers",
  title: "Chiller Systems",
  category: "Cooling Systems",

  summary:
    "Chillers remove heat from chilled water loops that supply CRAH units and other cooling infrastructure across large data centers.",

  whyItMatters: [
    "Primary cooling source.",
    "Supports hyperscale campuses.",
    "Improves cooling efficiency.",
    "Critical for uptime."
  ],

  keyConcepts: [
    "Air-Cooled",
    "Water-Cooled",
    "Chilled Water",
    "Compressor",
    "Redundancy"
  ],

  majorVendors: [
    "Trane",
    "Carrier",
    "Daikin",
    "Johnson Controls"
  ],

  majorProducts: [
    "CenTraVac",
    "AquaEdge",
    "Magnitude",
    "YVAA"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Meta"
  ],

  relatedRoles: [
    "Mechanical Engineer",
    "Facilities Engineer"
  ],

  relatedSkills: [
    "HVAC",
    "Cooling",
    "CRAH"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "Difference between air and water cooled chillers?",
    "How does a chilled water loop work?",
    "Why are chillers important?"
  ],

  recruiterTips: [
    "Search Trane, Carrier and Daikin.",
    "Look for chilled water commissioning."
  ],

  booleanKeywords: [
    "Chiller",
    "\"Water Cooled\"",
    "\"Air Cooled\""
  ],

  aiPrompt:
    "Find Mechanical Engineers experienced in hyperscale chiller plants.",

  relatedTopics: [
    "crah",
    "cooling-towers"
  ]
};