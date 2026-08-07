import { RecruiterKnowledgeTopic } from "../types";

export const batterySystemsKnowledge: RecruiterKnowledgeTopic = {
  id: "battery-systems",

  title: "Battery Systems",

  category: "Electrical Systems",

  summary:
    "Battery systems provide immediate backup power to UPS infrastructure during utility outages until standby generators assume the electrical load.",

  whyItMatters: [
    "Provides instant backup power.",
    "Supports uninterrupted IT operations.",
    "Critical component of every UPS system.",
    "Determines runtime during outages."
  ],

  keyConcepts: [
    "VRLA",
    "Lithium-ion",
    "Battery Monitoring System",
    "Runtime",
    "Battery Strings"
  ],

  majorVendors: [
    "EnerSys",
    "East Penn",
    "Saft",
    "Samsung SDI"
  ],

  majorProducts: [
    "DataSafe XE",
    "PowerSafe SBS",
    "Saft Flex'ion",
    "Samsung Lithium Battery"
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
    "Electrical Engineer",
    "Battery Specialist"
  ],

  relatedSkills: [
    "UPS",
    "Battery Monitoring",
    "Power Distribution",
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
    "Difference between VRLA and Lithium-ion batteries?",
    "Why are battery monitoring systems important?",
    "How is UPS runtime calculated?",
    "What causes battery degradation?"
  ],

  recruiterTips: [
    "Search candidates with UPS battery replacement projects.",
    "Look for lithium-ion migration experience.",
    "Prioritize battery monitoring system knowledge."
  ],

  booleanKeywords: [
    "\"Battery System\"",
    "VRLA",
    "\"Lithium Ion\"",
    "\"Battery Monitoring\"",
    "UPS"
  ],

  aiPrompt:
    "Find Critical Facilities Engineers experienced with UPS battery systems, battery monitoring and lithium-ion deployments in hyperscale data centers.",

  relatedTopics: [
    "ups",
    "generator",
    "pdu"
  ]
};