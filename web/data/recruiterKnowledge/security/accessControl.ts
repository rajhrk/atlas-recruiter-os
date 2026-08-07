import { RecruiterKnowledgeTopic } from "../types";

export const accessControlKnowledge: RecruiterKnowledgeTopic = {
  id: "access-control",
  title: "Access Control Systems",
  category: "Security & Compliance",

  summary:
    "Access control systems manage secure entry into data centers using badges, biometrics and authorization policies.",

  whyItMatters: [
    "Restricts unauthorized access.",
    "Provides audit trails.",
    "Supports compliance."
  ],

  keyConcepts: [
    "Badge Readers",
    "Authorization",
    "Identity Management"
  ],

  majorVendors: [
    "LenelS2",
    "HID Global",
    "Honeywell"
  ],

  majorProducts: [
    "OnGuard",
    "HID Signo"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Security Engineer"
  ],

  relatedSkills: [
    "Physical Security"
  ],

  relatedCertifications: [
    "CPP"
  ],

  relatedConferences: [
    "ISC West"
  ],

  interviewQuestions: [
    "What is multi-factor physical access?"
  ],

  recruiterTips: [
    "Search Lenel and HID experience."
  ],

  booleanKeywords: [
    "\"Access Control\"",
    "Lenel",
    "HID"
  ],

  aiPrompt:
    "Find Security Engineers with enterprise access control experience.",

  relatedTopics: [
    "physical-security",
    "biometrics"
  ]
};