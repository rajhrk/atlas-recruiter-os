import { RecruiterKnowledgeTopic } from "../types";

export const containersKnowledge: RecruiterKnowledgeTopic = {
  id: "containers",
  title: "Containers",
  category: "Cloud Infrastructure",

  summary:
    "Containers package applications with their dependencies into lightweight, portable runtime environments.",

  whyItMatters: [
    "Faster deployments.",
    "Cloud-native architecture."
  ],

  keyConcepts: [
    "Docker",
    "Images",
    "Registry",
    "Runtime"
  ],

  majorVendors: [
    "Docker",
    "Red Hat"
  ],

  majorProducts: [
    "Docker Engine",
    "Podman"
  ],

  usedByCompanies: [
    "Google",
    "AWS",
    "Microsoft"
  ],

  relatedRoles: [
    "DevOps Engineer"
  ],

  relatedSkills: [
    "Kubernetes"
  ],

  relatedCertifications: [
    "CKA"
  ],

  relatedConferences: [
    "KubeCon"
  ],

  interviewQuestions: [
    "What is a container?"
  ],

  recruiterTips: [
    "Search Docker and Podman."
  ],

  booleanKeywords: [
    "Docker",
    "Containers",
    "Podman"
  ],

  aiPrompt:
    "Find DevOps Engineers with container platform experience.",

  relatedTopics: [
    "kubernetes"
  ]
};