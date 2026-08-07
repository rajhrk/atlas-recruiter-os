import { RecruiterKnowledgeTopic } from "../types";

export const transformerKnowledge: RecruiterKnowledgeTopic = {
  id: "transformer",

  title: "Power Transformers",

  category: "Electrical Systems",

  summary:
    "Power transformers step electrical voltage up or down for efficient transmission and distribution throughout a data center campus.",

  whyItMatters: [
    "Delivers utility power safely.",
    "Supports electrical distribution.",
    "Essential for campus-scale data centers.",
    "Works together with switchgear and UPS."
  ],

  keyConcepts: [
    "Step-Up",
    "Step-Down",
    "Oil Filled",
    "Dry Type",
    "Redundancy"
  ],

  majorVendors: [
    "Hitachi Energy",
    "Siemens",
    "Schneider Electric",
    "ABB"
  ],

  majorProducts: [
    "RESIBLOC",
    "TrafoStar",
    "GE Prolec",
    "ABB Dry Type"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta",
    "Oracle"
  ],

  relatedRoles: [
    "Electrical Engineer",
    "Critical Facilities Engineer",
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "Switchgear",
    "UPS",
    "Generator Systems"
  ],

  relatedCertifications: [
    "CDCS",
    "ATD"
  ],

  relatedConferences: [
    "Data Centre World",
    "DCD Connect"
  ],

  interviewQuestions: [
    "What is a power transformer?",
    "Difference between dry type and oil filled transformers?",
    "Why are transformers required in data centers?",
    "How is redundancy implemented?"
  ],

  recruiterTips: [
    "Look for utility and substation experience.",
    "Search transformer commissioning projects.",
    "Prioritize high-voltage electrical experience."
  ],

  booleanKeywords: [
    "Transformer",
    "\"Power Transformer\"",
    "\"Dry Type\"",
    "\"Substation\""
  ],

  aiPrompt:
    "Find Electrical Engineers experienced with transformer installation, commissioning and maintenance in hyperscale data centers.",

  relatedTopics: [
    "switchgear",
    "ups",
    "generator"
  ]
};