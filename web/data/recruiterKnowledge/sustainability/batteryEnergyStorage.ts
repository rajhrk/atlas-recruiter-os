import { RecruiterKnowledgeTopic } from "../types";

export const batteryEnergyStorageKnowledge: RecruiterKnowledgeTopic = {
  id: "battery-energy-storage",
  title: "Battery Energy Storage Systems (BESS)",
  category: "Sustainability & Energy",

  summary:
    "Battery Energy Storage Systems store electrical energy for backup power, peak shaving and grid stabilization.",

  whyItMatters: [
    "Supports renewable integration.",
    "Improves energy resilience."
  ],

  keyConcepts: [
    "Lithium-ion",
    "Peak Shaving",
    "Grid Services"
  ],

  majorVendors: [
    "Tesla",
    "Fluence"
  ],

  majorProducts: [
    "Megapack",
    "Gridstack"
  ],

  usedByCompanies: [
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Electrical Engineer"
  ],

  relatedSkills: [
    "Battery Systems"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is BESS?"
  ],

  recruiterTips: [
    "Search grid-scale battery projects."
  ],

  booleanKeywords: [
    "BESS",
    "\"Battery Energy Storage\""
  ],

  aiPrompt:
    "Find Electrical Engineers with BESS deployment experience.",

  relatedTopics: [
    "battery-systems",
    "microgrid"
  ]
};