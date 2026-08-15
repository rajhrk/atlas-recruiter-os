// ============================================================
// Atlas Recruiter OS
// Cross-Domain Technical Talent Discovery Model
//
// Purpose:
// Normalize technical talent discovered across:
// AI / ML
// Robotics
// Hardware / Embedded
// Semiconductor
//
// This is a discovery/evidence model.
// It does not replace the domain-specific talent models.
// ============================================================

/**
 * Technical domains supported by cross-domain discovery.
 */
export type DiscoveryTechnicalDomain =
  | "AI / ML"
  | "Robotics"
  | "Hardware / Embedded"
  | "Semiconductor";

/**
 * High-level candidate/talent types.
 */
export type DiscoveryTalentType =
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
  | "Systems Engineer"
  | "Computer Architect"
  | "Verification Engineer"
  | "Physical Design Engineer"
  | "DFT Engineer"
  | "Analog Engineer"
  | "Professor"
  | "PhD Researcher"
  | "Postdoctoral Researcher"
  | "Other";

/**
 * Evidence sources.
 *
 * A discovery record should be explainable back to evidence.
 */
export type DiscoverySource =
  | "LinkedIn"
  | "GitHub"
  | "Google Scholar"
  | "Google Patents"
  | "ORCID"
  | "DBLP"
  | "arXiv"
  | "Semantic Scholar"
  | "Papers with Code"
  | "IEEE"
  | "Conference Proceedings"
  | "University"
  | "Research Lab"
  | "Company"
  | "Personal Website"
  | "Other";

/**
 * Types of evidence Atlas can attach to a talent record.
 */
export type DiscoveryEvidenceType =
  | "Employment"
  | "Technical Profile"
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
  | "Talk"
  | "Course"
  | "Other";

/**
 * Confidence in a discovered fact/evidence item.
 */
export type DiscoveryConfidence =
  | "Very High"
  | "High"
  | "Medium"
  | "Low";

/**
 * A normalized technical skill.
 */
export interface DiscoverySkill {
  name: string;

  normalizedName?: string;

  domain?: DiscoveryTechnicalDomain;

  evidenceIds?: string[];
}

/**
 * A normalized technology.
 */
export interface DiscoveryTechnology {
  name: string;

  normalizedName?: string;

  category?: string;

  domain?: DiscoveryTechnicalDomain;

  evidenceIds?: string[];
}

/**
 * A single piece of evidence supporting a candidate attribute.
 *
 * This is intentionally granular so Atlas can explain
 * why it believes a candidate matches.
 */
export interface DiscoveryEvidence {
  id: string;

  type: DiscoveryEvidenceType;

  source: DiscoverySource;

  title: string;

  url?: string;

  publisher?: string;

  organization?: string;

  date?: string;

  description?: string;

  confidence: DiscoveryConfidence;

  /**
   * What this evidence supports.
   *
   * Examples:
   * "PyTorch"
   * "Computer Vision"
   * "Robotics Research"
   * "ASIC Verification"
   */
  supports?: string[];

  /**
   * Optional recruiter-facing explanation.
   */
  relevance?: string;
}

/**
 * Employment / affiliation signal.
 */
export interface DiscoveryAffiliation {
  organization: string;

  title?: string;

  normalizedTitle?: string;

  startDate?: string;

  endDate?: string;

  current?: boolean;

  location?: string;

  domain?: DiscoveryTechnicalDomain;

  evidenceIds?: string[];
}

/**
 * Publication signal.
 */
export interface DiscoveryPublication {
  title: string;

  venue?: string;

  year?: number;

  authors?: string[];

  url?: string;

  citationCount?: number;

  researchAreas?: string[];

  evidenceId?: string;
}

/**
 * Patent signal.
 */
export interface DiscoveryPatent {
  title: string;

  patentNumber?: string;

  filingDate?: string;

  publicationDate?: string;

  inventors?: string[];

  assignee?: string;

  url?: string;

  technologies?: string[];

  evidenceId?: string;
}

/**
 * Open-source / GitHub signal.
 */
export interface DiscoveryRepositorySignal {
  repository: string;

  url?: string;

  owner?: string;

  description?: string;

  languages?: string[];

  technologies?: string[];

  stars?: number;

  contributions?: number;

  lastActivity?: string;

  evidenceId?: string;
}

/**
 * Conference / research signal.
 */
export interface DiscoveryConferenceSignal {
  name: string;

  year?: number;

  role?:
    | "Author"
    | "Speaker"
    | "Presenter"
    | "Workshop"
    | "Attendee"
    | "Organizer"
    | "Other";

  paperTitle?: string;

  url?: string;

  evidenceId?: string;
}

/**
 * A normalized sourcing signal.
 *
 * These are useful for recruiter discovery and prioritization.
 */
export interface DiscoverySourcingSignal {
  type:
    | "Technical Depth"
    | "Research Activity"
    | "Open Source"
    | "Publication"
    | "Patent"
    | "Conference"
    | "Company Affiliation"
    | "Leadership"
    | "Domain Transition"
    | "Geographic"
    | "Education"
    | "Other";

  signal: string;

  strength: DiscoveryConfidence;

  evidenceIds?: string[];

  explanation?: string;
}

/**
 * Explainable match reason.
 *
 * Atlas should eventually show recruiters why
 * a person matched a search.
 */
export interface DiscoveryMatchReason {
  category:
    | "Role"
    | "Skill"
    | "Technology"
    | "Research"
    | "Industry"
    | "Experience"
    | "Education"
    | "Publication"
    | "Patent"
    | "Open Source"
    | "Conference"
    | "Location"
    | "Other";

  signal: string;

  weight?: number;

  explanation: string;

  evidenceIds?: string[];
}

/**
 * Candidate fit assessment.
 */
export interface DiscoveryFitScore {
  overall: number;

  technical?: number;

  research?: number;

  experience?: number;

  domain?: number;

  evidence?: number;

  confidence?: number;

  reasons: DiscoveryMatchReason[];
}

/**
 * Recruiter approval state.
 *
 * Atlas should not automatically treat every discovered
 * person as recruiter-approved.
 */
export type DiscoveryApprovalStatus =
  | "Unreviewed"
  | "Shortlisted"
  | "Approved"
  | "Rejected"
  | "Contacted"
  | "Archived";

/**
 * Cross-domain technical talent record.
 */
export interface TechnicalTalentDiscoveryRecord {
  /**
   * Atlas internal identifier.
   */
  id: string;

  /**
   * Normalized identity.
   */
  name: string;

  firstName?: string;

  lastName?: string;

  headline?: string;

  location?: string;

  country?: string;

  city?: string;

  /**
   * Primary technical classification.
   */
  primaryDomain: DiscoveryTechnicalDomain;

  /**
   * Additional domains demonstrated by the person.
   */
  secondaryDomains?: DiscoveryTechnicalDomain[];

  talentType?: DiscoveryTalentType;

  roleFamily?: string;

  normalizedRole?: string;

  seniority?: string;

  /**
   * Normalized technical signals.
   */
  skills: DiscoverySkill[];

  technologies: DiscoveryTechnology[];

  researchAreas?: string[];

  /**
   * Professional history.
   */
  affiliations?: DiscoveryAffiliation[];

  /**
   * Research and technical evidence.
   */
  publications?: DiscoveryPublication[];

  patents?: DiscoveryPatent[];

  repositories?: DiscoveryRepositorySignal[];

  conferences?: DiscoveryConferenceSignal[];

  /**
   * Raw evidence collected from external sources.
   */
  evidence: DiscoveryEvidence[];

  /**
   * Recruiter-oriented signals generated from evidence.
   */
  sourcingSignals?: DiscoverySourcingSignal[];

  /**
   * Matching output.
   */
  fitScore?: DiscoveryFitScore;

  /**
   * Confidence in the overall normalized record.
   */
  confidence?: DiscoveryConfidence;

  /**
   * Recruiter workflow state.
   */
  approvalStatus: DiscoveryApprovalStatus;

  /**
   * Optional recruiter notes.
   */
  recruiterNotes?: string[];

  /**
   * Deduplication / identity resolution.
   *
   * Multiple external records may resolve to one Atlas record.
   */
  sourceRecordIds?: string[];

  duplicateOfId?: string;

  /**
   * Timestamps.
   */
  firstDiscoveredAt?: string;

  lastVerifiedAt?: string;
}

/**
 * Recruiter discovery query.
 *
 * This becomes the input contract for the future
 * cross-domain discovery engine.
 */
export interface TechnicalTalentDiscoveryQuery {
  keywords?: string[];

  domains?: DiscoveryTechnicalDomain[];

  talentTypes?: DiscoveryTalentType[];

  roleFamilies?: string[];

  skills?: string[];

  technologies?: string[];

  researchAreas?: string[];

  companies?: string[];

  locations?: string[];

  countries?: string[];

  conferences?: string[];

  minimumExperienceYears?: number;

  maximumExperienceYears?: number;

  /**
   * Minimum acceptable match score.
   */
  minimumFitScore?: number;

  /**
   * Minimum confidence required.
   */
  minimumConfidence?: DiscoveryConfidence;

  /**
   * Include research-heavy profiles.
   */
  researchFocused?: boolean;

  /**
   * Include open-source-heavy profiles.
   */
  openSourceFocused?: boolean;

  /**
   * Include patent-heavy profiles.
   */
  patentFocused?: boolean;

  /**
   * Include people demonstrating multiple
   * technical domains.
   */
  crossDomainOnly?: boolean;

  /**
   * External sources to search.
   */
  sources?: DiscoverySource[];

  /**
   * Result pagination.
   */
  limit?: number;

  offset?: number;
}

/**
 * Result returned by the future discovery engine.
 */
export interface TechnicalTalentDiscoveryResult {
  query: TechnicalTalentDiscoveryQuery;

  candidates: TechnicalTalentDiscoveryRecord[];

  total: number;

  /**
   * Number of records requiring identity resolution.
   */
  unresolvedDuplicates?: number;

  /**
   * Sources actually used.
   */
  sourcesUsed?: DiscoverySource[];

  /**
   * Timestamp of the discovery run.
   */
  searchedAt?: string;
}