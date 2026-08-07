import { RecruiterKnowledgeTopic } from "../types";

export const fireSuppressionKnowledge: RecruiterKnowledgeTopic = {
  id: "fire-suppression",
  title: "Fire Suppression Systems",
  category: "Fire & Life Safety",

  summary:
    "Fire suppression systems extinguish fires while minimizing damage to mission critical infrastructure.",

  whyItMatters: [
    "Protects IT equipment.",
    "Supports business continuity.",
    "Reduces fire damage."
  ],

  keyConcepts: [
    "Clean Agent",
    "Pre-Action",
    "Sprinklers",
    "Gas Suppression"
  ],

  majorVendors: [
    "Kidde",
    "Johnson Controls",
    "Victaulic"
  ],

  majorProducts: [
    "FM-200",
    "Novec 1230"
  ],

  usedByCompanies: [
    "AWS",
    "Google"
  ],

  relatedRoles: [
    "Fire Protection Engineer"
  ],

  relatedSkills: [
    "Life Safety"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What suppression systems are used in data centers?"
  ],

  recruiterTips: [
    "Search clean-agent suppression."
  ],

  booleanKeywords: [
    "\"Fire Suppression\"",
    "\"Novec 1230\"",
    "FM200"
  ],

  aiPrompt:
    "Find Engineers with mission critical fire suppression experience.",

  relatedTopics: [
    "fm200",
    "vesda"
  ]
};