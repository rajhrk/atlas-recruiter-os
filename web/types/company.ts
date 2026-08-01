export type CompanyType =
  | "Hyperscaler"
  | "AI Cloud Provider"
  | "Colocation Provider"
  | "OEM"
  | "Construction"
  | "Consulting"
  | "Telecom"
  | "Enterprise";

export type Region =
  | "Global"
  | "APAC"
  | "EMEA"
  | "North America"
  | "South America"
  | "Middle East"
  | "Africa";

export interface AtlasCompany {
  id: string;

  name: string;

  aliases: string[];

  companyType: CompanyType;

  categoryIds: string[];

  headquarters: string;

  regions: Region[];

  dataCenterPresence: string[];

  website: string;

  coreTechnologies: string[];

  strategicVendors: string[];

  roles: string[];

  certifications: string[];

  aiPrompt: string;

  recruiterNotes: string;
}