import { RecruiterKnowledgeTopic } from "../types";

export const heatExchangersKnowledge: RecruiterKnowledgeTopic = {
  id: "heat-exchangers",
  title: "Heat Exchangers",
  category: "Cooling Systems",

  summary:
    "Heat exchangers transfer heat between cooling loops while keeping fluids isolated, improving efficiency and reliability.",

  whyItMatters: [
    "Improves thermal efficiency.",
    "Separates cooling loops.",
    "Protects critical infrastructure."
  ],

  keyConcepts: [
    "Plate Heat Exchanger",
    "Shell & Tube",
    "Heat Transfer",
    "Closed Loop"
  ],

  majorVendors: [
    "Alfa Laval",
    "SWEP",
    "Kelvion"
  ],

  majorProducts: [
    "AlfaNova",
    "B-Series",
    "Plate Heat Exchanger"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Meta"
  ],

  relatedRoles: [
    "Mechanical Engineer"
  ],

  relatedSkills: [
    "Cooling",
    "Chilled Water"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is a heat exchanger?",
    "Why are plate heat exchangers used?"
  ],

  recruiterTips: [
    "Search Alfa Laval and SWEP experience."
  ],

  booleanKeywords: [
    "\"Heat Exchanger\"",
    "\"Plate Heat Exchanger\"",
    "\"Alfa Laval\""
  ],

  aiPrompt:
    "Find Mechanical Engineers experienced with plate heat exchangers in data center cooling systems.",

  relatedTopics: [
    "chillers",
    "crah"
  ]
};