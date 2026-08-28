import {
  TALENT_DOMAINS,
  type TalentDomainId,
} from "@/lib/atlas/talentDomains";

import { getCompanyById } from "@/lib/atlas/companyService";

import type { AtlasCompany } from "@/types/company";

import type {
  CompanyDomainIntelligence,
} from "@/types/companyDomainIntelligence";

import {
  getRegisteredCompanyDomainIntelligence,
} from "@/lib/atlas/companyDomainIntelligenceRegistry";

function emptyDomainIntelligence(
  company: AtlasCompany,
  domainId: TalentDomainId,
): CompanyDomainIntelligence {
  return {
    companyId: company.id,
    domainId,

    targetRoles: [],
    coreTechnologies: [],
    certifications: [],
    conferences: [],
    strategicVendors: [],

    recruiterNotes: "",
    aiPrompt: "",
    booleanSearch: "",

    sourcingSignals: {
      technicalSignals: [],
      ecosystemSignals: [],
      researchSignals: [],
    },

    regions: company.regions,
  };
}

/**
 * Returns intelligence specifically for a company + talent domain.
 *
 * IMPORTANT:
 * Non-Data-Center domains must never inherit the global
 * company's Data Center intelligence.
 */
export function getCompanyDomainIntelligence(
  companyId: string,
  domainId: TalentDomainId,
): CompanyDomainIntelligence | null {
  const company = getCompanyById(companyId);

  if (!company) {
    return null;
  }

  /*
   * ============================================================
   * REGISTERED DOMAIN INTELLIGENCE
   * ============================================================
   *
   * Domain-specific profiles take precedence over the
   * legacy global company record.
   */
  const registeredIntelligence =
    getRegisteredCompanyDomainIntelligence(
      company.id,
      domainId,
    );

  if (registeredIntelligence) {
    return registeredIntelligence;
  }

  if (domainId === "data-center") {
    return {
      companyId: company.id,
      domainId,

      companyType: company.companyType,
      priority: company.priority,

      targetRoles: company.roles,
      coreTechnologies: company.coreTechnologies,
      certifications: company.certifications,
      conferences: [],

      strategicVendors: company.strategicVendors,

      recruiterNotes: company.recruiterNotes,
      aiPrompt: company.aiPrompt,

      booleanSearch: "",

      sourcingSignals: {
        technicalSignals: company.coreTechnologies,
        ecosystemSignals: company.strategicVendors,
        researchSignals: [],
      },

      regions: company.regions,

      dataCenterTypes: company.dataCenterTypes,
      dataCenterPresence: company.dataCenterPresence,
    };
  }

  /*
   * ============================================================
   * OTHER TALENT DOMAINS
   * ============================================================
   *
   * Do NOT fall back to:
   *
   * company.roles
   * company.coreTechnologies
   * company.certifications
   * company.strategicVendors
   * company.dataCenterTypes
   * company.dataCenterPresence
   *
   * Domain-specific profiles will populate these fields.
   */
  return emptyDomainIntelligence(
    company,
    domainId,
  );
}

/**
 * Return the human-readable label for a talent domain.
 */
export function getTalentDomainLabel(
  domainId: TalentDomainId,
): string {
  const domain = TALENT_DOMAINS.find(
    (item) => item.id === domainId,
  );

  return domain?.label ?? "Company";
}
