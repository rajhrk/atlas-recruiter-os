import { RecruiterKnowledgeTopic } from "../types";

export const istKnowledge: RecruiterKnowledgeTopic = {
  id: "ist",
  title: "Integrated Systems Testing (IST)",
  category: "Construction & Commissioning",

  summary:
    "IST validates that all mission critical systems operate together under simulated failure scenarios.",

  whyItMatters: [
    "Final validation before go-live.",
    "Confirms redundancy."
  ],

  keyConcepts: [
    "Failure Simulation",
    "Integrated Testing",
    "Redundancy"
  ],

  majorVendors: [
    "Jacobs",
    "Syska"
  ],

  majorProducts: [
    "IST Scripts"
  ],

  usedByCompanies: [
    "AWS",
    "Meta"
  ],

  relatedRoles: [
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "Commissioning",
    "SAT"
  ],

  relatedCertifications: [
    "ATD"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is IST?"
  ],

  recruiterTips: [
    "Prioritize integrated systems testing."
  ],

  booleanKeywords: [
    "IST",
    "\"Integrated Systems Testing\""
  ],

  aiPrompt:
    "Find Commissioning Engineers with IST experience.",

  relatedTopics: [
    "commissioning",
    "sat"
  ]
};