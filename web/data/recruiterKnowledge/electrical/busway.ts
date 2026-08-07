import { RecruiterKnowledgeTopic } from "../types";

export const buswayKnowledge: RecruiterKnowledgeTopic = {
  id: "busway",

  title: "Busway Systems",

  category: "Electrical Systems",

  summary:
    "Busway systems distribute electrical power efficiently throughout modern data centers, providing scalable and flexible power delivery to equipment rows and high-density racks.",

  whyItMatters: [
    "Supports high-density AI and hyperscale deployments.",
    "Simplifies power expansion.",
    "Reduces cable congestion.",
    "Improves maintenance and scalability."
  ],

  keyConcepts: [
    "Busbar",
    "Tap-Off Box",
    "Overhead Busway",
    "Power Distribution",
    "Redundancy"
  ],

  majorVendors: [
    "Schneider Electric",
    "Starline",
    "EAE",
    "Siemens"
  ],

  majorProducts: [
    "Starline Track Busway",
    "Canalis",
    "EAE Busbar",
    "Sivacon Busway"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Meta",
    "Equinix"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Electrical Engineer",
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "Power Distribution",
    "PDU",
    "Switchgear",
    "UPS"
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
    "What is a busway system?",
    "Why is busway preferred over traditional cabling?",
    "What is a tap-off box?",
    "How does busway improve scalability?"
  ],

  recruiterTips: [
    "Search Starline, Schneider and EAE experience.",
    "Prioritize candidates with hyperscale power distribution projects.",
    "Look for commissioning experience."
  ],

  booleanKeywords: [
    "Busway",
    "Busbar",
    "\"Power Distribution\"",
    "Starline",
    "Canalis"
  ],

  aiPrompt:
    "Find Electrical Engineers with busway installation and commissioning experience in hyperscale data centers.",

  relatedTopics: [
    "switchgear",
    "pdu",
    "ups"
  ]
};