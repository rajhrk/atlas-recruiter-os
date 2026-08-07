import { RecruiterKnowledgeTopic } from "../types";

export const scadaKnowledge: RecruiterKnowledgeTopic = {
  id: "scada",
  title: "SCADA Systems",
  category: "Operations",

  summary:
    "SCADA systems provide supervisory control and data acquisition for electrical and industrial infrastructure within mission critical facilities.",

  whyItMatters: [
    "Real-time control.",
    "Industrial automation.",
    "Alarm management.",
    "Power infrastructure monitoring."
  ],

  keyConcepts: [
    "PLC",
    "RTU",
    "HMI",
    "Industrial Networks"
  ],

  majorVendors: [
    "ABB",
    "Siemens",
    "Schneider Electric",
    "GE"
  ],

  majorProducts: [
    "Power SCADA",
    "WinCC",
    "Citect",
    "iFIX"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Controls Engineer",
    "Automation Engineer"
  ],

  relatedSkills: [
    "EPMS",
    "PLC",
    "Automation"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is SCADA?",
    "Difference between SCADA and PLC?",
    "What is an HMI?"
  ],

  recruiterTips: [
    "Search Siemens WinCC and ABB experience."
  ],

  booleanKeywords: [
    "SCADA",
    "PLC",
    "WinCC",
    "Citect"
  ],

  aiPrompt:
    "Find Automation Engineers experienced with SCADA systems supporting critical facilities.",

  relatedTopics: [
    "epms",
    "bms"
  ]
};