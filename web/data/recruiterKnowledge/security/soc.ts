import { RecruiterKnowledgeTopic } from "../types";

export const socKnowledge: RecruiterKnowledgeTopic = {
  id: "soc",
  title: "Security Operations Center (SOC)",
  category: "Security & Compliance",

  summary:
    "A Security Operations Center monitors security events, threats and incidents affecting enterprise infrastructure.",

  whyItMatters: [
    "Improves incident response.",
    "Supports continuous monitoring."
  ],

  keyConcepts: [
    "SIEM",
    "Incident Response",
    "Threat Detection"
  ],

  majorVendors: [
    "Microsoft",
    "Splunk",
    "IBM"
  ],

  majorProducts: [
    "Microsoft Sentinel",
    "Splunk ES",
    "QRadar"
  ],

  usedByCompanies: [
    "Microsoft",
    "Google",
    "AWS"
  ],

  relatedRoles: [
    "SOC Analyst",
    "Security Engineer"
  ],

  relatedSkills: [
    "SIEM"
  ],

  relatedCertifications: [
    "Security+",
    "CISSP"
  ],

  relatedConferences: [
    "Black Hat"
  ],

  interviewQuestions: [
    "What does a SOC do?"
  ],

  recruiterTips: [
    "Search Sentinel and Splunk."
  ],

  booleanKeywords: [
    "SOC",
    "Sentinel",
    "Splunk"
  ],

  aiPrompt:
    "Find SOC Engineers with enterprise monitoring experience.",

  relatedTopics: [
    "zero-trust"
  ]
};