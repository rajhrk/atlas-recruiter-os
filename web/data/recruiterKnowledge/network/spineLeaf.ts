import { RecruiterKnowledgeTopic } from "../types";

export const spineLeafKnowledge: RecruiterKnowledgeTopic = {
  id: "spine-leaf",
  title: "Spine-Leaf Network Architecture",
  category: "Network Infrastructure",

  summary:
    "Spine-Leaf architecture provides predictable low-latency networking for hyperscale data centers.",

  whyItMatters: [
    "Scalable architecture.",
    "Supports east-west traffic.",
    "Ideal for AI workloads."
  ],

  keyConcepts: [
    "Leaf Switch",
    "Spine Switch",
    "ECMP",
    "East-West Traffic"
  ],

  majorVendors: [
    "Cisco",
    "Arista",
    "Juniper",
    "NVIDIA"
  ],

  majorProducts: [
    "Nexus",
    "7050X",
    "QFX",
    "Spectrum"
  ],

  usedByCompanies: [
    "AWS",
    "Meta",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Network Engineer"
  ],

  relatedSkills: [
    "BGP",
    "EVPN",
    "VXLAN"
  ],

  relatedCertifications: [
    "CCNP",
    "CCIE"
  ],

  relatedConferences: [
    "NANOG"
  ],

  interviewQuestions: [
    "Why is Spine-Leaf used?",
    "What is ECMP?"
  ],

  recruiterTips: [
    "Search Arista and Cisco Nexus experience."
  ],

  booleanKeywords: [
    "\"Spine Leaf\"",
    "ECMP",
    "Arista",
    "Cisco Nexus"
  ],

  aiPrompt:
    "Find Network Engineers experienced with Spine-Leaf data center fabrics.",

  relatedTopics: [
    "bgp",
    "dwdm"
  ]
};