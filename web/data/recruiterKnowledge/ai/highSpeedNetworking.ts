import { RecruiterKnowledgeTopic } from "../types";

export const highSpeedNetworkingKnowledge: RecruiterKnowledgeTopic = {
  id: "high-speed-networking",
  title: "High Speed Networking",
  category: "AI Infrastructure",

  summary:
    "AI infrastructure relies on 100G, 200G, 400G and 800G networking to move massive volumes of data between compute clusters.",

  whyItMatters: [
    "Supports AI workloads.",
    "Eliminates network bottlenecks."
  ],

  keyConcepts: [
    "100G",
    "400G",
    "800G",
    "Ethernet"
  ],

  majorVendors: [
    "Arista",
    "Cisco",
    "NVIDIA"
  ],

  majorProducts: [
    "Spectrum-X",
    "800G Switches"
  ],

  usedByCompanies: [
    "Meta",
    "Google",
    "Microsoft"
  ],

  relatedRoles: [
    "Network Engineer"
  ],

  relatedSkills: [
    "Spine-Leaf",
    "InfiniBand"
  ],

  relatedCertifications: [
    "CCNP"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "Why is 400G networking important for AI?"
  ],

  recruiterTips: [
    "Search 400G and Spectrum-X."
  ],

  booleanKeywords: [
    "400G",
    "800G",
    "Spectrum-X"
  ],

  aiPrompt:
    "Find Network Engineers with AI networking experience.",

  relatedTopics: [
    "spine-leaf",
    "gpu-clusters"
  ]
};