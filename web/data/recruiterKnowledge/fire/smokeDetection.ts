import { RecruiterKnowledgeTopic } from "../types";

export const smokeDetectionKnowledge: RecruiterKnowledgeTopic = {
  id: "smoke-detection",
  title: "Smoke Detection Systems",
  category: "Fire & Life Safety",

  summary:
    "Smoke detection systems identify fire conditions and initiate alarms before significant damage occurs.",

  whyItMatters: [
    "Early fire detection.",
    "Supports VESDA.",
    "Protects personnel and infrastructure."
  ],

  keyConcepts: [
    "Photoelectric",
    "Ionization",
    "Addressable Detection"
  ],

  majorVendors: [
    "Honeywell",
    "Notifier",
    "Siemens"
  ],

  majorProducts: [
    "Addressable Smoke Detectors"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Meta"
  ],

  relatedRoles: [
    "Fire Protection Engineer"
  ],

  relatedSkills: [
    "Fire Detection"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "Data Centre World"
  ],

  interviewQuestions: [
    "Difference between smoke detector technologies?"
  ],

  recruiterTips: [
    "Search fire detection systems."
  ],

  booleanKeywords: [
    "\"Smoke Detection\"",
    "\"Addressable Detector\""
  ],

  aiPrompt:
    "Find Engineers experienced with smoke detection systems in mission critical facilities.",

  relatedTopics: [
    "vesda",
    "fire-alarm"
  ]
};