import { RecruiterKnowledgeTopic } from "../types";

export const aiPodsKnowledge: RecruiterKnowledgeTopic = {
  id: "ai-pods",
  title: "AI Pods",
  category: "AI Infrastructure",

  summary:
    "AI Pods are modular deployments of compute, networking and storage designed for scalable AI infrastructure.",

  whyItMatters: [
    "Accelerates AI deployment.",
    "Standardizes infrastructure."
  ],

  keyConcepts: [
    "Reference Architecture",
    "Scalability",
    "Modular Deployment"
  ],

  majorVendors: [
    "NVIDIA",
    "Dell",
    "HPE"
  ],

  majorProducts: [
    "DGX POD",
    "AI Factory"
  ],

  usedByCompanies: [
    "CoreWeave",
    "Microsoft",
    "Oracle"
  ],

  relatedRoles: [
    "AI Infrastructure Engineer"
  ],

  relatedSkills: [
    "GPU Clusters"
  ],

  relatedCertifications: [
    "NVIDIA DLI"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "What is an AI Pod?"
  ],

  recruiterTips: [
    "Search DGX POD deployments."
  ],

  booleanKeywords: [
    "\"AI Pod\"",
    "\"DGX POD\""
  ],

  aiPrompt:
    "Find engineers deploying AI Pods.",

  relatedTopics: [
    "gpu-clusters"
  ]
};