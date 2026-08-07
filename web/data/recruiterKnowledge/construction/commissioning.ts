import { RecruiterKnowledgeTopic } from "../types";

export const commissioningKnowledge: RecruiterKnowledgeTopic = {
  id: "commissioning",
  title: "Data Center Commissioning",
  category: "Construction & Commissioning",

  summary:
    "Commissioning verifies that all electrical, mechanical and control systems operate according to design before a data center becomes operational.",

  whyItMatters: [
    "Reduces startup risk.",
    "Validates mission critical systems.",
    "Improves reliability.",
    "Required before handover."
  ],

  keyConcepts: [
    "Level 1-5 Commissioning",
    "Integrated Systems Testing",
    "Functional Testing",
    "Performance Verification"
  ],

  majorVendors: [
    "Jacobs",
    "Syska Hennessy",
    "Hdr",
    "Morrison Hershfield"
  ],

  majorProducts: [
    "Commissioning Plans",
    "Functional Test Scripts"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta",
    "Oracle"
  ],

  relatedRoles: [
    "Commissioning Engineer",
    "Critical Facilities Engineer",
    "QA/QC Engineer"
  ],

  relatedSkills: [
    "FAT",
    "SAT",
    "IST",
    "QA/QC"
  ],

  relatedCertifications: [
    "ATD",
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is commissioning?",
    "Explain Level 1-5 commissioning.",
    "What is Integrated Systems Testing?"
  ],

  recruiterTips: [
    "Look for mission critical commissioning projects.",
    "Prioritize hyperscale experience."
  ],

  booleanKeywords: [
    "Commissioning",
    "\"Mission Critical\"",
    "\"Integrated Systems Testing\""
  ],

  aiPrompt:
    "Find Commissioning Engineers with hyperscale data center experience.",

  relatedTopics: [
    "fat",
    "sat",
    "ist"
  ]
};