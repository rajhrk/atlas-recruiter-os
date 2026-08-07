import { RecruiterKnowledgeTopic } from "../types";

export const nvlinkKnowledge: RecruiterKnowledgeTopic = {
  id: "nvlink",
  title: "NVIDIA NVLink",
  category: "AI Infrastructure",

  summary:
    "NVLink is NVIDIA's high-speed GPU interconnect technology for large AI systems.",

  whyItMatters: [
    "Improves GPU communication.",
    "Supports large language model training."
  ],

  keyConcepts: [
    "GPU Fabric",
    "Bandwidth",
    "Memory Sharing"
  ],

  majorVendors: [
    "NVIDIA"
  ],

  majorProducts: [
    "NVLink",
    "NVSwitch"
  ],

  usedByCompanies: [
    "OpenAI",
    "Meta",
    "Microsoft"
  ],

  relatedRoles: [
    "AI Infrastructure Engineer"
  ],

  relatedSkills: [
    "GPU Clusters",
    "InfiniBand"
  ],

  relatedCertifications: [
    "NVIDIA DLI"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "What is NVLink?"
  ],

  recruiterTips: [
    "Search HGX and NVSwitch experience."
  ],

  booleanKeywords: [
    "NVLink",
    "NVSwitch"
  ],

  aiPrompt:
    "Find AI Infrastructure Engineers with NVLink experience.",

  relatedTopics: [
    "gpu-clusters",
    "infiniband"
  ]
};