// ============================================================
// Atlas Recruiter OS
// Cross-Domain Technical Talent Discovery Index
//
// Combines the existing technical talent intelligence domains
// into one normalized discovery collection.
//
// Supported domains:
// AI / ML
// Robotics
// Hardware / Embedded
// Semiconductor
//
// This is still role intelligence, not real candidate data.
// ============================================================

import { aiMlDomain } from "@/data/technicalTalent/aiMl";
import { roboticsDomain } from "@/data/technicalTalent/robotics";
import { hardwareDomain } from "@/data/technicalTalent/hardware";
import { semiconductorDomain } from "@/data/technicalTalent/semiconductor";

import {
  normalizeTechnicalTalentRoles,
} from "@/lib/technicalTalent/normalizeTechnicalTalent";

import type {
  DiscoveryTechnicalDomain,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

/**
 * Unified normalized technical talent role index.
 *
 * Every record is represented using the shared
 * TechnicalTalentDiscoveryRecord contract.
 */
export const technicalTalentDiscoveryIndex: TechnicalTalentDiscoveryRecord[] =
  normalizeTechnicalTalentRoles({
    aiMl: aiMlDomain,
    robotics: roboticsDomain,
    hardware: hardwareDomain,
    semiconductor: semiconductorDomain,
  });

/**
 * Number of normalized records available.
 */
export const technicalTalentDiscoveryCount =
  technicalTalentDiscoveryIndex.length;

/**
 * Return all normalized technical talent records.
 */
export function getTechnicalTalentDiscoveryIndex(): TechnicalTalentDiscoveryRecord[] {
  return technicalTalentDiscoveryIndex;
}

/**
 * Return records belonging to a specific technical domain.
 */
export function getTechnicalTalentByDomain(
  domain: DiscoveryTechnicalDomain,
): TechnicalTalentDiscoveryRecord[] {
  return technicalTalentDiscoveryIndex.filter(
    (record) => record.primaryDomain === domain,
  );
}

/**
 * Return records matching a normalized role family.
 */
export function getTechnicalTalentByRoleFamily(
  roleFamily: string,
): TechnicalTalentDiscoveryRecord[] {
  const normalizedFamily = roleFamily
    .toLowerCase()
    .trim();

  return technicalTalentDiscoveryIndex.filter(
    (record) =>
      record.roleFamily?.toLowerCase().trim() ===
      normalizedFamily,
  );
}

/**
 * Search normalized role intelligence across domains.
 *
 * This is intentionally simple.
 * The future discovery engine will add:
 *
 * - weighted matching
 * - semantic search
 * - evidence scoring
 * - candidate verification
 * - deduplication
 * - recruiter approval
 */
export function searchTechnicalTalentDiscovery(
  query: string,
): TechnicalTalentDiscoveryRecord[] {
  const normalizedQuery = query
    .toLowerCase()
    .trim();

  if (!normalizedQuery) {
    return technicalTalentDiscoveryIndex;
  }

  return technicalTalentDiscoveryIndex.filter(
    (record) => {
      const searchableText = [
        record.name,
        record.headline,
        record.roleFamily,
        record.normalizedRole,
        record.talentType,
        record.seniority,

        ...record.skills.map(
          (skill) =>
            skill.name,
        ),

        ...record.technologies.map(
          (technology) =>
            technology.name,
        ),

        ...(record.researchAreas ?? []),

        ...(record.recruiterNotes ?? []),

        ...(record.sourcingSignals ?? []).map(
          (signal) =>
            signal.signal,
        ),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedQuery,
      );
    },
  );
}

/**
 * Return the number of records in each domain.
 */
export function getTechnicalTalentDomainCounts(): Record<
  DiscoveryTechnicalDomain,
  number
> {
  return {
    "AI / ML":
      getTechnicalTalentByDomain(
        "AI / ML",
      ).length,

    Robotics:
      getTechnicalTalentByDomain(
        "Robotics",
      ).length,

    "Hardware / Embedded":
      getTechnicalTalentByDomain(
        "Hardware / Embedded",
      ).length,

    Semiconductor:
      getTechnicalTalentByDomain(
        "Semiconductor",
      ).length,
  };
}