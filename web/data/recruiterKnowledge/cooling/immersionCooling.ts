import { RecruiterKnowledgeTopic } from "../types";

export const immersionCoolingKnowledge: RecruiterKnowledgeTopic = {
  id: "immersion-cooling",
  title: "Immersion Cooling",
  category: "Cooling Systems",

  summary:
    "Immersion cooling submerges servers in dielectric fluid to remove heat efficiently from high-density AI hardware.",

  whyItMatters: [
    "Supports ultra-high-density AI racks.",
    "Reduces cooling energy."
  ],

  keyConcepts: [
    "Dielectric Fluid",
    "Single Phase",
    "Two Phase"
  ],

  majorVendors: [
    "Submer",
    "GRC"
  ],

  majorProducts: [
    "Immersion Tanks"
  ],

  usedByCompanies: [
    "AI Infrastructure Providers"
  ],

  relatedRoles: [
    "Mechanical Engineer"
  ],

  relatedSkills: [
    "Liquid Cooling"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "What is immersion cooling?"
  ],

  recruiterTips: [
    "Search dielectric cooling."
  ],

  booleanKeywords: [
    "\"Immersion Cooling\"",
    "Dielectric"
  ],

  aiPrompt:
    "Find Engineers experienced with immersion cooling technologies.",

  relatedTopics: [
    "liquid-cooling",
    "direct-to-chip-cooling"
  ]
};