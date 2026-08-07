import { RecruiterKnowledgeTopic } from "../types";

export const zeroTrustKnowledge: RecruiterKnowledgeTopic = {
  id: "zero-trust",
  title: "Zero Trust Security",
  category: "Security & Compliance",

  summary:
    "Zero Trust assumes no implicit trust and continuously verifies users, devices and workloads before granting access.",

  whyItMatters: [
    "Improves cybersecurity.",
    "Protects cloud and AI infrastructure."
  ],

  keyConcepts: [
    "Least Privilege",
    "Continuous Verification",
    "Identity"
  ],

  majorVendors: [
    "Microsoft",
    "Zscaler",
    "Palo Alto Networks"
  ],

  majorProducts: [
    "Entra ID",
    "ZPA",
    "Prisma Access"
  ],

  usedByCompanies: [
    "Microsoft",
    "Google",
    "AWS"
  ],

  relatedRoles: [
    "Security Architect"
  ],

  relatedSkills: [
    "Identity",
    "SOC"
  ],

  relatedCertifications: [
    "CISSP"
  ],

  relatedConferences: [
    "Black Hat"
  ],

  interviewQuestions: [
    "What is Zero Trust?"
  ],

  recruiterTips: [
    "Search Zero Trust architecture."
  ],

  booleanKeywords: [
    "\"Zero Trust\"",
    "Zscaler",
    "Entra ID"
  ],

  aiPrompt:
    "Find Security Architects experienced with Zero Trust implementations.",

  relatedTopics: [
    "soc",
    "iso27001"
  ]
};