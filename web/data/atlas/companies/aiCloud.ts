import { AtlasCompany } from "@/types/company";

export const aiCloud: AtlasCompany[] = [
  {
    id: "coreweave",
    name: "CoreWeave",
    aliases: [],
    companyType: "AI Cloud Provider",
    priority: "Tier 3",
    categoryIds: ["ai-cloud"],
    headquarters: "Roseland, New Jersey, USA",
    regions: ["Global"],
    dataCenterPresence: [
      "North America",
      "EMEA",
    ],
    dataCenterTypes: [
      "Cloud",
      "AI",
    ],
    website: "https://www.coreweave.com",
    coreTechnologies: [
      "NVIDIA GPU Clusters",
      "AI Infrastructure",
      "Liquid Cooling",
    ],
    strategicVendors: [
      "NVIDIA",
      "Dell Technologies",
      "Vertiv",
      "Schneider Electric",
    ],
    roles: [
      "Data Center Engineer",
      "Critical Facilities Engineer",
      "Network Engineer",
    ],
    certifications: ["CDCP"],
    aiPrompt:
      "Recruit engineers with experience supporting GPU clusters, AI infrastructure, and mission-critical facilities.",
    recruiterNotes:
      "Fast-growing AI infrastructure provider with significant GPU deployments.",
  },
];

export default aiCloud;