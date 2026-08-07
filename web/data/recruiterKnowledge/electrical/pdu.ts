import { RecruiterKnowledgeTopic } from "../types";

export const pduKnowledge: RecruiterKnowledgeTopic = {
  id: "pdu",

  title: "Power Distribution Units (PDU)",

  category: "Electrical Systems",

  summary:
    "Power Distribution Units (PDUs) distribute electrical power from UPS systems to IT equipment while providing monitoring, protection and redundancy within data center environments.",

  whyItMatters: [
    "Distributes power to critical IT equipment.",
    "Supports rack-level monitoring.",
    "Essential for power redundancy.",
    "Enables high-density deployments."
  ],

  keyConcepts: [
    "Rack PDU",
    "Floor PDU",
    "Metered PDU",
    "Switched PDU",
    "Branch Circuit Monitoring"
  ],

  majorVendors: [
    "Schneider Electric",
    "Vertiv",
    "Raritan",
    "Server Technology"
  ],

  majorProducts: [
    "APC Rack PDU",
    "Geist PDU",
    "PX Intelligent PDU",
    "Server Technology PRO2"
  ],

  usedByCompanies: [
    "AWS",
    "Google",
    "Microsoft",
    "Meta",
    "Digital Realty"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Data Center Technician",
    "Electrical Engineer"
  ],

  relatedSkills: [
    "UPS",
    "Busway",
    "Power Distribution",
    "Rack Infrastructure"
  ],

  relatedCertifications: [
    "CDCS",
    "CDCP"
  ],

  relatedConferences: [
    "DCD Connect",
    "Data Centre World"
  ],

  interviewQuestions: [
    "What is a PDU?",
    "Difference between metered and switched PDUs?",
    "Why is rack-level monitoring important?",
    "How are PDUs connected to UPS systems?"
  ],

  recruiterTips: [
    "Look for rack infrastructure experience.",
    "Search APC, Vertiv, Raritan and Geist experience.",
    "Prioritize candidates from hyperscale environments."
  ],

  booleanKeywords: [
    "PDU",
    "\"Power Distribution Unit\"",
    "\"Rack PDU\"",
    "APC",
    "Vertiv"
  ],

  aiPrompt:
    "Find Critical Facilities Engineers with intelligent PDU deployment and rack power distribution experience.",

  relatedTopics: [
    "ups",
    "busway",
    "switchgear"
  ]
};