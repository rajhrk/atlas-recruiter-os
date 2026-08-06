import { RecruiterKnowledgeTopic } from "./types";

export const upsKnowledge: RecruiterKnowledgeTopic = {
  id: "ups",

  title: "Uninterruptible Power Supply (UPS)",

  category: "Electrical Systems",

  summary:
    "UPS systems provide uninterrupted power to critical IT equipment during utility power failures and protect data centers from downtime.",

  whyItMatters: [
    "Prevents outages during utility power failures.",
    "Protects servers from voltage fluctuations.",
    "Maintains business continuity.",
    "Essential for Tier III and Tier IV data centers."
  ],

  keyConcepts: [
    "Double Conversion UPS",
    "Battery Backup",
    "Static Bypass",
    "N+1 Redundancy",
    "2N Architecture"
  ],

  majorVendors: [
    "Schneider Electric",
    "Vertiv",
    "Eaton",
    "ABB"
  ],

  majorProducts: [
    "Galaxy VX",
    "Liebert EXL S1",
    "93PM",
    "MegaFlex DPA"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta",
    "Equinix"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Critical Environment Technician",
    "Electrical Engineer"
  ],

  relatedSkills: [
    "UPS",
    "Switchgear",
    "EPMS",
    "Generator Systems"
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
    "Explain how a double conversion UPS works.",
    "What happens when utility power fails?",
    "What is static bypass?",
    "What is N+1 redundancy?"
  ],

  recruiterTips: [
    "Search candidates with Schneider, Vertiv and Eaton experience.",
    "Look for commissioning and operations experience.",
    "Combine UPS with EPMS and Generator keywords."
  ],

  booleanKeywords: [
    "UPS",
    "\"Uninterruptible Power Supply\"",
    "Schneider",
    "Vertiv",
    "Eaton",
    "\"Critical Facilities\""
  ],

  aiPrompt:
    "Find senior Critical Facilities Engineers with UPS commissioning and operations experience in hyperscale data centers.",

  relatedTopics: [
    "generator",
    "switchgear",
    "epms"
  ]
};