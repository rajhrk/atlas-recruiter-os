// ============================================================
// Atlas Recruiter OS
// Mock Technical Talent Discovery Source
//
// Development/test adapter only.
//
// This adapter lets us validate the source registry and
// discovery pipeline before connecting real external sources.
// ============================================================

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceEvidence,
  TechnicalTalentSourceQuery,
  TechnicalTalentSourceResult,
} from "@/types/technicalTalentDiscoverySource";

import {
  technicalTalentDiscoveryIndex,
} from "@/lib/technicalTalent/technicalTalentDiscoveryIndex";

/**
 * Mock source configuration.
 */
const MOCK_SOURCE_CONFIG = {
  source: "Other" as DiscoverySource,

  name: "Atlas Mock Discovery",

  description:
    "Development source used to validate the Atlas technical talent discovery pipeline.",

  capabilities: {
    identity: true,
    employment: true,
    technicalProfile: true,
    skills: true,
    technologies: true,
    publications: true,
    citations: true,
    patents: true,
    repositories: true,
    openSource: true,
    conferences: true,
    education: true,
    researchProjects: true,
    locations: true,
  },

  enabled: true,
};

/**
 * Convert a normalized Atlas record into source evidence.
 */
function createEvidence(
  record: typeof technicalTalentDiscoveryIndex[number],
): TechnicalTalentSourceEvidence {
  return {
    source: "Other",

    sourceRecordId: record.id,

    externalId: record.id,

    name: record.name,

    headline: record.headline,

    title: record.normalizedRole,

    description:
      record.recruiterNotes?.join(" ") ??
      record.headline,

    organization:
      record.affiliations?.[0]?.organization,

    location:
      record.location ??
      record.affiliations?.[0]?.location,

    rawSignals: [
      ...(record.skills ?? []).map(
        (skill) => skill.name,
      ),

      ...(record.technologies ?? []).map(
        (technology) => technology.name,
      ),

      ...(record.researchAreas ?? []),
    ],

    confidence:
      record.confidence,
  };
}

/**
 * Determine whether a record matches the supplied
 * mock query.
 *
 * The real discovery engine remains the authoritative
 * filtering layer. This adapter intentionally delegates
 * filtering to the existing normalized index behavior
 * by performing lightweight source-side keyword matching.
 */
function matchesMockQuery(
  record: typeof technicalTalentDiscoveryIndex[number],
  query: TechnicalTalentDiscoveryQuery,
): boolean {
  if (
    query.keywords &&
    query.keywords.length > 0
  ) {
    const searchableText = [
      record.name,
      record.headline,
      record.primaryDomain,
      record.roleFamily,
      record.normalizedRole,
      record.talentType,
      record.seniority,

      ...(record.skills ?? []).map(
        (skill) => skill.name,
      ),

      ...(record.technologies ?? []).map(
        (technology) => technology.name,
      ),

      ...(record.researchAreas ?? []),

      ...(record.recruiterNotes ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesAllKeywords =
      query.keywords.every(
        (keyword) =>
          searchableText.includes(
            keyword.toLowerCase().trim(),
          ),
      );

    if (!matchesAllKeywords) {
      return false;
    }
  }

  if (
    query.domains &&
    query.domains.length > 0 &&
    !query.domains.includes(
      record.primaryDomain,
    )
  ) {
    return false;
  }

  if (
    query.talentTypes &&
    query.talentTypes.length > 0 &&
    record.talentType &&
    !query.talentTypes.includes(
      record.talentType,
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Mock source adapter.
 */
export class MockTechnicalTalentSource
  implements TechnicalTalentDiscoverySourceAdapter
{
  readonly config =
    MOCK_SOURCE_CONFIG;

  async search(
    request: TechnicalTalentSourceQuery,
  ): Promise<TechnicalTalentSourceResult> {
    const filteredRecords =
      technicalTalentDiscoveryIndex.filter(
        (record) =>
          matchesMockQuery(
            record,
            request.query,
          ),
      );

    const evidence =
      filteredRecords.map(
        createEvidence,
      );

    return {
      source: this.config.source,

      query: request,

      records: filteredRecords,

      evidence,

      total: filteredRecords.length,

      hasMore: false,

      searchedAt:
        new Date().toISOString(),

      warnings: [
        "Mock source only. Results are derived from Atlas's existing technical talent intelligence and do not represent live external candidate discovery.",
      ],
    };
  }
}

/**
 * Singleton development adapter.
 */
export const mockTechnicalTalentSource =
  new MockTechnicalTalentSource();

/**
 * Helper for constructing a standard source request.
 */
export function createMockTechnicalTalentSourceQuery(
  query: TechnicalTalentDiscoveryQuery = {},
): TechnicalTalentSourceQuery {
  return {
    query,

    requestedSource: "Other",

    requestedAt:
      new Date().toISOString(),
  };
}