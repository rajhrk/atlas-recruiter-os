import { AtlasCompany } from "@/types/company";

export const hyperscalers: AtlasCompany[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    aliases: ["AWS", "Amazon"],
    companyType: "Hyperscaler",
    priority: "Tier 1",
    categoryIds: ["hyperscaler"],
    headquarters: "Seattle, Washington, USA",
    regions: ["Global"],
    dataCenterPresence: [
      "APAC",
      "EMEA",
      "North America",
      "South America",
    ],
    dataCenterTypes: [
      "Hyperscale",
      "Cloud",
    ],
    website: "https://aws.amazon.com",
    coreTechnologies: [
      "AWS",
      "Nitro",
      "EC2",
      "Critical Facilities",
      "EPMS",
      "BMS",
    ],
    strategicVendors: [
      "Schneider Electric",
      "Vertiv",
      "Cummins",
      "ABB",
      "Siemens",
    ],
    roles: [
      "Critical Facilities Engineer",
      "Data Center Technician",
      "Controls Engineer",
      "Commissioning Engineer",
      "Mechanical Engineer",
      "Electrical Engineer",
    ],
    certifications: [
      "CDCP",
      "CDCS",
    ],
    aiPrompt:
      "Recruit experienced mission-critical data centre engineers with hyperscale operations experience for AWS infrastructure.",
    recruiterNotes:
      "Large global hiring footprint across operations, construction and commissioning.",
  },

  {
    id: "microsoft",
    name: "Microsoft",
    aliases: ["Azure", "Microsoft Azure"],
    companyType: "Hyperscaler",
    priority: "Tier 1",
    categoryIds: ["hyperscaler"],
    headquarters: "Redmond, Washington, USA",
    regions: ["Global"],
    dataCenterPresence: [
      "APAC",
      "EMEA",
      "North America",
    ],
    dataCenterTypes: [
      "Hyperscale",
      "Cloud",
      "AI",
    ],
    website: "https://www.microsoft.com",
    coreTechnologies: [
      "Azure",
      "Azure Stack",
      "EPMS",
      "BMS",
      "Critical Facilities",
    ],
    strategicVendors: [
      "Schneider Electric",
      "Vertiv",
      "ABB",
      "Siemens",
    ],
    roles: [
      "Critical Facilities Engineer",
      "Data Center Technician",
      "Facility Manager",
    ],
    certifications: [
      "CDCP",
      "CDCS",
    ],
    aiPrompt:
      "Recruit experienced Critical Facilities Engineers from hyperscalers, colocation providers and enterprise data centres.",
    recruiterNotes:
      "Strong hiring focus on mission-critical operations and cloud infrastructure.",
  },

  {
    id: "google",
    name: "Google",
    aliases: ["Google Cloud", "GCP"],
    companyType: "Hyperscaler",
    priority: "Tier 1",
    categoryIds: ["hyperscaler"],
    headquarters: "Mountain View, California, USA",
    regions: ["Global"],
    dataCenterPresence: [
      "APAC",
      "EMEA",
      "North America",
    ],
    dataCenterTypes: [
      "Hyperscale",
      "Cloud",
      "AI",
    ],
    website: "https://cloud.google.com",
    coreTechnologies: [
      "Google Cloud",
      "Critical Facilities",
      "BMS",
      "EPMS",
    ],
    strategicVendors: [
      "Schneider Electric",
      "Vertiv",
      "Siemens",
    ],
    roles: [
      "Critical Facilities Engineer",
      "Data Center Technician",
      "Controls Engineer",
    ],
    certifications: [
      "CDCP",
    ],
    aiPrompt:
      "Recruit engineers experienced in hyperscale operations and critical environments for Google Cloud.",
    recruiterNotes:
      "Strong emphasis on automation, reliability and operational excellence.",
  },

  {
    id: "meta",
    name: "Meta",
    aliases: ["Facebook", "Meta Platforms"],
    companyType: "Hyperscaler",
    priority: "Tier 1",
    categoryIds: ["hyperscaler"],
    headquarters: "Menlo Park, California, USA",
    regions: ["Global"],
    dataCenterPresence: [
      "APAC",
      "EMEA",
      "North America",
    ],
    dataCenterTypes: [
      "Hyperscale",
      "AI",
    ],
    website: "https://about.meta.com",
    coreTechnologies: [
      "Critical Facilities",
      "Open Compute Project",
      "EPMS",
      "BMS",
    ],
    strategicVendors: [
      "Vertiv",
      "Schneider Electric",
      "ABB",
    ],
    roles: [
      "Critical Facilities Engineer",
      "Data Center Technician",
      "Site Operations Engineer",
    ],
    certifications: [
      "CDCP",
    ],
    aiPrompt:
      "Recruit mission-critical facility engineers with hyperscale operations experience for Meta infrastructure.",
    recruiterNotes:
      "Open Compute expertise is highly valued.",
  },
];

export default hyperscalers;