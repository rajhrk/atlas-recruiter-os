import { RecruiterKnowledgeTopic } from "../types";

export const dwdmKnowledge: RecruiterKnowledgeTopic = {
  id: "dwdm",
  title: "Dense Wavelength Division Multiplexing (DWDM)",
  category: "Network Infrastructure",

  summary:
    "DWDM enables multiple optical signals to travel over a single fiber, dramatically increasing long-distance network capacity.",

  whyItMatters: [
    "Supports high-capacity backbone links.",
    "Reduces fiber requirements."
  ],

  keyConcepts: [
    "Optical Channels",
    "Wavelength",
    "Amplifiers"
  ],

  majorVendors: [
    "Ciena",
    "Nokia",
    "Infinera"
  ],

  majorProducts: [
    "WaveLogic",
    "1830 PSS"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Optical Network Engineer"
  ],

  relatedSkills: [
    "Fiber Optics"
  ],

  relatedCertifications: [
    "CCNP"
  ],

  relatedConferences: [
    "OFC"
  ],

  interviewQuestions: [
    "What is DWDM?"
  ],

  recruiterTips: [
    "Search Ciena and Nokia optical networking."
  ],

  booleanKeywords: [
    "DWDM",
    "Ciena",
    "Infinera"
  ],

  aiPrompt:
    "Find Optical Network Engineers with DWDM deployment experience.",

  relatedTopics: [
    "fiber-optics"
  ]
};