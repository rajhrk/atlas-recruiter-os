import { RecruiterKnowledgeTopic } from "../types";

export const generatorKnowledge: RecruiterKnowledgeTopic = {
  id: "generator",

  title: "Diesel Generator Systems",

  category: "Electrical Systems",

  summary:
    "Diesel generators provide emergency backup power to data centers during utility outages. They ensure continuous operation until normal power is restored.",

  whyItMatters: [
    "Provides backup power during utility failures.",
    "Supports business continuity.",
    "Critical for Tier III and Tier IV data centers.",
    "Works together with UPS systems."
  ],

  keyConcepts: [
    "Standby Generator",
    "Prime Power",
    "Automatic Transfer Switch (ATS)",
    "Fuel Systems",
    "Load Bank Testing"
  ],

  majorVendors: [
    "Cummins",
    "Caterpillar",
    "Rolls-Royce MTU",
    "Kohler"
  ],

  majorProducts: [
    "Cummins QSK Series",
    "CAT 3516",
    "MTU Series 4000",
    "Kohler KD Series"
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
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "Generator Systems",
    "UPS",
    "ATS",
    "Switchgear"
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
    "How does a diesel generator start after a power failure?",
    "What is an Automatic Transfer Switch (ATS)?",
    "Why is load bank testing performed?",
    "What is generator redundancy?"
  ],

  recruiterTips: [
    "Look for generator commissioning experience.",
    "Search candidates with Cummins, CAT or MTU experience.",
    "Prioritise engineers with UPS and ATS knowledge."
  ],

  booleanKeywords: [
    "Generator",
    "\"Diesel Generator\"",
    "Cummins",
    "Caterpillar",
    "MTU",
    "\"Critical Facilities\""
  ],

  aiPrompt:
    "Find Critical Facilities Engineers with diesel generator commissioning and maintenance experience in hyperscale data centers.",

  relatedTopics: [
    "ups",
    "ats",
    "switchgear"
  ]
};