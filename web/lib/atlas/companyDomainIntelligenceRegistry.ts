import type { CompanyDomainIntelligence } from "@/types/companyDomainIntelligence";
import type { TalentDomainId } from "@/lib/atlas/talentDomains";

import {
  META_AI_ML_INTELLIGENCE,
} from "@/data/atlas/companyDomainIntelligence/meta";

import {
  META_ROBOTICS_INTELLIGENCE,
} from "@/data/atlas/companyDomainIntelligence/metaRobotics";

import {
  META_HARDWARE_INTELLIGENCE,
} from "@/data/atlas/companyDomainIntelligence/metaHardware";

/**
 * Central registry for domain-specific company intelligence.
 *
 * Key format:
 *
 *   companyId:domainId
 *
 * Example:
 *
 *   meta:ai-ml
 *   meta:robotics
 *   meta:hardware
 *
 * Data Center remains backed by the existing company master
 * until its domain profile is migrated.
 */
const COMPANY_DOMAIN_INTELLIGENCE = new Map<
  string,
  CompanyDomainIntelligence
>([
  [
    "meta:ai-ml",
    META_AI_ML_INTELLIGENCE,
  ],
  [
    "meta:robotics",
    META_ROBOTICS_INTELLIGENCE,
  ],
  [
    "meta:hardware",
    META_HARDWARE_INTELLIGENCE,
  ],
]);

export function getRegisteredCompanyDomainIntelligence(
  companyId: string,
  domainId: TalentDomainId,
): CompanyDomainIntelligence | null {
  return (
    COMPANY_DOMAIN_INTELLIGENCE.get(
      `${companyId}:${domainId}`,
    ) ?? null
  );
}

export function hasRegisteredCompanyDomainIntelligence(
  companyId: string,
  domainId: TalentDomainId,
): boolean {
  return COMPANY_DOMAIN_INTELLIGENCE.has(
    `${companyId}:${domainId}`,
  );
}
