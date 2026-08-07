import { RecruiterKnowledgeTopic } from "../types";

export const gpuClustersKnowledge: RecruiterKnowledgeTopic = {
  id: "gpu-clusters",
  title: "GPU Clusters",
  category: "AI Infrastructure",

  summary:
    "GPU clusters combine hundreds or thousands of GPUs to accelerate AI model training and inference workloads in hyperscale data centers.",

  whyItMatters: [
    "Foundation of modern AI infrastructure.",
    "Drives demand for high-density power and cooling.",
    "Requires specialized networking."
  ],

  keyConcepts: [
    "GPU Nodes",
    "Distributed Training",
    "AI Supercomputing",
    "Cluster Management"
  ],

  majorVendors: [
    "NVIDIA",
    "AMD",
    "Intel"
  ],

  majorProducts: [
    "DGX",
    "HGX",
    "Instinct MI300"
  ],

  usedByCompanies: [
    "OpenAI",
    "Meta",
    "Microsoft",
    "Google",
    "xAI"
  ],

  relatedRoles: [
    "AI Infrastructure Engineer",
    "Data Center Engineer"
  ],

  relatedSkills: [
    "InfiniBand",
    "NVLink",
    "Liquid Cooling"
  ],

  relatedCertifications: [
    "NVIDIA DLI"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "What is a GPU cluster?",
    "Why are GPUs preferred for AI training?"
  ],

  recruiterTips: [
    "Search HGX, DGX and AI factory experience."
  ],

  booleanKeywords: [
    "HGX",
    "DGX",
    "\"GPU Cluster\""
  ],

  aiPrompt:
    "Find AI Infrastructure Engineers with hyperscale GPU cluster deployment experience.",

  relatedTopics: [
    "infiniband",
    "nvlink",
    "liquid-cooling"
  ]
};