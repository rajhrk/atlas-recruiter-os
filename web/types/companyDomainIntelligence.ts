import type { TalentDomainId } from "@/lib/atlas/talentDomains";
import type {
  CompanyPriority,
  Region,
} from "@/types/company";

export interface CompanyDomainSourcingSignals {
  technicalSignals: string[];
  ecosystemSignals: string[];
  researchSignals: string[];
}

export interface CompanyDomainIntelligence {
  companyId: string;
  domainId: TalentDomainId;

  /*
   * Domain-specific company classification.
   *
   * Data Center may use classifications such as
   * Hyperscaler or Colocation Provider.
   *
   * Other domains should not inherit Data Center
   * classifications.
   */
  companyType?: string;

  priority?: CompanyPriority;

  targetRoles: string[];

  coreTechnologies: string[];

  certifications: string[];

  conferences: string[];

  strategicVendors: string[];

  recruiterNotes: string;

  aiPrompt: string;

  booleanSearch: string;

  sourcingSignals: CompanyDomainSourcingSignals;

  /*
   * Common company-level geographic information.
   */
  regions?: Region[];

  /*
   * Data Center-only intelligence.
   *
   * These fields must never be populated from the
   * global company record for non-Data-Center domains.
   */
  dataCenterTypes?: string[];

  dataCenterPresence?: string[];
}
