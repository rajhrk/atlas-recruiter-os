import type {
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import {
  verifyTechnicalTalentCandidate,
} from "@/lib/technicalTalent/technicalTalentCandidateVerifier";

import type {
  TechnicalTalentEnrichmentPatch,
  TechnicalTalentEnrichmentResult,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichment";

/**
 * Atlas Recruiter OS
 *
 * Technical Talent Enrichment Merger
 *
 * This module is responsible for applying trusted enrichment
 * results to an existing Atlas candidate.
 *
 * Important boundaries:
 *
 * - Never creates a new candidate.
 * - Never changes candidate identity.
 * - Never changes recruiter workflow state.
 * - Never changes recruiter notes.
 * - Never calculates or overwrites final fit score.
 * - Never invents evidence.
 *
 * Enrichment can add evidence-backed information and Atlas
 * recalculates verification from the resulting evidence.
 */

function normalizeString(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function mergeStrings(
  existing?: string[],
  incoming?: string[],
): string[] | undefined {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  if (
    combined.length === 0
  ) {
    return undefined;
  }

  const seen =
    new Set<string>();

  const result: string[] =
    [];

  for (const value of combined) {
    const trimmed =
      value.trim();

    if (!trimmed) {
      continue;
    }

    const key =
      normalizeString(
        trimmed,
      );

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function mergeNamedItems<
  T extends {
    name: string;
  },
>(
  existing?: T[],
  incoming?: T[],
): T[] | undefined {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  if (
    combined.length === 0
  ) {
    return undefined;
  }

  const seen =
    new Set<string>();

  const result: T[] =
    [];

  for (const item of combined) {
    const key =
      normalizeString(
        item.name,
      );

    if (
      !key ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

function stableObjectKey(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(
      value,
    );
  }

  if (
    Array.isArray(value)
  ) {
    return `[${value
      .map(stableObjectKey)
      .sort()
      .join(",")}]`;
  }

  const object =
    value as Record<
      string,
      unknown
    >;

  return `{${Object.keys(object)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableObjectKey(
          object[key],
        )}`,
    )
    .join(",")}}`;
}

function mergeObjects<T>(
  existing?: T[],
  incoming?: T[],
): T[] | undefined {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  if (
    combined.length === 0
  ) {
    return undefined;
  }

  const seen =
    new Set<string>();

  const result: T[] =
    [];

  for (const item of combined) {
    const key =
      stableObjectKey(
        item,
      );

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

function mergeEvidence(
  candidate: TechnicalTalentDiscoveryRecord,
  results: TechnicalTalentEnrichmentResult[],
): TechnicalTalentDiscoveryRecord["evidence"] {
  const combined = [
    ...(candidate.evidence ?? []),
    ...results.flatMap(
      (result) =>
        result.evidence ?? [],
    ),
  ];

  const seen =
    new Set<string>();

  const evidence =
    [];

  for (const item of combined) {
    const key =
      item.id ||
      stableObjectKey(
        item,
      );

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    evidence.push(item);
  }

  return evidence;
}

/**
 * Apply one or more enrichment results to a candidate.
 */
export function mergeTechnicalTalentEnrichment(
  candidate: TechnicalTalentDiscoveryRecord,
  results: TechnicalTalentEnrichmentResult[],
): TechnicalTalentDiscoveryRecord {
  const validResults =
    results.filter(
      (result) =>
        result.candidateId ===
        candidate.id,
    );

  if (
    validResults.length === 0
  ) {
    return candidate;
  }

  const patch =
    validResults.reduce<TechnicalTalentEnrichmentPatch>(
      (
        merged,
        result,
      ) => ({
        ...merged,
        ...(result.patch ?? {}),
      }),
      {},
    );

  /*
   * Existing candidate identity/profile information wins.
   *
   * Enrichment only fills missing scalar fields.
   */
  const enriched: TechnicalTalentDiscoveryRecord =
    {
      ...candidate,

      headline:
        candidate.headline ||
        patch.headline,

      normalizedRole:
        candidate.normalizedRole ||
        patch.normalizedRole,

      roleFamily:
        candidate.roleFamily ||
        patch.roleFamily,

      talentType:
        candidate.talentType ||
        patch.talentType,

      seniority:
        candidate.seniority ||
        patch.seniority,

      location:
        candidate.location ||
        patch.location,

      city:
        candidate.city ||
        patch.city,

      country:
        candidate.country ||
        patch.country,

      primaryDomain:
        candidate.primaryDomain ||
        patch.primaryDomain,

      secondaryDomains:
        mergeStrings(
          candidate.secondaryDomains,
          patch.secondaryDomains,
        ) as TechnicalTalentDiscoveryRecord["secondaryDomains"],

      skills:
        mergeNamedItems(
          candidate.skills,
          patch.skills,
        ) ?? candidate.skills,

      technologies:
        mergeNamedItems(
          candidate.technologies,
          patch.technologies,
        ) ?? candidate.technologies,

      affiliations:
        mergeObjects(
          candidate.affiliations,
          patch.affiliations,
        ),

      publications:
        mergeObjects(
          candidate.publications,
          patch.publications,
        ),

      patents:
        mergeObjects(
          candidate.patents,
          patch.patents,
        ),

      repositories:
        mergeObjects(
          candidate.repositories,
          patch.repositories,
        ),

      conferences:
        mergeObjects(
          candidate.conferences,
          patch.conferences,
        ),

      researchAreas:
        mergeStrings(
          candidate.researchAreas,
          patch.researchAreas,
        ),

      sourcingSignals:
        mergeObjects(
          candidate.sourcingSignals,
          patch.sourcingSignals,
        ),

      evidence:
        mergeEvidence(
          candidate,
          validResults,
        ),

      /*
       * Explicitly preserved Atlas-owned fields.
       *
       * These assignments make the boundary obvious even though
       * the spread above already preserves them.
       */
      id:
        candidate.id,

      sourceRecordIds:
        candidate.sourceRecordIds,

      approvalStatus:
        candidate.approvalStatus,

      recruiterNotes:
        candidate.recruiterNotes,

      fitScore:
        candidate.fitScore,
    };

  /*
   * Verification is Atlas-owned.
   *
   * Because enrichment may add evidence, the existing verification
   * result may now be stale. Recalculate it from the merged evidence.
   */
  enriched.verification =
    verifyTechnicalTalentCandidate(
      enriched,
    );

  return enriched;
}

/**
 * Convenience helper for applying one enrichment result.
 */
export function applyTechnicalTalentEnrichment(
  candidate: TechnicalTalentDiscoveryRecord,
  result: TechnicalTalentEnrichmentResult,
): TechnicalTalentDiscoveryRecord {
  return mergeTechnicalTalentEnrichment(
    candidate,
    [result],
  );
}
