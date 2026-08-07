import { RecruiterKnowledgeTopic } from "../types";

export const liquidCoolingKnowledge: RecruiterKnowledgeTopic = {
  id: "liquid-cooling",
  title: "Liquid Cooling",
  category: "AI Infrastructure",

  summary:
    "Liquid cooling removes heat efficiently from high-density AI servers that exceed traditional air cooling capabilities.",

  whyItMatters: [
    "Supports AI workloads.",
    "Improves cooling efficiency.",
    "Enables dense GPU deployments."
  ],

  keyConcepts: [
    "Direct-to-Chip",
    "Cold Plates",
    "Coolant Distribution Units",
    "Immersion Cooling"
  ],

  majorVendors: [
    "Vertiv",
    "CoolIT",
    "Schneider Electric"
  ],

  majorProducts: [
    "CoolChip",
    "CDU"
  ],

  usedByCompanies: [
    "Microsoft",
    "Meta",
    "Google"
  ],

  relatedRoles: [
    "Mechanical Engineer",
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "Cooling",
    "GPU Clusters"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "Why is liquid cooling needed for AI?"
  ],

  recruiterTips: [
    "Search CDU and immersion cooling."
  ],

  booleanKeywords: [
    "\"Liquid Cooling\"",
    "CDU",
    "\"Direct to Chip\""
  ],

  aiPrompt:
    "Find Mechanical Engineers with liquid cooling deployment experience.",

  relatedTopics: [
    "gpu-clusters",
    "rack-density"
  ]
};