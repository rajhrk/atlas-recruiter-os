import { RecruiterKnowledgeTopic } from "../types";

export const pueKnowledge: RecruiterKnowledgeTopic = {
  id: "pue",
  title: "Power Usage Effectiveness (PUE)",
  category: "Sustainability & Energy",

  summary:
    "PUE measures data center energy efficiency by comparing total facility power to IT equipment power.",

  whyItMatters: [
    "Most important efficiency KPI.",
    "Lower PUE means better efficiency.",
    "Widely used by hyperscalers."
  ],

  keyConcepts: [
    "Facility Power",
    "IT Load",
    "Efficiency",
    "Energy Optimization"
  ],

  majorVendors: [
    "Schneider Electric",
    "Vertiv"
  ],

  majorProducts: [
    "EcoStruxure",
    "Trellis"
  ],

  usedByCompanies: [
    "Google",
    "AWS",
    "Meta",
    "Microsoft"
  ],

  relatedRoles: [
    "Energy Engineer",
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "DCIM",
    "Energy Management"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is PUE?",
    "How is PUE calculated?"
  ],

  recruiterTips: [
    "Search PUE optimization projects."
  ],

  booleanKeywords: [
    "PUE",
    "\"Power Usage Effectiveness\""
  ],

  aiPrompt:
    "Find Engineers experienced with PUE optimization in hyperscale data centers.",

  relatedTopics: [
    "cue",
    "energy-efficiency"
  ]
};