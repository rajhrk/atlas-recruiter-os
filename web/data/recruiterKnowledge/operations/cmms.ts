import { RecruiterKnowledgeTopic } from "../types";

export const cmmsKnowledge: RecruiterKnowledgeTopic = {
  id: "cmms",
  title: "Computerized Maintenance Management System (CMMS)",
  category: "Operations",

  summary:
    "CMMS software manages preventive maintenance, work orders, asset history and maintenance planning for critical infrastructure.",

  whyItMatters: [
    "Improves maintenance planning.",
    "Reduces equipment downtime.",
    "Tracks maintenance history.",
    "Supports compliance."
  ],

  keyConcepts: [
    "Preventive Maintenance",
    "Work Orders",
    "Asset History",
    "Maintenance Scheduling"
  ],

  majorVendors: [
    "IBM",
    "UpKeep",
    "Fiix",
    "eMaint"
  ],

  majorProducts: [
    "Maximo",
    "UpKeep",
    "Fiix",
    "eMaint CMMS"
  ],

  usedByCompanies: [
    "Equinix",
    "Digital Realty",
    "NTT"
  ],

  relatedRoles: [
    "Facilities Engineer",
    "Maintenance Planner"
  ],

  relatedSkills: [
    "Asset Management",
    "Maintenance"
  ],

  relatedCertifications: [
    "CDCS"
  ],

  relatedConferences: [
    "Data Centre World"
  ],

  interviewQuestions: [
    "What is CMMS?",
    "Benefits of preventive maintenance?"
  ],

  recruiterTips: [
    "Search IBM Maximo experience."
  ],

  booleanKeywords: [
    "CMMS",
    "Maximo",
    "Fiix"
  ],

  aiPrompt:
    "Find Facilities Engineers experienced with CMMS and preventive maintenance systems.",

  relatedTopics: [
    "dcim"
  ]
};