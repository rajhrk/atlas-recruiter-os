// ============================================================
// Atlas Recruiter OS
// Technical Talent Discovery Orchestrator
//
// Coordinates multiple technical talent source adapters.
//
// Responsibilities:
// - Build source requests
// - Query registered sources
// - Run independent sources in parallel
// - Merge normalized records
// - Deduplicate records
// - Merge source evidence
// - Return a unified discovery result
//
// This layer deliberately does NOT:
// - perform AI matching
// - make hiring decisions
// - approve candidates
// - invent evidence
// ============================================================

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import {
  resolveTechnicalTalentIdentity,
} from "@/lib/technicalTalent/technicalTalentIdentityResolver";
import {
  scoreTechnicalTalentCandidate,
} from "@/lib/technicalTalent/technicalTalentFitScorer";

import {
  verifyTechnicalTalentCandidate,
} from "@/lib/technicalTalent/technicalTalentCandidateVerifier";
import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceEvidence,
  TechnicalTalentSourceResult,
  TechnicalTalentSourceQuery,
} from "@/types/technicalTalentDiscoverySource";

/**
 * A single source execution result.
 */
export interface TechnicalTalentSourceExecution {
  source: DiscoverySource;

  result?: TechnicalTalentSourceResult;

  error?: string;

  durationMs: number;
}

/**
 * Unified result returned by the orchestrator.
 */
export interface TechnicalTalentOrchestrationResult {
  query: TechnicalTalentDiscoveryQuery;

  records: TechnicalTalentDiscoveryRecord[];

  evidence: TechnicalTalentSourceEvidence[];

  total: number;

  /**
   * Number of probable cross-source identity matches
   * that require recruiter/manual review.
   */
  unresolvedDuplicates: number;

  sourcesRequested: DiscoverySource[];

  sourcesSuccessful: DiscoverySource[];

  sourcesFailed: DiscoverySource[];

  executions: TechnicalTalentSourceExecution[];

  searchedAt: string;
}

/**
 * Options controlling orchestration behavior.
 */
export interface TechnicalTalentOrchestrationOptions {
  /**
   * Explicit sources to query.
   *
   * When omitted, every registered source is queried.
   */
  sources?: DiscoverySource[];

  /**
   * Maximum number of records returned after
   * deduplication.
   */
  limit?: number;

  /**
   * Number of records to skip after deduplication.
   */
  offset?: number;
}

/**
 * Create the standard source request.
 */
function createSourceRequest(
  query: TechnicalTalentDiscoveryQuery,
  source: DiscoverySource,
): TechnicalTalentSourceQuery {
  return {
    query,
    requestedSource: source,
    requestedAt:
      new Date().toISOString(),
  };
}

/**
 * Determine the best stable identity available for
 * a normalized record.
 *
 * Prefer the Atlas record ID.
 */
function getRecordIdentity(
  record: TechnicalTalentDiscoveryRecord,
): string {
  return (
    record.id ||
    [
      record.name,
      record.normalizedRole,
      record.primaryDomain,
    ]
      .filter(Boolean)
      .join("|")
      .toLowerCase()
  );
}

/**
 * Merge two records representing the same technical
 * talent intelligence entity.
 *
 * The merge is deliberately conservative:
 *
 * - Existing scalar values are retained when available.
 * - Missing values are filled from the incoming record.
 * - Arrays are combined and deduplicated.
 * - No new facts are invented.
 */
function mergeRecords(
  existing: TechnicalTalentDiscoveryRecord,
  incoming: TechnicalTalentDiscoveryRecord,
): TechnicalTalentDiscoveryRecord {
  return {
    ...existing,

    name:
      existing.name ||
      incoming.name,

    headline:
      existing.headline ||
      incoming.headline,

    normalizedRole:
      existing.normalizedRole ||
      incoming.normalizedRole,

    roleFamily:
      existing.roleFamily ||
      incoming.roleFamily,

    talentType:
      existing.talentType ||
      incoming.talentType,

    seniority:
      existing.seniority ||
      incoming.seniority,

    primaryDomain:
      existing.primaryDomain ||
      incoming.primaryDomain,

    sourceRecordIds: Array.from(
      new Set([
        ...(existing.sourceRecordIds ?? []),
        ...(incoming.sourceRecordIds ?? []),
      ]),
    ),

    location:
      existing.location ||
      incoming.location,

    city:
      existing.city ||
      incoming.city,

    country:
      existing.country ||
      incoming.country,

    confidence:
      existing.confidence ||
      incoming.confidence,

    approvalStatus:
      existing.approvalStatus ||
      incoming.approvalStatus,

    secondaryDomains: Array.from(
      new Set([
        ...(existing.secondaryDomains ??
          []),
        ...(incoming.secondaryDomains ??
          []),
      ]),
    ),

    skills: mergeNamedItems(
      existing.skills,
      incoming.skills,
    ),

    technologies: mergeNamedItems(
      existing.technologies,
      incoming.technologies,
    ),

    affiliations: mergeArrays(
      existing.affiliations,
      incoming.affiliations,
    ),

    publications: mergeArrays(
      existing.publications,
      incoming.publications,
    ),

    patents: mergeArrays(
      existing.patents,
      incoming.patents,
    ),

    repositories: mergeArrays(
      existing.repositories,
      incoming.repositories,
    ),

    conferences: mergeArrays(
      existing.conferences,
      incoming.conferences,
    ),

    researchAreas: mergeStringArrays(
      existing.researchAreas,
      incoming.researchAreas,
    ),

    recruiterNotes: mergeStringArrays(
      existing.recruiterNotes,
      incoming.recruiterNotes,
    ),

    sourcingSignals: mergeArrays(
      existing.sourcingSignals,
      incoming.sourcingSignals,
    ),

    /**
     * Evidence is required by the discovery contract.
     * Therefore this must always resolve to an array.
     */
    evidence: mergeRequiredArrays(
      existing.evidence,
      incoming.evidence,
    ),

    fitScore:
      existing.fitScore ||
      incoming.fitScore,
  };
}

/**
 * Merge optional arrays of objects.
 */
function mergeArrays<T>(
  existing?: T[],
  incoming?: T[],
): T[] | undefined {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  if (combined.length === 0) {
    return undefined;
  }

  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of combined) {
    const key = stableObjectKey(item);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

/**
 * Merge required arrays.
 *
 * Unlike mergeArrays(), this function always returns
 * an array because the discovery contract requires one.
 */
function mergeRequiredArrays<T>(
  existing: T[],
  incoming: T[],
): T[] {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of combined) {
    const key = stableObjectKey(item);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

/**
 * Merge arrays containing a `name` property.
 */
function mergeNamedItems<T extends {
  name: string;
}>(
  existing?: T[],
  incoming?: T[],
): T[] {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of combined) {
    const key = item.name
      .trim()
      .toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

/**
 * Merge string arrays.
 */
function mergeStringArrays(
  existing?: string[],
  incoming?: string[],
): string[] | undefined {
  const combined = [
    ...(existing ?? []),
    ...(incoming ?? []),
  ];

  if (combined.length === 0) {
    return undefined;
  }

  return Array.from(
    new Set(
      combined
        .filter(Boolean)
        .map((value) =>
          value.trim(),
        )
        .filter(Boolean),
    ),
  );
}

/**
 * Stable object serialization used for
 * conservative deduplication.
 */
function stableObjectKey(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map(stableObjectKey),
    );
  }

  const object =
    value as Record<
      string,
      unknown
    >;

  const sortedKeys = Object.keys(
    object,
  ).sort();

  return JSON.stringify(
    sortedKeys.reduce<
      Record<string, unknown>
    >((result, key) => {
      result[key] =
        object[key];

      return result;
    }, {}),
  );
}

/**
 * Run one source adapter safely.
 */
async function executeSource(
  adapter: TechnicalTalentDiscoverySourceAdapter,
  query: TechnicalTalentDiscoveryQuery,
): Promise<TechnicalTalentSourceExecution> {
  const startedAt =
    Date.now();

  const source =
    adapter.config.source;

  try {
    const result =
      await adapter.search(
        createSourceRequest(
          query,
          source,
        ),
      );

    return {
      source,

      result,

      durationMs:
        Date.now() - startedAt,
    };
  } catch (error) {
    return {
      source,

      error:
        error instanceof Error
          ? error.message
          : "Unknown source adapter error.",

      durationMs:
        Date.now() - startedAt,
    };
  }
}

/**
 * Resolve which registered adapters should be queried.
 */
function resolveAdapters(
  requestedSources?: DiscoverySource[],
): TechnicalTalentDiscoverySourceAdapter[] {
  const registered =
    technicalTalentSourceRegistry.list();

  if (
    !requestedSources ||
    requestedSources.length === 0
  ) {
    return registered;
  }

  const requested =
    new Set(requestedSources);

  return registered.filter(
    (adapter) =>
      requested.has(
        adapter.config.source,
      ),
  );
}

/**
 * Merge and deduplicate records from multiple
 * source executions.
 */
function mergeSourceRecords(
  executions: TechnicalTalentSourceExecution[],
): TechnicalTalentDiscoveryRecord[] {
  const recordMap =
    new Map<
      string,
      TechnicalTalentDiscoveryRecord
    >();

  for (const execution of executions) {
    if (!execution.result) {
      continue;
    }

    for (const record of execution.result.records) {
      const identity =
        getRecordIdentity(record);

      const existing =
        recordMap.get(identity);

      if (!existing) {
        recordMap.set(
          identity,
          record,
        );

        continue;
      }

      recordMap.set(
        identity,
        mergeRecords(
          existing,
          record,
        ),
      );
    }
  }

  return Array.from(
    recordMap.values(),
  );
}

/**
 * Resolve probable cross-source identities after exact
 * source-record deduplication.
 *
 * This deliberately runs after mergeSourceRecords() so
 * records with an identical stable identity are handled
 * by the existing deterministic merge first.
 *
 * Identity resolution is conservative:
 *
 * - shouldMerge=true  -> merge records
 * - requiresReview=true -> keep separate and count
 * - otherwise -> keep separate
 */
function resolveCrossSourceIdentities(
  records: TechnicalTalentDiscoveryRecord[],
): {
  records: TechnicalTalentDiscoveryRecord[];
  unresolvedDuplicates: number;
} {
  const resolved:
    TechnicalTalentDiscoveryRecord[] =
    [];

  let unresolvedDuplicates =
    0;

  for (const record of records) {
    let mergedRecord =
      record;

    let matchedExisting =
      false;

    for (
      let index = 0;
      index < resolved.length;
      index += 1
    ) {
      const existing =
        resolved[index];

      const identityMatch =
        resolveTechnicalTalentIdentity(
          existing,
          mergedRecord,
        );

      if (
        identityMatch.shouldMerge
      ) {
        mergedRecord =
          mergeRecords(
            existing,
            mergedRecord,
          );

        resolved[index] =
          mergedRecord;

        matchedExisting =
          true;

        break;
      }

      if (
        identityMatch.requiresReview
      ) {
        unresolvedDuplicates +=
          1;
      }
    }

    if (
      !matchedExisting
    ) {
      resolved.push(
        mergedRecord,
      );
    }
  }

  return {
    records:
      resolved,

    unresolvedDuplicates,
  };
}

/**
 * Merge evidence from every successful source.
 */
function mergeSourceEvidence(
  executions: TechnicalTalentSourceExecution[],
): TechnicalTalentSourceEvidence[] {
  const evidenceMap =
    new Map<
      string,
      TechnicalTalentSourceEvidence
    >();

  for (const execution of executions) {
    if (!execution.result) {
      continue;
    }

    for (const evidence of execution.result.evidence) {
      const key = [
        evidence.source,
        evidence.sourceRecordId,
        evidence.externalId,
        evidence.url,
        evidence.title,
      ]
        .filter(Boolean)
        .join("|");

      if (!evidenceMap.has(key)) {
        evidenceMap.set(
          key,
          evidence,
        );
      }
    }
  }

  return Array.from(
    evidenceMap.values(),
  );
}

/**
 * Execute a cross-source technical talent discovery query.
 *
 * All independent source adapters execute in parallel.
 */
export async function orchestrateTechnicalTalentDiscovery(
  query: TechnicalTalentDiscoveryQuery = {},
  options: TechnicalTalentOrchestrationOptions = {},
): Promise<TechnicalTalentOrchestrationResult> {
  const adapters =
    resolveAdapters(
      options.sources,
    );

  const sourcesRequested =
    adapters.map(
      (adapter) =>
        adapter.config.source,
    );

  const executions =
    await Promise.all(
      adapters.map(
        (adapter) =>
          executeSource(
            adapter,
            query,
          ),
      ),
    );

  const exactDeduplicatedRecords =
    mergeSourceRecords(
      executions,
    );

  const identityResolution =
    resolveCrossSourceIdentities(
      exactDeduplicatedRecords,
    );

  const mergedRecords =
  identityResolution.records;

const verifiedRecords =
  mergedRecords.map(
    (record) => {
      const verification =
        verifyTechnicalTalentCandidate(
          record,
        );

      const verifiedRecord = {
        ...record,

        verification,
      };

      return {
        ...verifiedRecord,

        fitScore:
          scoreTechnicalTalentCandidate(
            verifiedRecord,
            query,
          ),
      };
    },
  );

const evidence =
  mergeSourceEvidence(
    executions,
  );

  /**
   * Apply the minimum fit-score threshold after
   * verification and scoring, but before pagination.
   *
   * This ensures low-fit candidates never consume
   * the requested result limit.
   */
  const minimumFitScore =
    query.minimumFitScore !== undefined
      ? Math.min(
          Math.max(
            query.minimumFitScore,
            0,
          ),
          100,
        )
      : undefined;

  const filteredByFitScore =
    minimumFitScore === undefined
      ? verifiedRecords
      : verifiedRecords.filter(
          (record) =>
            (record.fitScore?.overall ?? 0) >=
            minimumFitScore,
        );

  /**
   * Apply the minimum confidence threshold after
   * verification and fit scoring.
   *
   * Confidence is ordered:
   *
   * Low < Medium < High < Very High
   */
  const confidenceRank: Record<
    NonNullable<
      TechnicalTalentDiscoveryRecord["confidence"]
    >,
    number
  > = {
    Low: 1,
    Medium: 2,
    High: 3,
    "Very High": 4,
  };

  const minimumConfidenceRank =
    query.minimumConfidence !== undefined
      ? confidenceRank[
          query.minimumConfidence
        ]
      : undefined;

  const filteredRecords =
    minimumConfidenceRank === undefined
      ? filteredByFitScore
      : filteredByFitScore.filter(
          (record) =>
            record.confidence !== undefined &&
            confidenceRank[
              record.confidence
            ] >= minimumConfidenceRank,
        );

  const offset = Math.max(
    options.offset ?? 0,
    0,
  );

  const limit = Math.max(
    options.limit ?? 50,
    1,
  );

  const records =
    filteredRecords.slice(
      offset,
      offset + limit,
    );

  const sourcesSuccessful =
    executions
      .filter(
        (execution) =>
          Boolean(
            execution.result,
          ),
      )
      .map(
        (execution) =>
          execution.source,
      );

  const sourcesFailed =
    executions
      .filter(
        (execution) =>
          Boolean(
            execution.error,
          ),
      )
      .map(
        (execution) =>
          execution.source,
      );

  return {
    query,

    records,

    evidence,

  total:
  filteredRecords.length,

    unresolvedDuplicates:
      identityResolution.unresolvedDuplicates,

    sourcesRequested,

    sourcesSuccessful,

    sourcesFailed,

    executions,

    searchedAt:
      new Date().toISOString(),
  };
}