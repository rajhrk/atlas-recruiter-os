import { RecruiterKnowledgeTopic } from "../types";

export const virtualizationKnowledge: RecruiterKnowledgeTopic = {
  id: "virtualization",
  title: "Virtualization",
  category: "Cloud Infrastructure",

  summary:
    "Virtualization enables multiple virtual machines to run on a single physical server, improving utilization, scalability and operational efficiency.",

  whyItMatters: [
    "Improves hardware utilization.",
    "Supports cloud computing.",
    "Simplifies workload management."
  ],

  keyConcepts: [
    "Virtual Machine",
    "Host",
    "Guest OS",
    "Resource Allocation"
  ],

  majorVendors: [
    "VMware",
    "Microsoft",
    "Red Hat"
  ],

  majorProducts: [
    "vSphere",
    "Hyper-V",
    "KVM"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Oracle"
  ],

  relatedRoles: [
    "Cloud Engineer",
    "Virtualization Engineer"
  ],

  relatedSkills: [
    "VMware",
    "Hypervisor"
  ],

  relatedCertifications: [
    "VCP"
  ],

  relatedConferences: [
    "VMware Explore"
  ],

  interviewQuestions: [
    "What is virtualization?",
    "What are the benefits of virtualization?"
  ],

  recruiterTips: [
    "Search VMware, Hyper-V and KVM experience."
  ],

  booleanKeywords: [
    "Virtualization",
    "VMware",
    "KVM"
  ],

  aiPrompt:
    "Find Virtualization Engineers with enterprise data center experience.",

  relatedTopics: [
    "vmware",
    "hypervisor"
  ]
};