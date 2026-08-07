import { RecruiterKnowledgeTopic } from "../types";

export const bmsKnowledge: RecruiterKnowledgeTopic = {
  id: "bms",
  title: "Building Management System (BMS)",
  category: "Operations",

  summary:
    "BMS centrally monitors and controls HVAC, lighting, alarms and mechanical infrastructure throughout a data center.",

  whyItMatters: [
    "Provides centralized facility control.",
    "Optimizes cooling efficiency.",
    "Improves energy management.",
    "Supports predictive maintenance."
  ],

  keyConcepts: [
    "BACnet",
    "HVAC Controls",
    "Alarm Management",
    "Automation",
    "Energy Management"
  ],

  majorVendors: [
    "Schneider Electric",
    "Honeywell",
    "Siemens",
    "Johnson Controls"
  ],

  majorProducts: [
    "EcoStruxure BMS",
    "Desigo CC",
    "Metasys",
    "EBI"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta"
  ],

  relatedRoles: [
    "Controls Engineer",
    "Mechanical Engineer",
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "HVAC",
    "CRAH",
    "CRAC",
    "Automation"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "Data Centre World"
  ],

  interviewQuestions: [
    "What is BMS?",
    "Difference between BMS and EPMS?",
    "What protocols does BMS use?"
  ],

  recruiterTips: [
    "Search Honeywell and Siemens experience.",
    "Look for HVAC automation projects."
  ],

  booleanKeywords: [
    "BMS",
    "\"Building Management System\"",
    "BACnet",
    "Metasys"
  ],

  aiPrompt:
    "Find Controls Engineers with Building Management System experience in mission critical facilities.",

  relatedTopics: [
    "epms",
    "dcim",
    "hvac"
  ]
};