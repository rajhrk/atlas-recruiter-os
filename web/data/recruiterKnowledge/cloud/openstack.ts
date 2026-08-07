import { RecruiterKnowledgeTopic } from "../types";

export const openstackKnowledge: RecruiterKnowledgeTopic = {
  id: "openstack",
  title: "OpenStack",
  category: "Cloud Infrastructure",

  summary:
    "OpenStack is an open-source cloud platform for building and managing Infrastructure-as-a-Service (IaaS) environments.",

  whyItMatters: [
    "Supports private cloud deployments.",
    "Popular in telecom and enterprise."
  ],

  keyConcepts: [
    "Nova",
    "Neutron",
    "Cinder",
    "Keystone"
  ],

  majorVendors: [
    "Red Hat",
    "Canonical"
  ],

  majorProducts: [
    "Red Hat OpenStack Platform",
    "Charmed OpenStack"
  ],

  usedByCompanies: [
    "Telecom Operators",
    "Private Cloud Providers"
  ],

  relatedRoles: [
    "Cloud Engineer"
  ],

  relatedSkills: [
    "Linux",
    "Virtualization"
  ],

  relatedCertifications: [
    "COA"
  ],

  relatedConferences: [
    "OpenInfra Summit"
  ],

  interviewQuestions: [
    "What is OpenStack?"
  ],

  recruiterTips: [
    "Search Nova, Neutron and Keystone."
  ],

  booleanKeywords: [
    "OpenStack",
    "Nova",
    "Neutron"
  ],

  aiPrompt:
    "Find Cloud Engineers with OpenStack deployment experience.",

  relatedTopics: [
    "virtualization"
  ]
};