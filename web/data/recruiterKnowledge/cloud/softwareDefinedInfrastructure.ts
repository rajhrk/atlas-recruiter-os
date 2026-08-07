import { RecruiterKnowledgeTopic } from "../types";

export const softwareDefinedInfrastructureKnowledge: RecruiterKnowledgeTopic = {
  id: "software-defined-infrastructure",
  title: "Software Defined Infrastructure",
  category: "Cloud Infrastructure",

  summary:
    "Software Defined Infrastructure abstracts compute, storage and networking resources, enabling centralized automation and orchestration.",

  whyItMatters: [
    "Improves automation.",
    "Supports cloud-scale operations."
  ],

  keyConcepts: [
    "Software Defined Compute",
    "Software Defined Storage",
    "Software Defined Networking"
  ],

  majorVendors: [
    "VMware",
    "Nutanix",
    "Red Hat"
  ],

  majorProducts: [
    "vSAN",
    "NSX",
    "AHV"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google"
  ],

  relatedRoles: [
    "Cloud Architect",
    "Infrastructure Engineer"
  ],

  relatedSkills: [
    "Virtualization",
    "Kubernetes"
  ],

  relatedCertifications: [
    "VCP"
  ],

  relatedConferences: [
    "VMware Explore"
  ],

  interviewQuestions: [
    "What is Software Defined Infrastructure?"
  ],

  recruiterTips: [
    "Search NSX, vSAN and Nutanix."
  ],

  booleanKeywords: [
    "\"Software Defined Infrastructure\"",
    "NSX",
    "vSAN",
    "Nutanix"
  ],

  aiPrompt:
    "Find Infrastructure Engineers with software-defined data center experience.",

  relatedTopics: [
    "virtualization",
    "kubernetes"
  ]
};