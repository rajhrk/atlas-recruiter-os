import { RecruiterKnowledgeTopic } from "../types";

export const cctvKnowledge: RecruiterKnowledgeTopic = {
  id: "cctv",
  title: "CCTV Systems",
  category: "Security & Compliance",

  summary:
    "CCTV systems provide continuous video surveillance for mission critical facilities.",

  whyItMatters: [
    "Supports investigations.",
    "Deters unauthorized access."
  ],

  keyConcepts: [
    "IP Cameras",
    "Video Analytics",
    "NVR"
  ],

  majorVendors: [
    "Axis",
    "Bosch",
    "Hanwha Vision"
  ],

  majorProducts: [
    "Axis Camera Station"
  ],

  usedByCompanies: [
    "AWS",
    "Meta"
  ],

  relatedRoles: [
    "Security Engineer"
  ],

  relatedSkills: [
    "Video Surveillance"
  ],

  relatedCertifications: [
    "CPP"
  ],

  relatedConferences: [
    "ISC West"
  ],

  interviewQuestions: [
    "What is IP video surveillance?"
  ],

  recruiterTips: [
    "Search Axis and Genetec."
  ],

  booleanKeywords: [
    "CCTV",
    "\"Video Surveillance\""
  ],

  aiPrompt:
    "Find Security Engineers with enterprise CCTV deployment experience.",

  relatedTopics: [
    "physical-security"
  ]
};