import { RecruiterKnowledgeTopic } from "../types";

export const fiberOpticsKnowledge: RecruiterKnowledgeTopic = {
  id: "fiber-optics",
  title: "Fiber Optic Infrastructure",
  category: "Network Infrastructure",

  summary:
    "Fiber optic cabling provides high-speed, low-latency connectivity between network devices, data halls and campuses.",

  whyItMatters: [
    "Supports high-bandwidth networking.",
    "Enables long-distance communication.",
    "Critical for AI clusters."
  ],

  keyConcepts: [
    "Single Mode Fiber",
    "Multi Mode Fiber",
    "MPO Connectors",
    "OS2",
    "OM4"
  ],

  majorVendors: [
    "Corning",
    "CommScope",
    "Panduit",
    "Leviton"
  ],

  majorProducts: [
    "EDGE",
    "Pretium",
    "SYSTIMAX"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Meta",
    "Microsoft"
  ],

  relatedRoles: [
    "Network Engineer",
    "Structured Cabling Engineer"
  ],

  relatedSkills: [
    "Structured Cabling",
    "DWDM"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "Difference between OS2 and OM4?",
    "Why use MPO connectors?"
  ],

  recruiterTips: [
    "Search Corning and CommScope experience."
  ],

  booleanKeywords: [
    "\"Fiber Optic\"",
    "Corning",
    "MPO",
    "OS2"
  ],

  aiPrompt:
    "Find Network Engineers with hyperscale fiber optic deployment experience.",

  relatedTopics: [
    "structured-cabling",
    "dwdm"
  ]
};