import { RecruiterKnowledgeTopic } from "../types";

export const hypervisorKnowledge: RecruiterKnowledgeTopic = {
  id: "hypervisor",
  title: "Hypervisors",
  category: "Cloud Infrastructure",

  summary:
    "A hypervisor enables multiple virtual machines to share the same physical server while isolating workloads.",

  whyItMatters: [
    "Foundation of virtualization.",
    "Improves infrastructure utilization."
  ],

  keyConcepts: [
    "Type 1",
    "Type 2",
    "Bare Metal"
  ],

  majorVendors: [
    "VMware",
    "Microsoft",
    "Citrix"
  ],

  majorProducts: [
    "ESXi",
    "Hyper-V",
    "Xen"
  ],

  usedByCompanies: [
    "Enterprise Data Centers"
  ],

  relatedRoles: [
    "Virtualization Engineer"
  ],

  relatedSkills: [
    "VMware"
  ],

  relatedCertifications: [
    "VCP"
  ],

  relatedConferences: [
    "VMware Explore"
  ],

  interviewQuestions: [
    "What is a Type 1 hypervisor?"
  ],

  recruiterTips: [
    "Search ESXi and Hyper-V."
  ],

  booleanKeywords: [
    "Hypervisor",
    "ESXi",
    "Hyper-V"
  ],

  aiPrompt:
    "Find Virtualization Engineers with hypervisor administration experience.",

  relatedTopics: [
    "virtualization",
    "vmware"
  ]
};