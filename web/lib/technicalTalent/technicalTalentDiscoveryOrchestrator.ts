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

import {
  buildTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphBuilder";

import {
  queryTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphQuery";

import {
  rankTechnicalTalentCandidates,
} from "@/lib/graph/technicalTalentCombinedRanking";
import type {
  DiscoveryConfidence,
  DiscoveryMatchReason,
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
  TechnicalTalentGraphMatch,
  TechnicalTalentDiscoveryRanking,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceEvidence,
  TechnicalTalentSourceResult,
  TechnicalTalentSourceQuery,
} from "@/types/technicalTalentDiscoverySource";

import {
  planEvidenceFirstDiscovery,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscovery";

import {
  executeEvidenceFirstDiscovery,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscoveryExecutor";

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

  /**
   * Graph-derived evidence for the candidates returned
   * by the orchestrator.
   */
  graphMatches?: TechnicalTalentGraphMatch[];

  /**
   * Combined fit + graph ranking evidence.
   */
  rankings?: TechnicalTalentDiscoveryRanking[];

  evidence: TechnicalTalentSourceEvidence[];

  total: number;

  /**
   * Number of probable cross-source identity matches
   * that require recruiter/manual review.
   */
  unresolvedDuplicates: number;

  /**
   * Explicit candidate pairs that require identity review.
   */
  identityReviewPairs:
    TechnicalTalentIdentityReviewPair[];

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

  /**
   * Use evidence-first source planning and execution.
   *
   * Opt-in during v1. Legacy parallel source execution
   * remains the default.
   */
  evidenceFirst?: boolean;
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
 * Extract explicit ORCID identities from a normalized
 * discovery record.
 *
 * ORCID is treated as a hard person-level identity boundary.
 * This helper intentionally mirrors the evidence contract
 * rather than depending on resolver internals.
 */
function getRecordOrcidIds(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return Array.from(
    new Set(
      record.evidence
        .map((evidence) => {
          const match =
            evidence.id.match(
              /(?:^|:)orcid:(.+)$/i,
            );

          return match?.[1];
        })
        .filter(
          (
            value,
          ): value is string =>
            Boolean(value),
        )
        .map((value) =>
          value
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\/(?:www\.)?orcid\.org\//, "")
            .replace(/[^a-z0-9]/g, ""),
        )
        .filter(Boolean),
    ),
  );
}

/**
 * Prevent an identity cluster from acquiring conflicting
 * explicit ORCID identities.
 *
 * This is a cluster-level invariant, not merely a pairwise
 * identity rule. It protects against transitive merges:
 *
 * A + B -> merge
 * (A+B) + C -> blocked when C has a conflicting ORCID.
 */
function hasClusterOrcidConflict(
  existing: TechnicalTalentDiscoveryRecord,
  incoming: TechnicalTalentDiscoveryRecord,
): boolean {
  const existingOrcids =
    getRecordOrcidIds(existing);

  const incomingOrcids =
    getRecordOrcidIds(incoming);

  if (
    existingOrcids.length === 0 ||
    incomingOrcids.length === 0
  ) {
    return false;
  }

  return !incomingOrcids.some(
    (orcid) =>
      existingOrcids.includes(orcid),
  );
}

/**
 * Prevent an identity cluster from acquiring a new
 * person-level identity from a source that is already
 * represented by multiple identities in the cluster.
 *
 * A shared ORCID can legitimately bridge two source
 * identities, but it must not make an already-expanded
 * cluster absorb an additional same-source identity.
 *
 * Example:
 *
 *   Cluster:
 *     OpenAlex A + OpenAlex B + ORCID X
 *
 *   Incoming:
 *     OpenAlex C + ORCID X
 *
 *   -> blocked
 *
 * A direct two-record ORCID bridge remains handled by
 * resolveTechnicalTalentIdentity().
 */
function hasClusterSameSourceIdentityConflict(
  existing: TechnicalTalentDiscoveryRecord,
  incoming: TechnicalTalentDiscoveryRecord,
): boolean {
  const getSourceIdentities =
    (
      record: TechnicalTalentDiscoveryRecord,
    ): Map<string, Set<string>> => {
      const result =
        new Map<string, Set<string>>();

      const ids = [
        record.id,
        ...(record.sourceRecordIds ?? []),
      ];

      for (const id of ids) {
        let source:
          | "github"
          | "openalex"
          | undefined;

        if (
          id.startsWith("github:")
        ) {
          source = "github";
        } else if (
          id.startsWith("openalex:")
        ) {
          source = "openalex";
        }

        if (!source) {
          continue;
        }

        const identities =
          result.get(source) ??
          new Set<string>();

        identities.add(id);

        result.set(
          source,
          identities,
        );
      }

      return result;
    };

  const existingIdentities =
    getSourceIdentities(
      existing,
    );

  const incomingIdentities =
    getSourceIdentities(
      incoming,
    );

  for (
    const [
      source,
      incomingSourceIdentities,
    ] of incomingIdentities
  ) {
    const existingSourceIdentities =
      existingIdentities.get(
        source,
      );

    if (
      !existingSourceIdentities ||
      existingSourceIdentities.size === 0
    ) {
      continue;
    }

    const hasNewIdentity =
      Array.from(
        incomingSourceIdentities,
      ).some(
        (identity) =>
          !existingSourceIdentities.has(
            identity,
          ),
      );

    if (!hasNewIdentity) {
      continue;
    }

    /*
     * Once a cluster contains more than one
     * identity from the same source, do not allow
     * another identity from that source to enter
     * through a transitive ORCID match.
     */
    if (
      existingSourceIdentities.size > 1
    ) {
      return true;
    }
  }

  return false;
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
    const key =
      item &&
      typeof item === "object" &&
      "id" in item &&
      typeof (item as { id?: unknown }).id === "string"
        ? (item as { id: string }).id
        : stableObjectKey(item);

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

  /*
   * Deduplicate string signals case-insensitively while
   * preserving the first meaningful display form.
   *
   * Example:
   *
   *   "Imitation Learning"
   *   "imitation learning"
   *
   * becomes:
   *
   *   "Imitation Learning"
   *
   * This is important when merging research signals from
   * multiple publications or discovery sources.
   */
  const normalizedValues =
    new Map<string, string>();

  for (const value of combined) {
    const trimmed =
      value.trim();

    if (!trimmed) {
      continue;
    }

    const normalized =
      trimmed.toLowerCase();

    if (!normalizedValues.has(normalized)) {
      normalizedValues.set(
        normalized,
        trimmed,
      );
    }
  }

  return Array.from(
    normalizedValues.values(),
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
interface TechnicalTalentIdentityReviewPair {
  leftId: string;

  rightId: string;

  score: number;

  confidence: DiscoveryConfidence;

  reasons: DiscoveryMatchReason[];
}

export function resolveCrossSourceIdentities(
  records: TechnicalTalentDiscoveryRecord[],
): {
  records: TechnicalTalentDiscoveryRecord[];

  unresolvedDuplicates: number;

  identityReviewPairs:
    TechnicalTalentIdentityReviewPair[];
} {
  const resolved:
    TechnicalTalentDiscoveryRecord[] =
    [];

  const unresolvedDuplicateIds =
    new Set<string>();

  const identityReviewPairs:
    TechnicalTalentIdentityReviewPair[] =
    [];

  const reviewPairKeys =
    new Set<string>();

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

      /*
       * Cluster-level ORCID boundary.
       *
       * The identity resolver already protects pairwise
       * comparisons, but `existing` may represent a cluster
       * created by an earlier merge. Never allow that cluster
       * to absorb a record carrying a conflicting explicit
       * ORCID.
       */
      if (
        hasClusterOrcidConflict(
          existing,
          mergedRecord,
        )
      ) {
        continue;
      }

      /*
       * Cluster-level same-source identity boundary.
       *
       * A shared ORCID may bridge two direct source
       * identities, but it must not allow an already-expanded
       * cluster to absorb another person-level identity from
       * the same source.
       */
      if (
        hasClusterSameSourceIdentityConflict(
          existing,
          mergedRecord,
        )
      ) {
        continue;
      }

      const identityMatch =
        resolveTechnicalTalentIdentity(
          existing,
          mergedRecord,
        );

      if (
        identityMatch.shouldMerge
      ) {
        unresolvedDuplicateIds.delete(
          existing.id,
        );

        unresolvedDuplicateIds.delete(
          mergedRecord.id,
        );

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
        unresolvedDuplicateIds.add(
          mergedRecord.id,
        );

        unresolvedDuplicateIds.add(
          existing.id,
        );

        const pairIds = [
          existing.id,
          mergedRecord.id,
        ].sort();

        const pairKey =
          pairIds.join("::");

        if (
          !reviewPairKeys.has(
            pairKey,
          )
        ) {
          reviewPairKeys.add(
            pairKey,
          );

          identityReviewPairs.push({
            leftId:
              pairIds[0],

            rightId:
              pairIds[1],

            score:
              identityMatch.score,

            confidence:
              identityMatch.confidence,

            reasons:
              identityMatch.reasons,
          });
        }
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

    unresolvedDuplicates:
      identityReviewPairs.length,

    identityReviewPairs,
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

  let executions: TechnicalTalentSourceExecution[];

  if (options.evidenceFirst) {
    const evidenceFirstPlan =
      planEvidenceFirstDiscovery(
        query,
        adapters,
      );

    const evidenceFirstExecutions =
      await executeEvidenceFirstDiscovery(
        query,
        evidenceFirstPlan.objectives,
        adapters,
      );

    executions =
      evidenceFirstExecutions.map(
        (execution) => ({
          source: execution.source,
          result: execution.result,
          error: execution.error,
          durationMs: execution.durationMs,
        }),
      );
  } else {
    executions =
      await Promise.all(
        adapters.map(
          (adapter) =>
            executeSource(
              adapter,
              query,
            ),
        ),
      );
  }

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

  /**
   * Build graph evidence from every candidate that survived
   * verification, fit filtering, and confidence filtering.
   *
   * Graph ranking intentionally happens before pagination so
   * strong graph evidence can influence the final candidate
   * ordering.
   */
  const graphParts =
    filteredRecords.map(
      (record) =>
        buildTechnicalTalentGraph(
          record,
        ),
    );

  const graphNodes =
    graphParts.flatMap(
      (part) =>
        part.nodes,
    );

  const graphEdges =
    graphParts.flatMap(
      (part) =>
        part.edges,
    );

  const graph = {
    nodes:
      graphNodes.filter(
        (node, index, nodes) =>
          nodes.findIndex(
            (existing) =>
              existing.id ===
                node.id &&
              existing.type ===
                node.type,
          ) === index,
      ),

    edges:
      graphEdges.filter(
        (edge, index, edges) =>
          edges.findIndex(
            (existing) =>
              existing.from ===
                edge.from &&
              existing.to ===
                edge.to &&
              existing.relationship ===
                edge.relationship,
          ) === index,
      ),
  };

  /**
   * Convert recruiter discovery requirements into the
   * graph query contract.
   */
  const graphQuery = {
    skills:
      query.skills,

    technologies:
      query.technologies,

    researchAreas:
      query.researchAreas,

    repositories:
      query.repositories,

    publications:
      query.publications,

    conferences:
      query.conferences,
  };

  const rawGraphMatches =
    queryTechnicalTalentGraph(
      graph,
      graphQuery,
    );

  /**
   * Graph candidate IDs use the canonical
   * candidate:<discovery-id> format.
   *
   * The orchestrator continues exposing the original
   * discovery candidate IDs.
   */
  const graphMatches =
    rawGraphMatches.map(
      (match) => ({
        ...match,

        candidateId:
          match.candidateId.startsWith(
            "candidate:",
          )
            ? match.candidateId.slice(
                "candidate:".length,
              )
            : match.candidateId,
      }),
    );

  const graphMatchByCandidateId =
    new Map(
      graphMatches.map(
        (match) => [
          match.candidateId,
          match,
        ],
      ),
    );

  const requestedGraphSignalCount =
    [
      ...(query.skills ?? []),
      ...(query.technologies ?? []),
      ...(query.researchAreas ?? []),
      ...(query.repositories ?? []),
      ...(query.publications ?? []),
      ...(query.conferences ?? []),
    ].length;

  /**
   * Combine the existing fit score with graph evidence.
   *
   * Existing fit remains 70%.
   * Graph evidence contributes 30%.
   *
   * Graph enrichment was executed against the complete
   * filtered population, so candidates with zero graph
   * matches receive an explicit graph score of zero.
   */
  const combinedRankings =
    rankTechnicalTalentCandidates(
      filteredRecords.map(
        (record) => ({
          candidateId:
            record.id,

          candidateLabel:
            record.name,

          fitScore:
            record.fitScore?.overall ??
            0,

          graphMatch:
            graphMatchByCandidateId.get(
              record.id,
            ),

          graphEvidenceAvailable:
            requestedGraphSignalCount > 0,

          graphMatchRequestedSignalCount:
            requestedGraphSignalCount,
        }),
      ),
    );

  const recordById =
    new Map(
      filteredRecords.map(
        (record) => [
          record.id,
          record,
        ],
      ),
    );

  /**
   * Reorder actual candidate records according to the
   * combined ranking.
   */
  const rankedRecords =
    combinedRankings.map(
      (ranking) => {
        const record =
          recordById.get(
            ranking.candidateId,
          );

        if (!record) {
          throw new Error(
            `Orchestrator ranking referenced unknown candidate: ${ranking.candidateId}`,
          );
        }

        return record;
      },
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
    rankedRecords.slice(
      offset,
      offset + limit,
    );

  const returnedCandidateIds =
    new Set(
      records.map(
        (record) =>
          record.id,
      ),
    );

  const paginatedGraphMatches =
    graphMatches.filter(
      (match) =>
        returnedCandidateIds.has(
          match.candidateId,
        ),
    );

  const paginatedRankings =
    combinedRankings.filter(
      (ranking) =>
        returnedCandidateIds.has(
          ranking.candidateId,
        ),
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

    graphMatches:
      paginatedGraphMatches,

    rankings:
      paginatedRankings,

    evidence,

    total:
      filteredRecords.length,

    unresolvedDuplicates:
      identityResolution.unresolvedDuplicates,

    identityReviewPairs:
      identityResolution.identityReviewPairs,

    sourcesRequested,

    sourcesSuccessful,

    sourcesFailed,

    executions,

    searchedAt:
      new Date().toISOString(),
  };
}