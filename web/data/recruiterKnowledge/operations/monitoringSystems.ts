import { RecruiterKnowledgeTopic } from "../types";

export const monitoringSystemsKnowledge: RecruiterKnowledgeTopic = {
  id: "monitoring-systems",
  title: "Infrastructure Monitoring Systems",
  category: "Operations",

  summary:
    "Infrastructure monitoring systems continuously monitor power, cooling, environmental conditions and alarms across mission critical facilities.",

  whyItMatters: [
    "Improves uptime.",
    "Enables predictive maintenance.",
    "Provides real-time alerts.",
    "Supports operational excellence."
  ],

  keyConcepts: [
    "Dashboards",
    "Alarms",
    "Trending",
    "Environmental Monitoring"
  ],

  majorVendors: [
    "Schneider Electric",
    "Vertiv",
    "Sunbird"
  ],

  majorProducts: [
    "EcoStruxure IT",
    "Environet",
    "dcTrack"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Meta"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Operations Engineer"
  ],

  relatedSkills: [
    "Monitoring",
    "EPMS",
    "BMS"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "DCD Connect"
  ],

  interviewQuestions: [
    "How are alarms prioritized?",
    "Why is trending important?"
  ],

  recruiterTips: [
    "Search EcoStruxure IT and Sunbird."
  ],

  booleanKeywords: [
    "\"Infrastructure Monitoring\"",
    "\"EcoStruxure IT\"",
    "Monitoring"
  ],

  aiPrompt:
    "Find Critical Facilities Engineers experienced with infrastructure monitoring platforms.",

  relatedTopics: [
    "epms",
    "dcim",
    "bms"
  ]
};