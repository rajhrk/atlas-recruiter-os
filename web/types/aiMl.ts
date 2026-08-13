// ============================================================
// Atlas Recruiter OS
// AI / ML Intelligence Model
// ============================================================

import { TechnicalDomain } from "./technicalTalent";

export type AIMLRoleFamily =
  | "Machine Learning Engineering"
  | "AI Engineering"
  | "Research"
  | "Data Science"
  | "NLP"
  | "Computer Vision"
  | "Speech"
  | "MLOps / ML Infrastructure"
  | "Recommendation Systems"
  | "Search / Ranking"
  | "Generative AI"
  | "Responsible AI"
  | "AI Leadership";

export type RecommenderArea =
  | "Search"
  | "Feed"
  | "Ads"
  | "Video"
  | "E-commerce"
  | "Social"
  | "Livestream"
  | "Core Recommendation";

export type MLRegion =
  | "China"
  | "South Korea"
  | "Japan"
  | "Singapore"
  | "India"
  | "Canada"
  | "Taiwan"
  | "United States"
  | "EMEA";

export interface AIMLRole {
  id: string;

  title: string;

  normalizedTitle: string;

  family: AIMLRoleFamily;

  seniority?: string;

  aliases: string[];

  skills: string[];

  technologies: string[];

  researchAreas?: string[];

  targetCompanies?: string[];

  conferences?: string[];

  booleanKeywords?: string[];

  recruiterNotes?: string[];
}

export interface RecommenderRole {
  id: string;

  title: string;

  normalizedTitle: string;

  area: RecommenderArea;

  aliases: string[];

  keywords: string[];

  technologies?: string[];

  targetCompanies?: string[];

  recruiterNotes?: string[];
}

export interface MLCompanyLandscape {
  company: string;

  region: MLRegion;

  relevantAreas: (
    | "Machine Learning"
    | "AI Research"
    | "Search"
    | "Ranking"
    | "Recommendation"
    | "Ads"
    | "Feed"
    | "Video"
    | "E-commerce"
    | "NLP"
    | "Computer Vision"
    | "Generative AI"
    | "Speech"
    | "Multimodal"
  )[];

  sourcingKeywords: string[];

  commonTitles?: string[];

  notes?: string;
}

export interface MLResearchLandscape {
  region: MLRegion;

  companies: string[];

  researchOrganizations: string[];

  universities?: string[];

  researchAreas: string[];

  sourcingSources: string[];

  researcherSignals?: string[];

  publicationSignals?: string[];

  citationSignals?: string[];

  patentSignals?: string[];

  conferenceSignals?: string[];

  openSourceSignals?: string[];

  recruiterNotes?: string[];
}

export interface MLBooleanLibrary {
  id: string;

  name: string;

  category:
    | "General ML"
    | "Role"
    | "Recommendation"
    | "Search"
    | "Ranking"
    | "Research"
    | "Conference"
    | "X-Ray";

  query: string;

  useCase: string;
}

export interface AIMLDomain {
  domain: TechnicalDomain;

  roles: AIMLRole[];

  recommenderRoles: RecommenderRole[];

  companyLandscape: MLCompanyLandscape[];

  researchLandscape: MLResearchLandscape[];

  booleanLibrary: MLBooleanLibrary[];

  coreSkills: string[];

  coreTechnologies: string[];

  conferences: string[];

  researchSources: string[];

  developerSources: string[];

  patentSources: string[];
}
