export type CareerFunction =
  | "Critical Facilities"
  | "Customer Operations"
  | "Design / Engineering"
  | "Construction"
  | "Commissioning"
  | "Deployment"
  | "Operations Compliance"
  | "Operations Monitoring";

export type CareerLevel =
  | "Entry"
  | "Junior"
  | "Engineer II"
  | "Engineer III"
  | "Engineer IV"
  | "Engineer V"
  | "Engineer"
  | "Senior"
  | "Lead"
  | "Supervisor"
  | "Senior Supervisor"
  | "Manager"
  | "Senior Manager"
  | "Director"
  | "Principal"
  | "Specialist"
  | "Analyst"
  | "Senior Analyst"
  | "Other";

export interface DataCenterRole {
  title: string;

  normalizedTitle: string;

  level: CareerLevel;

  function: CareerFunction;

  discipline?: string;

  locations?: string[];

  source?: string;

  verified?: boolean;
}

export interface CareerLadder {
  function: CareerFunction;

  description?: string;

  roles: DataCenterRole[];
}

export interface CompanyCareerArchitecture {
  companyId: string;

  companyName: string;

  careerLadders: CareerLadder[];
}