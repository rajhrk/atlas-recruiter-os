import { RecruiterKnowledgeTopic } from "../types";

export const epmsKnowledge: RecruiterKnowledgeTopic = {
  id: "epms",
  title: "Electrical Power Monitoring System (EPMS)",
  category: "Operations",

  summary:
    "EPMS continuously monitors electrical infrastructure including switchgear, UPS, generators, transformers and PDUs to improve reliability and uptime.",

  whyItMatters: [
    "Provides real-time electrical visibility.",
    "Detects faults before outages occur.",
    "Supports predictive maintenance.",
    "Essential for mission critical operations."
  ],

  keyConcepts: [
    "Power Quality",
    "Breaker Status",
    "Alarm Management",
    "Energy Monitoring",
    "Trending"
  ],

  majorVendors: [
    "Schneider Electric",
    "ABB",
    "Siemens",
    "Eaton"
  ],

  majorProducts: [
    "EcoStruxure Power Monitoring",
    "ABB Ability",
    "Power SCADA",
    "Power Xpert"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Meta",
    "Equinix"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Electrical Engineer",
    "Controls Engineer"
  ],

  relatedSkills: [
    "UPS",
    "Switchgear",
    "SCADA",
    "Power Distribution"
  ],

  relatedCertifications: [
    "CDCS",
    "ATD"
  ],

  relatedConferences: [
    "DCD Connect",
    "Data Centre World"
  ],

  interviewQuestions: [
    "What is EPMS?",
    "Difference between EPMS and BMS?",
    "Which equipment is monitored by EPMS?",
    "Why is power quality monitoring important?"
  ],

  recruiterTips: [
    "Search Schneider EcoStruxure experience.",
    "Look for SCADA integration.",
    "Prioritize electrical monitoring projects."
  ],

  booleanKeywords: [
    "EPMS",
    "\"Electrical Power Monitoring System\"",
    "\"Power Monitoring\"",
    "EcoStruxure"
  ],

  aiPrompt:
    "Find Critical Facilities Engineers experienced with EPMS implementation and electrical monitoring systems.",

  relatedTopics: [
    "scada",
    "bms",
    "ups"
  ]
};