import { RecruiterKnowledgeTopic } from "../types";

export const structuredCablingKnowledge: RecruiterKnowledgeTopic = {
  id: "structured-cabling",
  title: "Structured Cabling",
  category: "Network Infrastructure",

  summary:
    "Structured cabling provides standardized network infrastructure for servers, storage and networking equipment.",

  whyItMatters: [
    "Simplifies expansion.",
    "Improves reliability.",
    "Supports high-density deployments."
  ],

  keyConcepts: [
    "TIA-942",
    "Cat6A",
    "Fiber Backbone",
    "Rack Cabling"
  ],

  majorVendors: [
    "CommScope",
    "Panduit",
    "Legrand"
  ],

  majorProducts: [
    "SYSTIMAX",
    "PanMPO"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Structured Cabling Engineer"
  ],

  relatedSkills: [
    "Fiber",
    "Patch Panels"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "BICSI",
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is structured cabling?",
    "What is TIA-942?"
  ],

  recruiterTips: [
    "Search BICSI-certified candidates."
  ],

  booleanKeywords: [
    "\"Structured Cabling\"",
    "TIA-942",
    "BICSI"
  ],

  aiPrompt:
    "Find Engineers with structured cabling design experience.",

  relatedTopics: [
    "fiber-optics",
    "patch-panels"
  ]
};