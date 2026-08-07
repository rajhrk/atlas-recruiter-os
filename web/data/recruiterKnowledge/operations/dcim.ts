import { RecruiterKnowledgeTopic } from "../types";

export const dcimKnowledge: RecruiterKnowledgeTopic = {
  id: "dcim",
  title: "Data Center Infrastructure Management (DCIM)",
  category: "Operations",

  summary:
    "DCIM platforms provide centralized visibility into power, cooling, assets, capacity and operational performance across data centers.",

  whyItMatters: [
    "Improves operational efficiency.",
    "Tracks assets and capacity.",
    "Supports planning and reporting.",
    "Reduces downtime."
  ],

  keyConcepts: [
    "Capacity Planning",
    "Asset Tracking",
    "Rack Visualization",
    "Power Monitoring",
    "Cooling Analytics"
  ],

  majorVendors: [
    "Sunbird",
    "Schneider Electric",
    "Nlyte",
    "Vertiv"
  ],

  majorProducts: [
    "dcTrack",
    "EcoStruxure IT",
    "Nlyte",
    "Trellis"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Equinix"
  ],

  relatedRoles: [
    "Data Center Operations Engineer",
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "Asset Management",
    "Capacity Planning",
    "EPMS"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is DCIM?",
    "Benefits of DCIM?",
    "Difference between DCIM and BMS?"
  ],

  recruiterTips: [
    "Search Sunbird and Nlyte.",
    "Look for operations analytics experience."
  ],

  booleanKeywords: [
    "DCIM",
    "\"Data Center Infrastructure Management\"",
    "dcTrack",
    "Nlyte"
  ],

  aiPrompt:
    "Find Operations Engineers with DCIM deployment and optimization experience.",

  relatedTopics: [
    "epms",
    "bms"
  ]
};