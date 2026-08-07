import { RecruiterKnowledgeTopic } from "../types";

export const epoKnowledge: RecruiterKnowledgeTopic = {
  id: "epo",
  title: "Emergency Power Off (EPO)",
  category: "Fire & Life Safety",

  summary:
    "Emergency Power Off systems immediately disconnect electrical power during emergencies to improve personnel safety.",

  whyItMatters: [
    "Protects personnel.",
    "Supports emergency response.",
    "Required by electrical safety standards."
  ],

  keyConcepts: [
    "Emergency Shutdown",
    "Safety Circuits",
    "Power Isolation"
  ],

  majorVendors: [
    "Schneider Electric",
    "ABB"
  ],

  majorProducts: [
    "Emergency Shutdown Panels"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft"
  ],

  relatedRoles: [
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "Electrical Safety"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is an EPO system?"
  ],

  recruiterTips: [
    "Search emergency shutdown experience."
  ],

  booleanKeywords: [
    "EPO",
    "\"Emergency Power Off\""
  ],

  aiPrompt:
    "Find Critical Facilities Engineers experienced with EPO systems.",

  relatedTopics: [
    "ups",
    "switchgear"
  ]
};