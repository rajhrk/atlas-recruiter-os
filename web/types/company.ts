export type CompanyType =
  | "Hyperscaler"
  | "AI Cloud Provider"
  | "Cloud Provider"
  | "Colocation Provider"
  | "OEM"
  | "Construction"
  | "Managed Services"
  | "Consulting"
  | "Telecom"
  | "Enterprise";

export type CompanyPriority =
  | "Tier 1"
  | "Tier 2"
  | "Tier 3";

export type Region =
  | "Global"
  | "APAC"
  | "EMEA"
  | "North America"
  | "South America"
  | "Middle East"
  | "Africa";

/*
 * Data Center Type
 *
 * A company can operate or support multiple
 * types of data center infrastructure.
 */
export type DataCenterType =
  | "Hyperscale"
  | "Colocation"
  | "Enterprise"
  | "Edge"
  | "Managed Services"
  | "Cloud"
  | "AI";

export interface AtlasCompany {
  id: string;

  name: string;

  aliases: string[];

  companyType: CompanyType;

  priority: CompanyPriority;

  categoryIds: string[];

  headquarters: string;

  regions: Region[];

  /*
   * Geographic data-center footprint.
   */
  dataCenterPresence: string[];

  /*
   * Types of data-center infrastructure
   * the company operates, provides or supports.
   */
  dataCenterTypes: DataCenterType[];

  website: string;

  coreTechnologies: string[];

  strategicVendors: string[];

  roles: string[];

  certifications: string[];

  aiPrompt: string;

  recruiterNotes: string;
}