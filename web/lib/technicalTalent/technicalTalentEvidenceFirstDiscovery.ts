import {
  orchestrateTechnicalTalentDiscovery,
} from "@/lib/technicalTalent/technicalTalentDiscoveryOrchestrator";

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentOrchestrationOptions,
  TechnicalTalentOrchestrationResult,
  TechnicalTalentSourceExecution,
} from "@/lib/technicalTalent/technicalTalentDiscoveryOrchestrator";

/**
 * Atlas Recruiter OS
 * Evidence-first technical talent discovery.
 *
 * The discovery contract remains source-neutral, but candidates
 * returned by this layer must have a traceable evidence foundation.
 *
 * This implements five principles:
 * 1. Evidence-first discovery
 * 2. Technical ecosystem maps
 * 3. Evidence-based confidence
 * 4. Evidence gates
 * 5. Source-bias auditing
 */

export interface TechnicalTalentEvidenceGatePolicy {
  /** Reject records with no evidence. */
  minimumEvidenceItems?: number;

  /** Reject records supported by fewer than N independent sources. */
  minimumIndependentSources?: number;

  /** Reject records whose strongest evidence is below this confidence. */
  minimumEvidenceConfidence?: DiscoveryConfidence;

  /** Keep accepted records but flag evidence without a source date. */
  requireDatedEvidence?: boolean;

  /** Require at least one technical claim to have direct evidence. */
  requireTechnicalClaimEvidence?: boolean;
}

export interface TechnicalTalentEvidenceClaim {
  claim: string;

  category:
    | "Identity"
    | "Role"
    | "Skill"
    | "Technology"
    | "Research"
    | "Repository"
    | "Affiliation"
    | "Other";

  evidenceIds: string[];

  sources: DiscoverySource[];

  confidence: DiscoveryConfidence;

  evidenceDate?: string;

  explanation: string;
}

export interface TechnicalTalentEvidenceProfile {
  candidateId: string;

  claims: TechnicalTalentEvidenceClaim[];

  supportedClaimCount: number;

  unsupportedClaimCount: number;

  evidenceCount: number;

  independentSourceCount: number;

  evidenceScore: number;

  assessedAt: string;
}

export type TechnicalTalentEvidenceGateStatus =
  | "Passed"
  | "Review"
  | "Blocked";

export interface TechnicalTalentEvidenceGateResult {
  candidateId: string;

  status: TechnicalTalentEvidenceGateStatus;

  eligible: boolean;

  evidenceCount: number;

  independentSourceCount: number;

  strongestEvidenceConfidence: DiscoveryConfidence | "None";

  datedEvidenceCount: number;

  unsupportedClaimCount: number;

  warnings: string[];

  evaluatedAt: string;
}

export interface TechnicalTalentSourceCoverage {
  source: DiscoverySource;

  requested: boolean;

  successful: boolean;

  recordCount: number;

  evidenceCount: number;

  capabilities: string[];

  warnings: string[];
}

export interface TechnicalTalentSourceBiasAudit {
  sourcesRequested: DiscoverySource[];

  sourcesSuccessful: DiscoverySource[];

  sourcesFailed: DiscoverySource[];

  coverage: TechnicalTalentSourceCoverage[];

  riskLevel: "Low" | "Medium" | "High";

  risks: string[];

  missingCoverage: string[];

  searchedAt: string;
}

export type TechnicalTalentEcosystemNodeType =
  | "Skill"
  | "Technology"
  | "Repository"
  | "Candidate";

export type TechnicalTalentEcosystemEdgeType =
  | "demonstrates"
  | "uses"
  | "contributes-to"
  | "implements";

export interface TechnicalTalentEcosystemNode {
  id: string;

  type: TechnicalTalentEcosystemNodeType;

  label: string;

  candidateId?: string;

  evidenceIds?: string[];
}

export interface TechnicalTalentEcosystemEdge {
  id: string;

  source: string;

  target: string;

  type: TechnicalTalentEcosystemEdgeType;

  evidenceIds: string[];
}

export interface TechnicalTalentEcosystemMap {
  nodes: TechnicalTalentEcosystemNode[];

  edges: TechnicalTalentEcosystemEdge[];

  candidateCount: number;

  skillCount: number;

  technologyCount: number;

  repositoryCount: number;

  generatedAt: string;
}

export interface TechnicalTalentEvidenceFirstDiscoveryResult
  extends TechnicalTalentOrchestrationResult {
  evidenceProfiles: TechnicalTalentEvidenceProfile[];

  evidenceGates: TechnicalTalentEvidenceGateResult[];

  blockedCandidateCount: number;

  evidenceGatePolicy: Required<TechnicalTalentEvidenceGatePolicy>;

  ecosystemMap: TechnicalTalentEcosystemMap;

  sourceBiasAudit: TechnicalTalentSourceBiasAudit;

  evidenceFirst: true;
}

const CONFIDENCE_RANK: Record<DiscoveryConfidence, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  "Very High": 4,
};

const DEFAULT_POLICY: Required<TechnicalTalentEvidenceGatePolicy> = {
  minimumEvidenceItems: 1,
  minimumIndependentSources: 1,
  minimumEvidenceConfidence: "Medium",
  requireDatedEvidence: false,
  requireTechnicalClaimEvidence: true,
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function evidenceConfidence(
  evidence: DiscoveryEvidence[],
): DiscoveryConfidence | "None" {
  if (evidence.length === 0) {
    return "None";
  }

  return evidence.reduce<DiscoveryConfidence>(
    (highest, item) =>
      CONFIDENCE_RANK[item.confidence] >
      CONFIDENCE_RANK[highest]
        ? item.confidence
        : highest,
    "Low",
  );
}

function findEvidenceForClaim(
  claim: string,
  evidence: DiscoveryEvidence[],
): DiscoveryEvidence[] {
  const normalizedClaim = normalize(claim);

  return evidence.filter((item) => {
    if (
      item.supports?.some(
        (supportedClaim) =>
          normalize(supportedClaim) === normalizedClaim ||
          normalize(supportedClaim).includes(normalizedClaim) ||
          normalizedClaim.includes(normalize(supportedClaim)),
      )
    ) {
      return true;
    }

    const searchable = normalize(
      [
        item.title,
        item.description,
        item.relevance,
        item.publisher,
        item.organization,
      ]
        .filter(Boolean)
        .join(" "),
    );

    return searchable.includes(normalizedClaim);
  });
}

function createClaim(
  candidate: TechnicalTalentDiscoveryRecord,
  claim: string,
  category: TechnicalTalentEvidenceClaim["category"],
): TechnicalTalentEvidenceClaim {
  const matchedEvidence = findEvidenceForClaim(
    claim,
    candidate.evidence ?? [],
  );

  const confidence = evidenceConfidence(matchedEvidence);
  const evidenceDate = matchedEvidence
    .map((item) => item.date)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return {
    claim,
    category,
    evidenceIds: matchedEvidence.map((item) => item.id),
    sources: uniqueStrings(
      matchedEvidence.map((item) => item.source),
    ) as DiscoverySource[],
    confidence,
    evidenceDate,
    explanation:
      matchedEvidence.length > 0
        ? `${claim} is supported by ${matchedEvidence.length} evidence item${matchedEvidence.length === 1 ? "" : "s"} from ${uniqueStrings(matchedEvidence.map((item) => item.source)).join(", ")}.`
        : `${claim} is present in the normalized candidate record but no directly linked evidence was found.`,
  };
}

function buildClaims(
  candidate: TechnicalTalentDiscoveryRecord,
): TechnicalTalentEvidenceClaim[] {
  const claims: TechnicalTalentEvidenceClaim[] = [];

  claims.push(
    createClaim(candidate, candidate.name, "Identity"),
  );

  if (candidate.normalizedRole) {
    claims.push(
      createClaim(candidate, candidate.normalizedRole, "Role"),
    );
  }

  for (const skill of candidate.skills) {
    claims.push(
      createClaim(candidate, skill.name, "Skill"),
    );
  }

  for (const technology of candidate.technologies) {
    claims.push(
      createClaim(candidate, technology.name, "Technology"),
    );
  }

  for (const researchArea of candidate.researchAreas ?? []) {
    claims.push(
      createClaim(candidate, researchArea, "Research"),
    );
  }

  for (const repository of candidate.repositories ?? []) {
    claims.push(
      createClaim(candidate, repository.repository, "Repository"),
    );
  }

  for (const affiliation of candidate.affiliations ?? []) {
    claims.push(
      createClaim(candidate, affiliation.organization, "Affiliation"),
    );
  }

  return claims;
}

function calculateEvidenceScore(
  candidate: TechnicalTalentDiscoveryRecord,
): number {
  const evidence = candidate.evidence ?? [];

  if (evidence.length === 0) {
    return 0;
  }

  const confidencePoints = evidence.reduce(
    (total, item) => total + CONFIDENCE_RANK[item.confidence] * 10,
    0,
  );

  const sourceBonus = Math.min(
    new Set(evidence.map((item) => item.source)).size * 10,
    30,
  );

  const datedBonus = Math.min(
    evidence.filter((item) => Boolean(item.date)).length * 2,
    20,
  );

  return Math.min(
    100,
    confidencePoints + sourceBonus + datedBonus,
  );
}

function buildEvidenceProfile(
  candidate: TechnicalTalentDiscoveryRecord,
): TechnicalTalentEvidenceProfile {
  const claims = buildClaims(candidate);
  const supportedClaimCount = claims.filter(
    (claim) => claim.evidenceIds.length > 0,
  ).length;

  return {
    candidateId: candidate.id,
    claims,
    supportedClaimCount,
    unsupportedClaimCount: claims.length - supportedClaimCount,
    evidenceCount: candidate.evidence.length,
    independentSourceCount: new Set(
      candidate.evidence.map((item) => item.source),
    ).size,
    evidenceScore: calculateEvidenceScore(candidate),
    assessedAt: new Date().toISOString(),
  };
}

function evaluateEvidenceGate(
  candidate: TechnicalTalentDiscoveryRecord,
  profile: TechnicalTalentEvidenceProfile,
  policy: Required<TechnicalTalentEvidenceGatePolicy>,
): TechnicalTalentEvidenceGateResult {
  const evidence = candidate.evidence ?? [];
  const independentSourceCount = new Set(
    evidence.map((item) => item.source),
  ).size;
  const datedEvidenceCount = evidence.filter(
    (item) => Boolean(item.date),
  ).length;
  const strongestEvidenceConfidence = evidenceConfidence(evidence);
  const warnings: string[] = [];

  if (evidence.length < policy.minimumEvidenceItems) {
    warnings.push(
      `Evidence gate requires at least ${policy.minimumEvidenceItems} evidence item${policy.minimumEvidenceItems === 1 ? "" : "s"}.`,
    );
  }

  if (independentSourceCount < policy.minimumIndependentSources) {
    warnings.push(
      `Evidence gate requires evidence from at least ${policy.minimumIndependentSources} independent source${policy.minimumIndependentSources === 1 ? "" : "s"}.`,
    );
  }

  if (
    strongestEvidenceConfidence !== "None" &&
    CONFIDENCE_RANK[strongestEvidenceConfidence] <
      CONFIDENCE_RANK[policy.minimumEvidenceConfidence]
  ) {
    warnings.push(
      `Strongest evidence confidence is ${strongestEvidenceConfidence}; minimum is ${policy.minimumEvidenceConfidence}.`,
    );
  }

  if (
    policy.requireTechnicalClaimEvidence &&
    profile.claims.some(
      (claim) =>
        ["Skill", "Technology", "Repository"].includes(claim.category) &&
        claim.evidenceIds.length === 0,
    )
  ) {
    warnings.push(
      "One or more technical claims lack directly linked evidence.",
    );
  }

  if (
    policy.requireDatedEvidence &&
    datedEvidenceCount < evidence.length
  ) {
    warnings.push(
      `${evidence.length - datedEvidenceCount} evidence item${evidence.length - datedEvidenceCount === 1 ? " is" : "s are"} missing a source date.`,
    );
  } else if (datedEvidenceCount < evidence.length) {
    warnings.push(
      `${evidence.length - datedEvidenceCount} evidence item${evidence.length - datedEvidenceCount === 1 ? " is" : "s are"} missing a source date; confidence should be treated cautiously.`,
    );
  }

  const hardGateWarnings = warnings.filter((warning) =>
    warning.startsWith("Evidence gate") ||
    warning.startsWith("Strongest evidence") ||
    warning.startsWith("One or more technical"),
  );

  const eligible = hardGateWarnings.length === 0;

  const status: TechnicalTalentEvidenceGateStatus = eligible
    ? warnings.length > 0
      ? "Review"
      : "Passed"
    : "Blocked";

  return {
    candidateId: candidate.id,
    status,
    eligible,
    evidenceCount: evidence.length,
    independentSourceCount,
    strongestEvidenceConfidence,
    datedEvidenceCount,
    unsupportedClaimCount: profile.unsupportedClaimCount,
    warnings,
    evaluatedAt: new Date().toISOString(),
  };
}

function buildSourceBiasAudit(
  result: TechnicalTalentOrchestrationResult,
): TechnicalTalentSourceBiasAudit {
  const coverage = result.sourcesRequested.map((source) => {
    const execution = result.executions.find(
      (item) => item.source === source,
    );
    const adapter = technicalTalentSourceRegistry.get(source);
    const capabilities = adapter?.config.capabilities ?? {};

    return {
      source,
      requested: true,
      successful: result.sourcesSuccessful.includes(source),
      recordCount: execution?.result?.records.length ?? 0,
      evidenceCount: execution?.result?.evidence.length ?? 0,
      capabilities: Object.entries(capabilities)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name),
      warnings: [
        ...(execution?.result?.warnings ?? []),
        ...(execution?.error ? [execution.error] : []),
      ],
    };
  });

  const risks: string[] = [];
  const missingCoverage: string[] = [];

  if (result.sourcesFailed.length > 0) {
    risks.push(
      `Source failure may bias the candidate pool: ${result.sourcesFailed.join(", ")}.`,
    );
  }

  if (result.sourcesSuccessful.length === 1) {
    risks.push(
      `Only one source succeeded (${result.sourcesSuccessful[0]}), creating single-source bias.`,
    );
  }

  for (const item of coverage) {
    if (item.successful && item.evidenceCount === 0) {
      risks.push(
        `${item.source} returned records but no evidence items.`,
      );
    }
  }

  if ((result.query.researchAreas?.length ?? 0) > 0) {
    for (const item of coverage) {
      if (!item.capabilities.includes("publications") && !item.capabilities.includes("researchProjects")) {
        missingCoverage.push(
          `${item.source} does not advertise publication or research-project coverage.`,
        );
      }
    }
  }

  if ((result.query.technologies?.length ?? 0) > 0) {
    for (const item of coverage) {
      if (!item.capabilities.includes("technologies") && !item.capabilities.includes("technicalProfile")) {
        missingCoverage.push(
          `${item.source} does not advertise technical-profile or technology coverage.`,
        );
      }
    }
  }

  if ((result.query.companies?.length ?? 0) > 0) {
    for (const item of coverage) {
      if (!item.capabilities.includes("employment")) {
        missingCoverage.push(
          `${item.source} does not advertise employment coverage.`,
        );
      }
    }
  }

  const riskLevel: TechnicalTalentSourceBiasAudit["riskLevel"] =
    risks.length >= 2
      ? "High"
      : risks.length === 1 || missingCoverage.length > 0
        ? "Medium"
        : "Low";

  return {
    sourcesRequested: result.sourcesRequested,
    sourcesSuccessful: result.sourcesSuccessful,
    sourcesFailed: result.sourcesFailed,
    coverage,
    riskLevel,
    risks: uniqueStrings(risks),
    missingCoverage: uniqueStrings(missingCoverage),
    searchedAt: new Date().toISOString(),
  };
}

function addNode(
  nodes: Map<string, TechnicalTalentEcosystemNode>,
  node: TechnicalTalentEcosystemNode,
): void {
  const existing = nodes.get(node.id);

  if (!existing) {
    nodes.set(node.id, node);
    return;
  }

  nodes.set(node.id, {
    ...existing,
    evidenceIds: uniqueStrings([
      ...(existing.evidenceIds ?? []),
      ...(node.evidenceIds ?? []),
    ]),
  });
}

function addEdge(
  edges: Map<string, TechnicalTalentEcosystemEdge>,
  edge: TechnicalTalentEcosystemEdge,
): void {
  const existing = edges.get(edge.id);

  if (!existing) {
    edges.set(edge.id, edge);
    return;
  }

  edges.set(edge.id, {
    ...existing,
    evidenceIds: uniqueStrings([
      ...existing.evidenceIds,
      ...edge.evidenceIds,
    ]),
  });
}

function buildEcosystemMap(
  records: TechnicalTalentDiscoveryRecord[],
): TechnicalTalentEcosystemMap {
  const nodes = new Map<string, TechnicalTalentEcosystemNode>();
  const edges = new Map<string, TechnicalTalentEcosystemEdge>();

  for (const candidate of records) {
    const candidateId = `candidate:${candidate.id}`;

    addNode(nodes, {
      id: candidateId,
      type: "Candidate",
      label: candidate.name,
      candidateId: candidate.id,
      evidenceIds: candidate.evidence.map((item) => item.id),
    });

    for (const skill of candidate.skills) {
      const skillId = `skill:${normalize(skill.normalizedName ?? skill.name)}`;
      addNode(nodes, {
        id: skillId,
        type: "Skill",
        label: skill.name,
        evidenceIds: skill.evidenceIds,
      });
      addEdge(edges, {
        id: `${candidateId}->${skillId}:demonstrates`,
        source: candidateId,
        target: skillId,
        type: "demonstrates",
        evidenceIds: skill.evidenceIds ?? [],
      });
    }

    for (const technology of candidate.technologies) {
      const technologyId = `technology:${normalize(technology.normalizedName ?? technology.name)}`;
      addNode(nodes, {
        id: technologyId,
        type: "Technology",
        label: technology.name,
        evidenceIds: technology.evidenceIds,
      });
      addEdge(edges, {
        id: `${candidateId}->${technologyId}:uses`,
        source: candidateId,
        target: technologyId,
        type: "uses",
        evidenceIds: technology.evidenceIds ?? [],
      });
    }

    for (const repository of candidate.repositories ?? []) {
      const repositoryId = `repository:${repository.repository}`;
      addNode(nodes, {
        id: repositoryId,
        type: "Repository",
        label: repository.repository,
        candidateId: candidate.id,
        evidenceIds: repository.evidenceId ? [repository.evidenceId] : [],
      });
      addEdge(edges, {
        id: `${repositoryId}->${candidateId}:contributes-to`,
        source: repositoryId,
        target: candidateId,
        type: "contributes-to",
        evidenceIds: repository.evidenceId ? [repository.evidenceId] : [],
      });

      for (const technology of repository.technologies ?? []) {
        const technologyId = `technology:${normalize(technology)}`;
        addNode(nodes, {
          id: technologyId,
          type: "Technology",
          label: technology,
        });
        addEdge(edges, {
          id: `${technologyId}->${repositoryId}:implements`,
          source: technologyId,
          target: repositoryId,
          type: "implements",
          evidenceIds: repository.evidenceId ? [repository.evidenceId] : [],
        });
      }
    }
  }

  const nodeList = Array.from(nodes.values());

  return {
    nodes: nodeList,
    edges: Array.from(edges.values()),
    candidateCount: nodeList.filter((node) => node.type === "Candidate").length,
    skillCount: nodeList.filter((node) => node.type === "Skill").length,
    technologyCount: nodeList.filter((node) => node.type === "Technology").length,
    repositoryCount: nodeList.filter((node) => node.type === "Repository").length,
    generatedAt: new Date().toISOString(),
  };
}

function applyEvidenceFirstRanking(
  records: TechnicalTalentDiscoveryRecord[],
  profiles: TechnicalTalentEvidenceProfile[],
): TechnicalTalentDiscoveryRecord[] {
  const profileById = new Map(
    profiles.map((profile) => [profile.candidateId, profile]),
  );

  return [...records].sort((left, right) => {
    const evidenceDifference =
      (profileById.get(right.id)?.evidenceScore ?? 0) -
      (profileById.get(left.id)?.evidenceScore ?? 0);

    if (evidenceDifference !== 0) {
      return evidenceDifference;
    }

    return (
      (right.fitScore?.overall ?? 0) -
      (left.fitScore?.overall ?? 0)
    );
  });
}

export async function orchestrateEvidenceFirstTechnicalTalentDiscovery(
  query: TechnicalTalentDiscoveryQuery = {},
  options: TechnicalTalentOrchestrationOptions & {
    evidenceGatePolicy?: TechnicalTalentEvidenceGatePolicy;
  } = {},
): Promise<TechnicalTalentEvidenceFirstDiscoveryResult> {
  const baseResult = await orchestrateTechnicalTalentDiscovery(
    query,
    options,
  );

  const evidenceGatePolicy: Required<TechnicalTalentEvidenceGatePolicy> = {
    ...DEFAULT_POLICY,
    ...(options.evidenceGatePolicy ?? {}),
  };

  const evidenceProfiles = baseResult.records.map(buildEvidenceProfile);
  const evidenceGates = baseResult.records.map((candidate, index) =>
    evaluateEvidenceGate(
      candidate,
      evidenceProfiles[index],
      evidenceGatePolicy,
    ),
  );

  const gateById = new Map(
    evidenceGates.map((gate) => [gate.candidateId, gate]),
  );

  const eligibleRecords = baseResult.records.filter(
    (record) => gateById.get(record.id)?.eligible,
  );

  const rankedRecords = applyEvidenceFirstRanking(
    eligibleRecords,
    evidenceProfiles,
  );

  const evidence = rankedRecords.flatMap((record) => record.evidence);
  const evidenceFirstRecords = rankedRecords.slice(
    Math.max(options.offset ?? 0, 0),
    Math.max(options.offset ?? 0, 0) + Math.max(options.limit ?? 50, 1),
  );

  return {
    ...baseResult,
    records: evidenceFirstRecords,
    total: rankedRecords.length,
    evidence,
    evidenceProfiles,
    evidenceGates,
    blockedCandidateCount: baseResult.records.length - eligibleRecords.length,
    evidenceGatePolicy,
    ecosystemMap: buildEcosystemMap(rankedRecords),
    sourceBiasAudit: buildSourceBiasAudit(baseResult),
    evidenceFirst: true,
  };
}
