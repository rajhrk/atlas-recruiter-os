import { RecruiterKnowledgeTopic } from "../types";

export const vesdaKnowledge: RecruiterKnowledgeTopic = {
  id: "vesda",
  title: "VESDA (Very Early Smoke Detection Apparatus)",
  category: "Fire & Life Safety",

  summary:
    "VESDA continuously samples air to detect smoke particles before visible smoke develops, providing very early fire detection in data centers.",

  whyItMatters: [
    "Detects fire at the earliest stage.",
    "Protects mission critical equipment.",
    "Reduces false alarms.",
    "Essential for hyperscale facilities."
  ],

  keyConcepts: [
    "Air Sampling",
    "Laser Detection",
    "Detection Zones",
    "Sensitivity Levels"
  ],

  majorVendors: [
    "Xtralis",
    "Honeywell"
  ],

  majorProducts: [
    "VESDA-E VEA",
    "VESDA VLC",
    "VESDA VLF"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Fire Protection Engineer"
  ],

  relatedSkills: [
    "Fire Protection",
    "Life Safety",
    "Monitoring"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "How does VESDA work?",
    "Why use air sampling instead of smoke detectors?"
  ],

  recruiterTips: [
    "Search Xtralis and Honeywell experience."
  ],

  booleanKeywords: [
    "VESDA",
    "Xtralis",
    "\"Air Sampling\""
  ],

  aiPrompt:
    "Find Fire Protection Engineers with VESDA deployment experience in mission critical facilities.",

  relatedTopics: [
    "fire-alarm",
    "fire-suppression"
  ]
};