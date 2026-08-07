import { RecruiterKnowledgeTopic } from "../types";

export const iso27001Knowledge = {
  id: "iso27001",
  title: "ISO 27001",
  category: "Security & Compliance",

  summary:
    "ISO 27001 is the international standard for information security management systems (ISMS).",

  whyItMatters: [
    "Protects information assets.",
    "Supports enterprise compliance."
  ],

  keyConcepts: [
    "ISMS",
    "Risk Assessment",
    "Controls"
  ],

  majorVendors: [
    "ISO"
  ],

  majorProducts: [
    "ISO 27001"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google"
  ],

  relatedRoles: [
    "Compliance Manager"
  ],

  relatedSkills: [
    "Information Security"
  ],

  relatedCertifications: [
    "ISO 27001 Lead Implementer"
  ],

  relatedConferences: [
    "RSA Conference"
  ],

  interviewQuestions: [
    "What is ISO 27001?"
  ],

  recruiterTips: [
    "Search ISMS implementation."
  ],

  booleanKeywords: [
    "\"ISO 27001\"",
    "ISMS"
  ],

  aiPrompt:
    "Find Information Security professionals with ISO 27001 implementation experience.",

  relatedTopics: [
    "zero-trust"
  ]
} satisfies RecruiterKnowledgeTopic;