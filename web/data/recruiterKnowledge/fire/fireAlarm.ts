import { RecruiterKnowledgeTopic } from "../types";

export const fireAlarmKnowledge: RecruiterKnowledgeTopic = {
  id: "fire-alarm",
  title: "Fire Alarm Systems",
  category: "Fire & Life Safety",

  summary:
    "Fire alarm systems coordinate fire detection, occupant notification and integration with suppression systems.",

  whyItMatters: [
    "Protects personnel.",
    "Integrates with suppression systems.",
    "Required by safety regulations."
  ],

  keyConcepts: [
    "Alarm Panels",
    "Notification",
    "Detection",
    "Addressable Systems"
  ],

  majorVendors: [
    "Notifier",
    "Siemens",
    "Edwards"
  ],

  majorProducts: [
    "Notifier ONYX",
    "Cerberus PRO"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft"
  ],

  relatedRoles: [
    "Fire Protection Engineer"
  ],

  relatedSkills: [
    "Life Safety"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "Data Centre World"
  ],

  interviewQuestions: [
    "How do addressable fire alarm systems work?"
  ],

  recruiterTips: [
    "Search Notifier and Siemens experience."
  ],

  booleanKeywords: [
    "\"Fire Alarm\"",
    "Notifier",
    "Cerberus"
  ],

  aiPrompt:
    "Find Fire Protection Engineers with addressable fire alarm experience.",

  relatedTopics: [
    "vesda",
    "fm200"
  ]
};