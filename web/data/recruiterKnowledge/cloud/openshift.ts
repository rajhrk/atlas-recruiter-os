import { RecruiterKnowledgeTopic } from "../types";

export const openshiftKnowledge: RecruiterKnowledgeTopic = {
  id: "openshift",
  title: "Red Hat OpenShift",
  category: "Cloud Infrastructure",

  summary:
    "OpenShift is Red Hat's enterprise Kubernetes platform with integrated developer and operations tooling.",

  whyItMatters: [
    "Enterprise Kubernetes platform.",
    "Common in regulated industries."
  ],

  keyConcepts: [
    "Operators",
    "Routes",
    "Projects"
  ],

  majorVendors: [
    "Red Hat"
  ],

  majorProducts: [
    "OpenShift Container Platform"
  ],

  usedByCompanies: [
    "IBM",
    "Enterprise IT"
  ],

  relatedRoles: [
    "Platform Engineer"
  ],

  relatedSkills: [
    "Kubernetes"
  ],

  relatedCertifications: [
    "Red Hat Certified Specialist"
  ],

  relatedConferences: [
    "Red Hat Summit"
  ],

  interviewQuestions: [
    "How is OpenShift different from Kubernetes?"
  ],

  recruiterTips: [
    "Search OpenShift Operators and OCP."
  ],

  booleanKeywords: [
    "OpenShift",
    "OCP"
  ],

  aiPrompt:
    "Find OpenShift Platform Engineers.",

  relatedTopics: [
    "kubernetes"
  ]
};