import { TimelineItem } from "@/types/intelligence";

export interface HiringGuide {
  // Identity
  id: string;
  role: string;
  category: string;
  overview: string;

  // Hiring difficulty
  whyHireIsDifficult?: string[];
  marketDifficulty: string;
  timeToFill: string;

  // Responsibilities
  responsibilities: string[];
  weeklyResponsibilities?: string[];
  emergencyResponsibilities?: string[];

  // Talent backgrounds
  backgrounds?: string[];
  education?: string[];

  // Career path
  careerPath?: TimelineItem[];

  // Skills
  mustHaveSkills?: string[];
  niceToHaveSkills?: string[];

  // Talent pools
  adjacentTalentPools?: string[];

  // Hiring targets
  targetCompanies?: string[];
  targetTitles?: string[];

  // Vendors / ecosystem
  vendorEcosystem?: string[];
  vendorCompanies: string[];
  competitorCompanies: string[];

  // Recruiting intelligence
  recruitingStrategy: string[];
  recruiterTips?: string[];
  recruiterNotes?: string[];
  toolsUsed: string[];

  // Search
  booleanStrings?: string[];

  booleanExamples?: {
    title: string;
    query: string;
  }[];

  linkedinSearches?: string[];
  xraySearches?: string[];
  githubSearches?: string[];

  keywords: string[];

  // Hiring intelligence
  interviewQuestions?: string[];
  redFlags?: string[];

  // Compensation / logistics
  salaryNotes: string[];
  kpis: string[];
  travelRequirements: string[];
  shiftRequirements: string[];
  commonJobTitles: string[];
  careerSources: string[];
  communities?: string[];

  // Certifications / conferences
  certifications?: string[];
  conferences?: string[];

  // AI
  aiPrompt: string;

  // Relationships
  relatedGuides?: string[];
}