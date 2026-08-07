import { RecruiterKnowledgeTopic } from "../types";

export const rdmaKnowledge: RecruiterKnowledgeTopic = {
  id: "rdma",
  title: "Remote Direct Memory Access (RDMA)",
  category: "AI Infrastructure",

  summary:
    "RDMA enables one server to access another server's memory directly with extremely low latency and minimal CPU overhead.",

  whyItMatters: [
    "Accelerates distributed AI training.",
    "Improves GPU communication."
  ],

  keyConcepts: [
    "Memory Access",
    "Low Latency",
    "RoCE"
  ],

  majorVendors: [
    "NVIDIA",
    "Broadcom"
  ],

  majorProducts: [
    "ConnectX"
  ],

  usedByCompanies: [
    "OpenAI",
    "Meta"
  ],

  relatedRoles: [
    "Network Engineer"
  ],

  relatedSkills: [
    "InfiniBand"
  ],

  relatedCertifications: [
    "NVIDIA DLI"
  ],

  relatedConferences: [
    "GTC"
  ],

  interviewQuestions: [
    "What is RDMA?"
  ],

  recruiterTips: [
    "Search RoCE and ConnectX."
  ],

  booleanKeywords: [
    "RDMA",
    "RoCE"
  ],

  aiPrompt:
    "Find engineers with RDMA networking experience.",

  relatedTopics: [
    "infiniband"
  ]
};