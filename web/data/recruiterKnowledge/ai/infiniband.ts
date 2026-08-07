import { RecruiterKnowledgeTopic } from "../types";

export const infinibandKnowledge: RecruiterKnowledgeTopic = {
  id: "infiniband",
  title: "InfiniBand",
  category: "AI Infrastructure",

  summary:
    "InfiniBand provides ultra-low latency and high-bandwidth networking for AI clusters and HPC environments.",

  whyItMatters: [
    "Critical for distributed AI training.",
    "Enables GPU-to-GPU communication.",
    "Reduces training time."
  ],

  keyConcepts: [
    "RDMA",
    "Low Latency",
    "200G",
    "400G",
    "NDR"
  ],

  majorVendors: [
    "NVIDIA"
  ],

  majorProducts: [
    "Quantum-2",
    "ConnectX"
  ],

  usedByCompanies: [
    "OpenAI",
    "Meta",
    "Microsoft",
    "CoreWeave"
  ],

  relatedRoles: [
    "Network Engineer",
    "AI Infrastructure Engineer"
  ],

  relatedSkills: [
    "RDMA",
    "GPU Clusters"
  ],

  relatedCertifications: [
    "NVIDIA DLI"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "Why is InfiniBand used for AI?",
    "Difference between Ethernet and InfiniBand?"
  ],

  recruiterTips: [
    "Search Quantum and ConnectX experience."
  ],

  booleanKeywords: [
    "InfiniBand",
    "NDR",
    "ConnectX"
  ],

  aiPrompt:
    "Find engineers with InfiniBand deployment experience.",

  relatedTopics: [
    "rdma",
    "gpu-clusters"
  ]
};