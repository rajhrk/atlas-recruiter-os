import { RecruiterKnowledgeTopic } from "../types";

export const satKnowledge: RecruiterKnowledgeTopic = {
  id: "sat",
  title: "Site Acceptance Test (SAT)",
  category: "Construction & Commissioning",

  summary:
    "SAT validates installed equipment after delivery and installation at the project site.",

  whyItMatters: [
    "Verifies site installation.",
    "Ensures operational readiness."
  ],

  keyConcepts: [
    "Site Testing",
    "Commissioning",
    "Verification"
  ],

  majorVendors: [
    "Schneider Electric",
    "Vertiv"
  ],

  majorProducts: [
    "SAT Procedures"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft"
  ],

  relatedRoles: [
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "FAT",
    "IST"
  ],

  relatedCertifications: [
    "ATD"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "Difference between FAT and SAT?"
  ],

  recruiterTips: [
    "Search SAT execution."
  ],

  booleanKeywords: [
    "SAT",
    "\"Site Acceptance Test\""
  ],

  aiPrompt:
    "Find Commissioning Engineers with SAT execution experience.",

  relatedTopics: [
    "fat",
    "ist"
  ]
};