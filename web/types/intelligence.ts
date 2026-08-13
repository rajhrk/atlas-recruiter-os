// ============================================================
// Atlas Recruiter OS
// Universal Intelligence Model
// ============================================================

export interface Relationship {
  id: string;
  type: string;
  label: string;
}

export interface IntelligenceStat {
  label: string;
  value: string | number;
}

export interface TimelineItem {
  title: string;
  description?: string;
}

export interface SidebarItem {
  label: string;
  value: string;
}

export interface BooleanExample {
  title: string;
  query: string;
}

export interface IntelligenceObject {
  // Identity
  id: string;
  title: string;
  category: string;
  summary: string;

  // Header
  stats: IntelligenceStat[];

  // Main Content
  overview?: string;

  recruiterNotes?: string[];

  interviewQuestions?: string[];

  redFlags?: string[];

  responsibilities?: string[];

  careerPath?: TimelineItem[];

  // Skills
  mustHaveSkills?: string[];

  niceToHaveSkills?: string[];

  // Hiring
  targetCompanies?: string[];

  targetTitles?: string[];

  adjacentTalentPools?: string[];

  vendorEcosystem?: string[];

  certifications?: string[];

  conferences?: string[];

  // Search
  booleanExamples?: BooleanExample[];

  linkedinSearches?: string[];

  xraySearches?: string[];

  githubSearches?: string[];

  aiPrompt?: string;

  // Relationships
  relatedRoles?: Relationship[];

  relatedSkills?: Relationship[];

  relatedCompanies?: Relationship[];

  relatedTechnologies?: Relationship[];

  relatedCertifications?: Relationship[];

  relatedKnowledge?: Relationship[];

  // Sidebar
  sidebar?: SidebarItem[];
}