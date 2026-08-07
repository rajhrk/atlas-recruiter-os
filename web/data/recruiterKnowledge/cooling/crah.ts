import { RecruiterKnowledgeTopic } from "../types";

export const crahKnowledge: RecruiterKnowledgeTopic = {
  id: "crah",
  title: "Computer Room Air Handler (CRAH)",
  category: "Cooling Systems",

  summary:
    "CRAH units cool data centers using chilled water supplied by central chiller plants rather than refrigerant compressors.",

  whyItMatters: [
    "Higher efficiency than CRAC.",
    "Common in hyperscale facilities.",
    "Supports large cooling loads.",
    "Reduces energy consumption."
  ],

  keyConcepts: [
    "Chilled Water",
    "Cooling Coil",
    "Variable Speed Fans",
    "Airflow",
    "Heat Removal"
  ],

  majorVendors: [
    "Vertiv",
    "Stulz",
    "Schneider Electric"
  ],

  majorProducts: [
    "Liebert CW",
    "CyberAir CW",
    "Uniflair CW"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Meta",
    "Microsoft"
  ],

  relatedRoles: [
    "Mechanical Engineer",
    "HVAC Engineer",
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "Chilled Water",
    "HVAC",
    "Cooling"
  ],

  relatedCertifications: [
    "CDCS",
    "ATD"
  ],

  relatedConferences: [
    "Data Centre World"
  ],

  interviewQuestions: [
    "Difference between CRAH and CRAC?",
    "Why do hyperscalers prefer CRAH?",
    "How does chilled water cooling work?",
    "Explain CRAH redundancy."
  ],

  recruiterTips: [
    "Search chilled water experience.",
    "Look for hyperscale mechanical operations.",
    "Prioritize central plant knowledge."
  ],

  booleanKeywords: [
    "CRAH",
    "\"Computer Room Air Handler\"",
    "\"Chilled Water\""
  ],

  aiPrompt:
    "Find Mechanical Engineers experienced with CRAH systems and chilled water infrastructure.",

  relatedTopics: [
    "crac",
    "chillers"
  ]
};