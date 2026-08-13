import { AtlasCompany } from "@/types/company";

export const oem: AtlasCompany[] = [
  {
    id: "schneider-electric",
    name: "Schneider Electric",
    aliases: ["Schneider"],
    companyType: "OEM",
    priority: "Tier 3",
    categoryIds: ["oem"],
    headquarters: "Rueil-Malmaison, France",
    regions: ["Global"],
    dataCenterPresence: [
      "APAC",
      "EMEA",
      "North America",
      "South America",
      "Middle East",
      "Africa",
    ],
    dataCenterTypes: [
      "Hyperscale",
      "Colocation",
      "Enterprise",
      "Edge",
      "Managed Services",
      "Cloud",
      "AI",
    ],
    website: "https://www.se.com",
    coreTechnologies: [
      "UPS",
      "Switchgear",
      "EPMS",
      "BMS",
      "Cooling",
    ],
    strategicVendors: [],
    roles: [
      "Field Service Engineer",
      "Commissioning Engineer",
      "Critical Power Engineer",
    ],
    certifications: ["CDCP"],
    aiPrompt:
      "Recruit engineers with expertise in critical power, UPS, switchgear, EPMS, and commissioning for mission-critical data centres.",
    recruiterNotes:
      "One of the world's largest suppliers of mission-critical electrical infrastructure.",
  },
];

export default oem;