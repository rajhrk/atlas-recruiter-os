import { RecruiterKnowledgeTopic } from "../types";

export const networkMonitoringKnowledge: RecruiterKnowledgeTopic = {
  id: "network-monitoring",
  title: "Network Monitoring",
  category: "Network Infrastructure",

  summary:
    "Network monitoring platforms continuously monitor the health, availability and performance of data center networks.",

  whyItMatters: [
    "Improves uptime.",
    "Detects failures early.",
    "Supports capacity planning."
  ],

  keyConcepts: [
    "SNMP",
    "Telemetry",
    "NetFlow",
    "Alerting"
  ],

  majorVendors: [
    "SolarWinds",
    "ThousandEyes",
    "LogicMonitor"
  ],

  majorProducts: [
    "NPM",
    "LogicMonitor",
    "ThousandEyes"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google"
  ],

  relatedRoles: [
    "Network Operations Engineer"
  ],

  relatedSkills: [
    "SNMP",
    "Monitoring"
  ],

  relatedCertifications: [
    "CCNP"
  ],

  relatedConferences: [
    "Cisco Live"
  ],

  interviewQuestions: [
    "How do you monitor network health?"
  ],

  recruiterTips: [
    "Search SNMP and telemetry experience."
  ],

  booleanKeywords: [
    "SNMP",
    "NetFlow",
    "Telemetry"
  ],

  aiPrompt:
    "Find Network Operations Engineers experienced with enterprise network monitoring platforms.",

  relatedTopics: [
    "bgp",
    "spine-leaf"
  ]
};