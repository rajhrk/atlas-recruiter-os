import { RecruiterKnowledgeTopic } from "../types";

export const pumpsKnowledge: RecruiterKnowledgeTopic = {
  id: "pumps",
  title: "Pump Systems",
  category: "Cooling Systems",

  summary:
    "Pump systems circulate chilled water and condenser water throughout cooling infrastructure.",

  whyItMatters: [
    "Maintains cooling flow.",
    "Supports redundancy.",
    "Critical for chilled water systems."
  ],

  keyConcepts: [
    "Primary Pumps",
    "Secondary Pumps",
    "VFD",
    "Flow Rate"
  ],

  majorVendors: [
    "Grundfos",
    "Armstrong",
    "Bell & Gossett"
  ],

  majorProducts: [
    "CR Series",
    "Design Envelope",
    "e-1510"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Mechanical Engineer"
  ],

  relatedSkills: [
    "HVAC",
    "Chilled Water"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "Data Centre World"
  ],

  interviewQuestions: [
    "Why are VFD pumps used?",
    "Difference between primary and secondary pumps?"
  ],

  recruiterTips: [
    "Search chilled water pumping systems."
  ],

  booleanKeywords: [
    "Pump",
    "Grundfos",
    "VFD"
  ],

  aiPrompt:
    "Find Mechanical Engineers experienced with chilled water pump systems.",

  relatedTopics: [
    "chillers"
  ]
};