import { RecruiterKnowledgeTopic } from "../types";

export const switchgearKnowledge: RecruiterKnowledgeTopic = {
  id: "switchgear",

  title: "Electrical Switchgear",

  category: "Electrical Systems",

  summary:
    "Switchgear controls, protects and isolates electrical equipment in data centers. It distributes electrical power safely throughout the facility.",

  whyItMatters: [
    "Protects electrical infrastructure.",
    "Supports safe maintenance.",
    "Prevents catastrophic failures.",
    "Essential for power distribution."
  ],

  keyConcepts: [
    "MV Switchgear",
    "LV Switchgear",
    "Circuit Breakers",
    "Protection Relays",
    "Arc Flash"
  ],

  majorVendors: [
    "Schneider Electric",
    "ABB",
    "Siemens",
    "Eaton"
  ],

  majorProducts: [
    "SM6",
    "PIX",
    "8DJH",
    "Power Xpert"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Meta",
    "Digital Realty"
  ],

  relatedRoles: [
    "Electrical Engineer",
    "Critical Facilities Engineer",
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "UPS",
    "Transformer",
    "Generator Systems"
  ],

  relatedCertifications: [
    "CDCS",
    "ATD"
  ],

  relatedConferences: [
    "DCD Connect",
    "Data Centre World"
  ],

  interviewQuestions: [
    "What is switchgear?",
    "Difference between MV and LV switchgear?",
    "Explain arc flash.",
    "Why are protection relays important?"
  ],

  recruiterTips: [
    "Search candidates with Schneider, ABB and Siemens experience.",
    "Look for electrical commissioning projects.",
    "Prioritize power distribution experience."
  ],

  booleanKeywords: [
    "Switchgear",
    "\"Medium Voltage\"",
    "\"Low Voltage\"",
    "\"Power Distribution\""
  ],

  aiPrompt:
    "Find engineers experienced in MV/LV switchgear commissioning and maintenance in hyperscale data centers.",

  relatedTopics: [
    "ups",
    "generator",
    "transformer"
  ]
};