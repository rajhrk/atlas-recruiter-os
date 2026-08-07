import { RecruiterKnowledgeTopic } from "../types";

export const directToChipCoolingKnowledge: RecruiterKnowledgeTopic = {
  id: "direct-to-chip-cooling",
  title: "Direct-to-Chip Cooling",
  category: "Cooling Systems",

  summary:
    "Direct-to-chip cooling removes heat directly from CPUs and GPUs using liquid cold plates.",

  whyItMatters: [
    "Essential for AI infrastructure.",
    "Supports high-density racks."
  ],

  keyConcepts: [
    "Cold Plates",
    "Coolant Distribution Unit",
    "Liquid Loop"
  ],

  majorVendors: [
    "CoolIT",
    "Vertiv",
    "Schneider Electric"
  ],

  majorProducts: [
    "CDU",
    "Direct Liquid Cooling"
  ],

  usedByCompanies: [
    "Meta",
    "Microsoft",
    "Google"
  ],

  relatedRoles: [
    "Mechanical Engineer",
    "AI Infrastructure Engineer"
  ],

  relatedSkills: [
    "Liquid Cooling",
    "GPU Clusters"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "Why is direct-to-chip cooling used for AI?"
  ],

  recruiterTips: [
    "Search cold plate cooling."
  ],

  booleanKeywords: [
    "\"Direct to Chip\"",
    "CDU",
    "\"Cold Plate\""
  ],

  aiPrompt:
    "Find Engineers with direct-to-chip liquid cooling experience.",

  relatedTopics: [
    "liquid-cooling",
    "gpu-clusters"
  ]
};