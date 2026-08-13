// ============================================================
// Atlas Recruiter OS
// Hardware / Embedded Technical Talent Intelligence Model
// ============================================================

export type HardwareRoleFamily =
  | "Embedded Systems"
  | "Firmware"
  | "Embedded Linux"
  | "BSP / Device Drivers"
  | "Hardware Engineering"
  | "Hardware Systems"
  | "Board Design"
  | "Power Electronics"
  | "Computer Architecture"
  | "Edge Computing"
  | "Hardware Validation"
  | "Systems Engineering";

export type HardwareRegion =
  | "United States"
  | "Canada"
  | "Taiwan"
  | "China"
  | "Japan"
  | "South Korea"
  | "Singapore"
  | "India"
  | "Europe"
  | "United Kingdom"
  | "Israel"
  | "Other";

export interface HardwareRole {
  id: string;

  title: string;

  normalizedTitle: string;

  family: HardwareRoleFamily;

  seniority?: string;

  aliases: string[];

  skills: string[];

  technologies: string[];

  protocols?: string[];

  platforms?: string[];

  relatedRoles?: string[];

  sourcingSignals?: string[];

  recruiterNotes?: string[];
}

export interface HardwareSkill {
  id: string;

  name: string;

  category:
    | "Embedded"
    | "Firmware"
    | "Hardware"
    | "Systems"
    | "Linux"
    | "Drivers"
    | "Architecture"
    | "Validation"
    | "Networking"
    | "Power"
    | "Other";

  relatedRoles?: string[];

  relatedTechnologies?: string[];

  description?: string;
}

export interface HardwareTechnology {
  id: string;

  name: string;

  category:
    | "Language"
    | "RTOS"
    | "Operating System"
    | "Processor"
    | "Microcontroller"
    | "Interface"
    | "Protocol"
    | "Hardware Platform"
    | "Debugging"
    | "EDA"
    | "Tool"
    | "Other";

  relatedSkills?: string[];

  relatedRoles?: string[];

  description?: string;
}

export interface HardwareResearchLandscape {
  conferences: string[];

  journals?: string[];

  researchSources: string[];

  researchLabs?: string[];

  researchAreas: string[];

  publicationSignals: string[];

  patentSignals: string[];

  openSourceSignals: string[];
}

export interface HardwareBooleanLibrary {
  id: string;

  name: string;

  category: string;

  useCase: string;

  query: string;
}

export interface HardwareDomain {
  domain: "Hardware / Embedded";

  roles: HardwareRole[];

  skills: HardwareSkill[];

  technologies: HardwareTechnology[];

  researchLandscape: HardwareResearchLandscape;

  booleanLibrary: HardwareBooleanLibrary[];

  conferences: string[];

  researchSources: string[];
}