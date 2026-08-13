// ============================================================
// Atlas Recruiter OS
// Robotics Technical Talent Intelligence v1
//
// Domain model for:
// Robotics Engineering
// Perception
// SLAM / Localization
// Motion Planning
// Controls
// Manipulation
// Robot Learning
// Autonomy
// Simulation
// Embedded / Firmware
// Humanoid / Physical AI
// Robotics Research
// ============================================================

export type RoboticsRoleFamily =
  | "Robotics Engineering"
  | "Perception"
  | "SLAM / Localization"
  | "Motion Planning"
  | "Controls"
  | "Manipulation"
  | "Robot Learning"
  | "Reinforcement Learning"
  | "Autonomy"
  | "Simulation"
  | "Embedded / Firmware"
  | "Systems / Integration"
  | "Mechatronics"
  | "Robotics Research";

export interface RoboticsRole {
  id: string;

  title: string;

  normalizedTitle: string;

  family: RoboticsRoleFamily;

  seniority?: "Junior" | "Mid" | "Senior" | "Staff" | "Principal" | "Lead";

  aliases: string[];

  skills: string[];

  technologies: string[];

  researchAreas?: string[];

  relatedRoles?: string[];

  sourcingSignals?: string[];

  recruiterNotes?: string[];
}

export interface RoboticsSkill {
  id: string;

  name: string;

  category:
    | "Robotics"
    | "Perception"
    | "Localization"
    | "Planning"
    | "Controls"
    | "Manipulation"
    | "Robot Learning"
    | "AI / ML"
    | "Simulation"
    | "Embedded"
    | "Systems"
    | "Hardware"
    | "Other";

  relatedRoles?: string[];

  relatedTechnologies?: string[];

  description?: string;
}

export interface RoboticsTechnology {
  id: string;

  name: string;

  category:
    | "Framework"
    | "Library"
    | "Simulator"
    | "Middleware"
    | "Language"
    | "Hardware Platform"
    | "AI / ML"
    | "Cloud"
    | "Tool"
    | "Other";

  relatedSkills?: string[];

  relatedRoles?: string[];

  description?: string;
}

export interface RoboticsResearchLandscape {
  conferences: string[];

  journals?: string[];

  researchSources: string[];

  researchLabs?: string[];

  researchAreas: string[];

  publicationSignals: string[];

  patentSignals: string[];

  openSourceSignals: string[];
}

export interface RoboticsBooleanLibrary {
  id: string;

  name: string;

  category: string;

  useCase: string;

  query: string;
}

export interface RoboticsDomain {
  domain: "Robotics";

  roles: RoboticsRole[];

  skills: RoboticsSkill[];

  technologies: RoboticsTechnology[];

  researchLandscape: RoboticsResearchLandscape;

  booleanLibrary: RoboticsBooleanLibrary[];

  conferences: string[];

  researchSources: string[];

  developerSources: string[];

  patentSources: string[];
}