import { RecruiterKnowledgeTopic } from "../types";

export const rackDensityKnowledge: RecruiterKnowledgeTopic = {
  id: "rack-density",
  title: "High Density Racks",
  category: "AI Infrastructure",

  summary:
    "AI racks commonly exceed 50-150kW per rack, requiring specialized power and cooling infrastructure.",

  whyItMatters: [
    "Changes facility design.",
    "Drives liquid cooling adoption."
  ],

  keyConcepts: [
    "Rack Power",
    "Power Density",
    "Cooling Density"
  ],

  majorVendors: [
    "Vertiv",
    "Schneider Electric"
  ],

  majorProducts: [
    "AI Rack Solutions"
  ],

  usedByCompanies: [
    "OpenAI",
    "Meta",
    "xAI"
  ],

  relatedRoles: [
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "Liquid Cooling",
    "Power Distribution"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "Why are AI racks higher density?"
  ],

  recruiterTips: [
    "Search high-density data center projects."
  ],

  booleanKeywords: [
    "\"High Density Rack\"",
    "\"AI Rack\""
  ],

  aiPrompt:
    "Find engineers supporting high-density AI infrastructure.",

  relatedTopics: [
    "liquid-cooling"
  ]
};