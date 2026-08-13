import { AtlasCompany } from "@/types/company";

export const colocation: AtlasCompany[] = [
  {
    id: "equinix",
    name: "Equinix",
    aliases: [],
    companyType: "Colocation Provider",
    priority: "Tier 2",
    categoryIds: ["colocation"],
    headquarters: "Redwood City, California, USA",
    regions: ["Global"],
    dataCenterPresence: [
      "APAC",
      "EMEA",
      "North America",
      "South America",
    ],
    dataCenterTypes: [
      "Colocation",
      "Edge",
      "Cloud",
    ],
    website: "https://www.equinix.com",
    coreTechnologies: [
      "IBX Data Centres",
      "Critical Facilities",
      "Power Systems",
      "Cooling Systems",
    ],
    strategicVendors: [
      "Schneider Electric",
      "Vertiv",
      "ABB",
      "Cummins",
    ],
    roles: [
      "Critical Facilities Engineer",
      "Data Center Technician",
      "Operations Manager",
    ],
    certifications: [
      "CDCP",
      "CDCS",
    ],
    aiPrompt:
      "Recruit engineers experienced in mission-critical operations, power, cooling, and colocation environments.",
    recruiterNotes:
      "Global leader in colocation with extensive hiring across APAC, EMEA, and the Americas.",
  },
];

export default colocation;