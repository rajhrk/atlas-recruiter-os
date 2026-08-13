// ============================================================
// Atlas Recruiter OS
// Technical Talent Intelligence v1
//
// Shared intelligence model for:
// AI / ML
// Robotics
// Hardware / Embedded
// Semiconductor
// Software Engineering
// ============================================================

/**
 * Supported technical domains.
 */
export type TechnicalDomain =
  | "AI / ML"
  | "Robotics"
  | "Hardware / Embedded"
  | "Semiconductor"
  | "Software Engineering";

/**
 * Types of people Atlas can represent.
 */
export type TalentType =
  | "Research Scientist"
  | "Applied Scientist"
  | "Research Engineer"
  | "ML Engineer"
  | "AI Engineer"
  | "Robotics Engineer"
  | "Software Engineer"
  | "Hardware Engineer"
  | "Embedded Engineer"
  | "Firmware Engineer"
  | "ASIC Engineer"
  | "FPGA Engineer"
  | "Silicon Engineer"
  | "Professor"
  | "PhD Researcher"
  | "Postdoctoral Researcher"
  | "Other";

/**
 * External intelligence sources.
 *
 * These are sources of evidence, not the core data model.
 */
export type IntelligenceSource =
  | "GitHub"
  | "Stack Overflow"
  | "Hugging Face"
  | "Kaggle"
  | "Google Scholar"
  | "Google Patents"
  | "ORCID"
  | "DBLP"
  | "arXiv"
  | "ResearchGate"
  | "Semantic Scholar"
  | "Papers with Code"
  | "IEEE"
  | "Conference Proceedings"
  | "University"
  | "Research Lab"
  | "Other";

/**
 * Evidence categories.
 */
export type EvidenceType =
  | "Publication"
  | "Citation"
  | "Patent"
  | "Repository"
  | "Open Source Contribution"
  | "Research Project"
  | "Conference Paper"
  | "Conference Proceeding"
  | "Dissertation"
  | "Model"
  | "Dataset"
  | "Competition"
  | "Technical Profile"
  | "Other";

/**
 * A generic piece of evidence supporting
 * a technical or research claim.
 */
export interface TalentEvidence {
  id: string;

  type: EvidenceType;

  source: IntelligenceSource;

  title: string;

  url?: string;

  publishedDate?: string;

  description?: string;

  /**
   * IDs of people, companies, labs,
   * technologies or other entities
   * associated with this evidence.
   */
  relatedEntityIds?: string[];
}

/**
 * Technical technology / framework / platform.
 */
export interface TechnicalTechnology {
  id: string;

  name: string;

  category:
    | "Framework"
    | "Library"
    | "Language"
    | "Platform"
    | "Hardware"
    | "Cloud"
    | "Tool"
    | "Protocol"
    | "Model"
    | "Other";

  domains: TechnicalDomain[];

  relatedSkills?: string[];

  relatedRoles?: string[];

  relatedCompanies?: string[];

  description?: string;
}

/**
 * Research publication.
 */
export interface Publication {
  id: string;

  title: string;

  authors: string[];

  abstract?: string;

  publicationDate?: string;

  venue?: string;

  venueType?:
    | "Journal"
    | "Conference"
    | "Workshop"
    | "Preprint"
    | "Thesis"
    | "Other";

  doi?: string;

  url?: string;

  sources?: IntelligenceSource[];

  citationCount?: number;

  citedByPublicationIds?: string[];

  referencesPublicationIds?: string[];

  researchAreas?: string[];

  technologies?: string[];

  organizations?: string[];

  evidenceIds?: string[];
}

/**
 * Patent / intellectual property record.
 */
export interface Patent {
  id: string;

  title: string;

  inventors: string[];

  assignee?: string;

  filingDate?: string;

  publicationDate?: string;

  patentNumber?: string;

  jurisdiction?: string;

  url?: string;

  technologies?: string[];

  researchAreas?: string[];

  citationCount?: number;

  relatedPatentIds?: string[];

  evidenceIds?: string[];
}

/**
 * GitHub / software repository.
 */
export interface Repository {
  id: string;

  name: string;

  owner?: string;

  description?: string;

  url?: string;

  languages?: string[];

  technologies?: string[];

  topics?: string[];

  stars?: number;

  forks?: number;

  contributors?: string[];

  organizations?: string[];

  lastActivityDate?: string;

  evidenceIds?: string[];
}

/**
 * Research project.
 */
export interface ResearchProject {
  id: string;

  name: string;

  description?: string;

  organizations?: string[];

  researchLabs?: string[];

  researchers?: string[];

  technologies?: string[];

  researchAreas?: string[];

  startDate?: string;

  endDate?: string;

  url?: string;

  evidenceIds?: string[];
}

/**
 * Research laboratory / research organization.
 */
export interface ResearchLab {
  id: string;

  name: string;

  organization?: string;

  type:
    | "Corporate Lab"
    | "University Lab"
    | "Government Lab"
    | "Independent Research Lab"
    | "Research Institute"
    | "Other";

  location?: string;

  domains?: TechnicalDomain[];

  researchAreas?: string[];

  technologies?: string[];

  researchers?: string[];

  projects?: string[];

  publications?: string[];

  url?: string;
}

/**
 * Conference / proceedings record.
 */
export interface ConferenceProceeding {
  id: string;

  conference: string;

  year?: number;

  title: string;

  authors?: string[];

  type:
    | "Paper"
    | "Workshop"
    | "Poster"
    | "Tutorial"
    | "Proceeding"
    | "Other";

  url?: string;

  researchAreas?: string[];

  technologies?: string[];

  organizations?: string[];

  evidenceIds?: string[];
}

/**
 * Dissertation / thesis.
 */
export interface Dissertation {
  id: string;

  title: string;

  author: string;

  university?: string;

  advisor?: string;

  publicationDate?: string;

  degree?: string;

  researchAreas?: string[];

  technologies?: string[];

  url?: string;

  evidenceIds?: string[];
}

/**
 * Citation relationship.
 *
 * This allows Atlas to eventually build
 * citation graphs rather than storing only
 * a single citation count.
 */
export interface CitationRelationship {
  fromPublicationId: string;

  toPublicationId: string;

  relationship:
    | "CITES"
    | "CITED_BY"
    | "RELATED"
    | "EXTENDS"
    | "BUILDS_ON";
}

/**
 * A researcher / engineer / technical professional.
 */
export interface TalentProfile {
  id: string;

  name: string;

  talentType?: TalentType;

  domains: TechnicalDomain[];

  currentCompany?: string;

  currentRole?: string;

  previousCompanies?: string[];

  locations?: string[];

  skills?: string[];

  technologies?: string[];

  researchAreas?: string[];

  universities?: string[];

  researchLabs?: string[];

  publications?: string[];

  patents?: string[];

  repositories?: string[];

  researchProjects?: string[];

  conferenceProceedings?: string[];

  dissertations?: string[];

  communities?: string[];

  /**
   * External identities.
   */
  externalProfiles?: {
    source: IntelligenceSource;

    username?: string;

    profileUrl?: string;

    externalId?: string;
  }[];

  /**
   * Evidence supporting the profile.
   */
  evidenceIds?: string[];

  /**
   * Recruiter-facing notes.
   */
  recruiterNotes?: string[];

  /**
   * Future explainable matching score.
   */
  confidenceScore?: number;
}

/**
 * Complete Technical Talent Intelligence
 * knowledge collection.
 */
export interface TechnicalTalentIntelligence {
  talents: TalentProfile[];

  publications: Publication[];

  patents: Patent[];

  repositories: Repository[];

  researchProjects: ResearchProject[];

  researchLabs: ResearchLab[];

  conferenceProceedings: ConferenceProceeding[];

  dissertations: Dissertation[];

  technologies: TechnicalTechnology[];

  evidence: TalentEvidence[];

  citations: CitationRelationship[];
}