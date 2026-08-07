import { RecruiterKnowledgeTopic } from "../types";

export const bgpKnowledge: RecruiterKnowledgeTopic = {
  id: "bgp",
  title: "Border Gateway Protocol (BGP)",
  category: "Network Infrastructure",

  summary:
    "BGP is the routing protocol used for exchanging routing information between autonomous systems and large-scale networks.",

  whyItMatters: [
    "Supports scalable routing.",
    "Critical for hyperscale networking."
  ],

  keyConcepts: [
    "ASN",
    "Route Advertisement",
    "Peering",
    "Policy Routing"
  ],

  majorVendors: [
    "Cisco",
    "Juniper",
    "Arista"
  ],

  majorProducts: [
    "IOS XR",
    "Junos",
    "EOS"
  ],

  usedByCompanies: [
    "AWS",
    "Cloudflare",
    "Google"
  ],

  relatedRoles: [
    "Network Engineer"
  ],

  relatedSkills: [
    "Spine-Leaf",
    "Routing"
  ],

  relatedCertifications: [
    "CCNP",
    "JNCIP"
  ],

  relatedConferences: [
    "NANOG"
  ],

  interviewQuestions: [
    "What is BGP?",
    "What is an ASN?"
  ],

  recruiterTips: [
    "Search BGP EVPN VXLAN."
  ],

  booleanKeywords: [
    "BGP",
    "EVPN",
    "VXLAN"
  ],

  aiPrompt:
    "Find Network Engineers with large-scale BGP experience.",

  relatedTopics: [
    "spine-leaf"
  ]
};