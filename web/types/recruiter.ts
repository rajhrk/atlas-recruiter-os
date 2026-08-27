import type { TalentDomainId } from "@/lib/atlas/talentDomains";

export interface RecruiterSearchRequest {
  domain: TalentDomainId;
  role: string;
  location: string;
  seniority: string;
  company: string;
}
