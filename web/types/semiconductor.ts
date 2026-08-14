// ============================================================
// Atlas Recruiter OS
// Semiconductor / ASIC / FPGA / Silicon Talent Intelligence
// ============================================================

export type SemiconductorRoleFamily =
  | "RTL / Digital Design"
  | "Design Verification"
  | "Physical Design"
  | "DFT / Test"
  | "Static Timing Analysis"
  | "Analog / Mixed Signal"
  | "FPGA"
  | "SoC / Architecture"
  | "Silicon Validation"
  | "Post-Silicon"
  | "EDA / CAD"
  | "Power / Performance"
  | "Semiconductor Research";

export type SemiconductorRegion =
  | "United States"
  | "Canada"
  | "Taiwan"
  | "China"
  | "Japan"
  | "South Korea"
  | "Singapore"
  | "India"
  | "Israel"
  | "United Kingdom"
  | "Germany"
  | "France"
  | "Switzerland"
  | "Netherlands"
  | "Other";

export interface SemiconductorRole {
  id: string;

  title: string;

  normalizedTitle: string;

  family: SemiconductorRoleFamily;

  seniority?: string;

  aliases: string[];

  skills: string[];

  technologies: string[];

  languages?: string[];

  methodologies?: string[];

  platforms?: string[];

  relatedRoles?: string[];

  sourcingSignals?: string[];

  recruiterNotes?: string[];
}

export interface SemiconductorSkill {
  id: string;

  name: string;

  category:
    | "Digital Design"
    | "Verification"
    | "Physical Design"
    | "DFT"
    | "Timing"
    | "Analog"
    | "FPGA"
    | "Architecture"
    | "Validation"
    | "EDA"
    | "Power"
    | "Process"
    | "Other";

  relatedRoles?: string[];

  relatedTechnologies?: string[];

  description?: string;
}

export interface SemiconductorTechnology {
  id: string;

  name: string;

  category:
    | "HDL"
    | "Verification"
    | "EDA"
    | "Simulation"
    | "Synthesis"
    | "Physical Design"
    | "Timing"
    | "DFT"
    | "FPGA"
    | "Processor"
    | "Interconnect"
    | "Packaging"
    | "Debugging"
    | "Other";

  relatedSkills?: string[];

  relatedRoles?: string[];

  description?: string;
}

export interface SemiconductorResearchLandscape {
  conferences: string[];

  journals?: string[];

  researchSources: string[];

  researchLabs?: string[];

  researchAreas: string[];

  publicationSignals: string[];

  patentSignals: string[];

  openSourceSignals: string[];
}

export interface SemiconductorBooleanLibrary {
  id: string;

  name: string;

  category: string;

  useCase: string;

  query: string;
}

export interface SemiconductorDomain {
  domain: "Semiconductor";

  roles: SemiconductorRole[];

  skills: SemiconductorSkill[];

  technologies: SemiconductorTechnology[];

  researchLandscape: SemiconductorResearchLandscape;

  booleanLibrary: SemiconductorBooleanLibrary[];

  conferences: string[];

  researchSources: string[];
}