import { RecruiterKnowledgeTopic } from "../types";

export const patchPanelsKnowledge: RecruiterKnowledgeTopic = {
  id: "patch-panels",
  title: "Patch Panels",
  category: "Network Infrastructure",

  summary:
    "Patch panels organize and simplify structured network cabling within data centers.",

  whyItMatters: [
    "Improves cable management.",
    "Simplifies maintenance."
  ],

  keyConcepts: [
    "Cable Management",
    "Termination",
    "Cross Connect"
  ],

  majorVendors: [
    "Panduit",
    "CommScope"
  ],

  majorProducts: [
    "QuickNet",
    "PanView"
  ],

  usedByCompanies: [
    "AWS",
    "Meta"
  ],

  relatedRoles: [
    "Structured Cabling Engineer"
  ],

  relatedSkills: [
    "Structured Cabling"
  ],

  relatedCertifications: [
    "BICSI"
  ],

  relatedConferences: [
    "BICSI"
  ],

  interviewQuestions: [
    "Why use patch panels?"
  ],

  recruiterTips: [
    "Search structured cabling."
  ],

  booleanKeywords: [
    "\"Patch Panel\""
  ],

  aiPrompt:
    "Find Structured Cabling Engineers with patch panel installation experience.",

  relatedTopics: [
    "structured-cabling"
  ]
};