import {
  BooleanExample,
  IntelligenceObject,
  Relationship,
  SidebarItem,
  TimelineItem,
} from "@/types/intelligence";

export interface HiringGuide extends IntelligenceObject {

  // Hiring specific
  role: string;

  marketDifficulty: string;

  timeToFill: string;

  salaryNotes: string[];

  recruitingStrategy: string[];

  toolsUsed: string[];

  kpis: string[];

  travelRequirements: string[];

  shiftRequirements: string[];

  commonJobTitles: string[];

  keywords: string[];

  vendorCompanies: string[];

  competitorCompanies: string[];

  careerSources: string[];

}