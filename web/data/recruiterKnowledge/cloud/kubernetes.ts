import { RecruiterKnowledgeTopic } from "../types";

export const kubernetesKnowledge: RecruiterKnowledgeTopic = {
  id: "kubernetes",
  title: "Kubernetes",
  category: "Cloud Infrastructure",

  summary:
    "Kubernetes is the leading container orchestration platform for deploying, scaling and managing containerized workloads.",

  whyItMatters: [
    "Standard platform for cloud-native applications.",
    "Automates deployment and scaling."
  ],

  keyConcepts: [
    "Pods",
    "Nodes",
    "Deployments",
    "Services",
    "Ingress"
  ],

  majorVendors: [
    "Google",
    "Red Hat",
    "VMware"
  ],

  majorProducts: [
    "GKE",
    "AKS",
    "EKS"
  ],

  usedByCompanies: [
    "Google",
    "AWS",
    "Microsoft",
    "OpenAI"
  ],

  relatedRoles: [
    "Platform Engineer",
    "Cloud Engineer"
  ],

  relatedSkills: [
    "Containers",
    "OpenShift"
  ],

  relatedCertifications: [
    "CKA"
  ],

  relatedConferences: [
    "KubeCon"
  ],

  interviewQuestions: [
    "What is a Pod?",
    "Why is Kubernetes used?"
  ],

  recruiterTips: [
    "Search CKA, EKS, AKS and GKE."
  ],

  booleanKeywords: [
    "Kubernetes",
    "EKS",
    "AKS",
    "GKE"
  ],

  aiPrompt:
    "Find Kubernetes Engineers with production cluster experience.",

  relatedTopics: [
    "containers",
    "openshift"
  ]
};