import { RecruiterKnowledgeTopic } from "../types";

export const fatKnowledge: RecruiterKnowledgeTopic = {
  id: "fat",
  title: "Factory Acceptance Test (FAT)",
  category: "Construction & Commissioning",

  summary:
    "FAT verifies equipment performance at the manufacturer's facility before shipment.",

  whyItMatters: [
    "Identifies issues early.",
    "Reduces site delays."
  ],

  keyConcepts: [
    "Factory Testing",
    "Witness Testing",
    "Inspection"
  ],

  majorVendors: [
    "Schneider Electric",
    "Vertiv",
    "ABB"
  ],

  majorProducts: [
    "FAT Procedures"
  ],

  usedByCompanies: [
    "AWS",
    "Google"
  ],

  relatedRoles: [
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "Commissioning"
  ],

  relatedCertifications: [
    "ATD"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is FAT?"
  ],

  recruiterTips: [
    "Look for FAT witness experience."
  ],

  booleanKeywords: [
    "FAT",
    "\"Factory Acceptance Test\""
  ],

  aiPrompt:
    "Find Commissioning Engineers experienced with FAT.",

  relatedTopics: [
    "sat",
    "commissioning"
  ]
};