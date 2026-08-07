import { RecruiterKnowledgeTopic } from "../types";

export const vmwareKnowledge: RecruiterKnowledgeTopic = {
  id: "vmware",
  title: "VMware vSphere",
  category: "Cloud Infrastructure",

  summary:
    "VMware vSphere is the industry's leading enterprise virtualization platform for managing virtual machines and private cloud infrastructure.",

  whyItMatters: [
    "Most widely deployed enterprise virtualization platform.",
    "Foundation of many private clouds."
  ],

  keyConcepts: [
    "ESXi",
    "vCenter",
    "vMotion",
    "HA",
    "DRS"
  ],

  majorVendors: [
    "VMware"
  ],

  majorProducts: [
    "ESXi",
    "vCenter",
    "vSAN"
  ],

  usedByCompanies: [
    "Equinix",
    "Oracle",
    "Enterprise Data Centers"
  ],

  relatedRoles: [
    "VMware Administrator"
  ],

  relatedSkills: [
    "Virtualization",
    "Storage"
  ],

  relatedCertifications: [
    "VCP-DCV"
  ],

  relatedConferences: [
    "VMware Explore"
  ],

  interviewQuestions: [
    "What is vMotion?",
    "Difference between ESXi and vCenter?"
  ],

  recruiterTips: [
    "Search ESXi, vCenter and vSAN."
  ],

  booleanKeywords: [
    "VMware",
    "ESXi",
    "vCenter",
    "vMotion"
  ],

  aiPrompt:
    "Find VMware Administrators with enterprise virtualization experience.",

  relatedTopics: [
    "virtualization",
    "hypervisor"
  ]
};