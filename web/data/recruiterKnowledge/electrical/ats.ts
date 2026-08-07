import { RecruiterKnowledgeTopic } from "../types";

export const atsKnowledge: RecruiterKnowledgeTopic = {
  id: "ats",
  title: "Automatic Transfer Switch (ATS)",
  category: "Electrical Systems",

  summary:
    "An Automatic Transfer Switch (ATS) automatically transfers electrical load from the utility supply to emergency generators during a power failure and switches back once utility power is restored.",

  whyItMatters: [
    "Provides uninterrupted transition between utility and generator power.",
    "Critical component of every Tier III and Tier IV data center.",
    "Prevents manual intervention during outages.",
    "Works closely with UPS and Generator systems."
  ],

  keyConcepts: [
    "Open Transition",
    "Closed Transition",
    "Bypass Isolation",
    "Generator Start Signal",
    "Transfer Delay"
  ],

  majorVendors: [
    "ASCO",
    "Schneider Electric",
    "ABB",
    "Eaton"
  ],

  majorProducts: [
    "ASCO 7000 Series",
    "Masterpact Transfer",
    "ABB TruONE",
    "Eaton ATS"
  ],

  usedByCompanies: [
    "AWS",
    "Microsoft",
    "Google",
    "Meta",
    "Equinix"
  ],

  relatedRoles: [
    "Critical Facilities Engineer",
    "Electrical Engineer",
    "Commissioning Engineer"
  ],

  relatedSkills: [
    "UPS",
    "Generator Systems",
    "Switchgear"
  ],

  relatedCertifications: [
    "CDCS",
    "ATD"
  ],

  relatedConferences: [
    "DCD Connect",
    "Data Centre World"
  ],

  interviewQuestions: [
    "How does an ATS work?",
    "Difference between Open and Closed Transition?",
    "What triggers generator startup?",
    "Why is ATS testing important?"
  ],

  recruiterTips: [
    "Look for commissioning experience.",
    "Search ASCO and Schneider ATS experience.",
    "Prioritize engineers familiar with emergency power systems."
  ],

  booleanKeywords: [
    "ATS",
    "\"Automatic Transfer Switch\"",
    "ASCO",
    "Emergency Power"
  ],

  aiPrompt:
    "Find Critical Facilities Engineers with ATS commissioning and emergency power transfer experience.",

  relatedTopics: [
    "ups",
    "generator",
    "switchgear"
  ]
};