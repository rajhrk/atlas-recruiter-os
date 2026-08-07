import { RecruiterKnowledgeTopic } from "../types";

export const cracKnowledge: RecruiterKnowledgeTopic = {
  id: "crac",
  title: "Computer Room Air Conditioning (CRAC)",
  category: "Cooling Systems",

  summary:
    "CRAC units cool data centers using refrigerant-based direct expansion (DX) systems. They regulate temperature and humidity to keep IT equipment operating safely.",

  whyItMatters: [
    "Maintains server operating temperatures.",
    "Controls humidity.",
    "Prevents equipment overheating.",
    "Common in enterprise and colocation data centers."
  ],

  keyConcepts: [
    "DX Cooling",
    "Compressor",
    "Evaporator Coil",
    "Humidity Control",
    "Airflow Management"
  ],

  majorVendors: [
    "Vertiv",
    "Stulz",
    "Schneider Electric",
    "Huawei"
  ],

  majorProducts: [
    "Liebert DSE",
    "CyberAir",
    "Uniflair",
    "FusionCool"
  ],

  usedByCompanies: [
    "Equinix",
    "Digital Realty",
    "NTT",
    "STT GDC"
  ],

  relatedRoles: [
    "Mechanical Engineer",
    "Critical Facilities Engineer",
    "HVAC Engineer"
  ],

  relatedSkills: [
    "HVAC",
    "Cooling Systems",
    "Mechanical"
  ],

  relatedCertifications: [
    "CDCS",
    "ATD"
  ],

  relatedConferences: [
    "Data Centre World",
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is a CRAC unit?",
    "Difference between CRAC and CRAH?",
    "How does DX cooling work?",
    "Why is humidity control important?"
  ],

  recruiterTips: [
    "Look for Vertiv, Stulz and Schneider experience.",
    "Search HVAC commissioning.",
    "Prioritize mission-critical cooling experience."
  ],

  booleanKeywords: [
    "CRAC",
    "\"Computer Room Air Conditioning\"",
    "\"DX Cooling\"",
    "Liebert",
    "Stulz"
  ],

  aiPrompt:
    "Find Mechanical Engineers with CRAC installation and commissioning experience in hyperscale or colocation data centers.",

  relatedTopics: [
    "crah",
    "chillers",
    "hvac"
  ]
};