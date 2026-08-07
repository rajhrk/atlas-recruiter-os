import { RecruiterKnowledgeTopic } from "../types";

export const physicalSecurityKnowledge: RecruiterKnowledgeTopic = {
  id: "physical-security",
  title: "Physical Security",
  category: "Security & Compliance",

  summary:
    "Physical security protects data center facilities against unauthorized access, theft and sabotage through multiple layers of security controls.",

  whyItMatters: [
    "Protects mission critical infrastructure.",
    "Required for compliance.",
    "Reduces operational risk."
  ],

  keyConcepts: [
    "Perimeter Security",
    "Mantrap",
    "Security Zones",
    "Visitor Management"
  ],

  majorVendors: [
    "LenelS2",
    "Honeywell",
    "Genetec"
  ],

  majorProducts: [
    "OnGuard",
    "Security Center"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta"
  ],

  relatedRoles: [
    "Security Engineer",
    "Critical Facilities Engineer"
  ],

  relatedSkills: [
    "Access Control",
    "CCTV"
  ],

  relatedCertifications: [
    "CPP"
  ],

  relatedConferences: [
    "ISC West"
  ],

  interviewQuestions: [
    "What is layered physical security?"
  ],

  recruiterTips: [
    "Search mission critical security experience."
  ],

  booleanKeywords: [
    "\"Physical Security\"",
    "Mantrap",
    "OnGuard"
  ],

  aiPrompt:
    "Find Physical Security Engineers with hyperscale data center experience.",

  relatedTopics: [
    "access-control",
    "cctv"
  ]
};