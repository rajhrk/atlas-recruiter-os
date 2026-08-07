import { RecruiterKnowledgeTopic } from "../types";

export const biometricsKnowledge: RecruiterKnowledgeTopic = {
  id: "biometrics",
  title: "Biometric Access Systems",
  category: "Security & Compliance",

  summary:
    "Biometric systems use fingerprints, iris scans or facial recognition to strengthen physical access security.",

  whyItMatters: [
    "Improves identity verification.",
    "Reduces badge sharing."
  ],

  keyConcepts: [
    "Fingerprint",
    "Iris Scan",
    "Facial Recognition"
  ],

  majorVendors: [
    "HID",
    "Suprema"
  ],

  majorProducts: [
    "BioEntry"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft"
  ],

  relatedRoles: [
    "Security Engineer"
  ],

  relatedSkills: [
    "Access Control"
  ],

  relatedCertifications: [
    "CPP"
  ],

  relatedConferences: [
    "ISC West"
  ],

  interviewQuestions: [
    "Why use biometrics?"
  ],

  recruiterTips: [
    "Search biometric access systems."
  ],

  booleanKeywords: [
    "Biometric",
    "\"Facial Recognition\""
  ],

  aiPrompt:
    "Find Engineers with biometric access system deployment experience.",

  relatedTopics: [
    "access-control"
  ]
};