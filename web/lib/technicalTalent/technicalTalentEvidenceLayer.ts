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
} from "@/lib/technicalTalent/technicalTalentDiscoveryOrchestrator";

export interface TechnicalTalentEvidenceGatePolicy {
  minimumEvidenceItems: number;
  minimumIndependentSources: number;
  minimumEvidenceConfidence: DiscoveryConfidence;
  requireDatedEvidence: boolean;
  requireTechnicalClaimEvidence: boolean;
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
    | "Affiliation";
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

export interface TechnicalTalentEcosystemNode {
  id: string;
  type: "Skill" | "Technology" | "Repository" | "Candidate";
  label: string;
  candidateId?: string;
  evidenceIds?: string[];
}

export interface TechnicalTalentEcosystemEdge {
  id: string;
  source: string;
  target: string;
  type: "demonstrates" | "uses" | "contributes-to" | "implements";
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
  evidenceGatePolicy: TechnicalTalentEvidenceGatePolicy;
  ecosystemMap: TechnicalTalentEcosystemMap;
  sourceBiasAudit: TechnicalTalentSourceBiasAudit;
  evidenceFirst: true;
}

const RANK: Record<DiscoveryConfidence, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  "Very High": 4,
};

export const DEFAULT_EVIDENCE_GATE_POLICY: TechnicalTalentEvidenceGatePolicy = {
  minimumEvidenceItems: 1,
  minimumIndependentSources: 1,
  minimumEvidenceConfidence: "Medium",
  requireDatedEvidence: false,
  requireTechnicalClaimEvidence: true,
};

function key(value: string): string {
  return value.trim().toLowerCase();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function strongestConfidence(
  evidence: DiscoveryEvidence[],
): DiscoveryConfidence | "None" {
  if (evidence.length === 0) return "None";
  return evidence.reduce<DiscoveryConfidence>(
    (best, item) => RANK[item.confidence] > RANK[best] ? item.confidence : best,
    "Low",
  );
}

function claimEvidence(
  claim: string,
  evidence: DiscoveryEvidence[],
): DiscoveryEvidence[] {
  const normalized = key(claim);
  return evidence.filter((item) =>
    (item.supports ?? []).some((supported) => {
      const value = key(supported);
      return value === normalized || value.includes(normalized) || normalized.includes(value);
    }) ||
    key([item.title, item.description, item.relevance].filter(Boolean).join(" ")).includes(normalized),
  );
}

function makeClaim(
  claim: string,
  category: TechnicalTalentEvidenceClaim["category"],
  evidence: DiscoveryEvidence[],
): TechnicalTalentEvidenceClaim {
  const matched = claimEvidence(claim, evidence);
  const confidence = strongestConfidence(matched);
  const safeConfidence: DiscoveryConfidence = confidence === "None" ? "Low" : confidence;
  const evidenceDate = matched
    .map((item) => item.date)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  return {
    claim,
    category,
    evidenceIds: matched.map((item) => item.id),
    sources: unique(matched.map((item) => item.source)) as DiscoverySource[],
    confidence: safeConfidence,
    evidenceDate,
    explanation: matched.length > 0
      ? `${claim} is supported by ${matched.length} evidence item${matched.length === 1 ? "" : "s"} from ${unique(matched.map((item) => item.source)).join(", ")}.`
      : `${claim} has no directly linked evidence in the current discovery result.`,
  };
}

function buildClaims(record: TechnicalTalentDiscoveryRecord): TechnicalTalentEvidenceClaim[] {
  const claims: TechnicalTalentEvidenceClaim[] = [
    makeClaim(record.name, "Identity", record.evidence),
  ];

  if (record.normalizedRole) {
    claims.push(makeClaim(record.normalizedRole, "Role", record.evidence));
  }

  for (const skill of record.skills) {
    claims.push(makeClaim(skill.name, "Skill", record.evidence));
  }

  for (const technology of record.technologies) {
    claims.push(makeClaim(technology.name, "Technology", record.evidence));
  }

  for (const area of record.researchAreas ?? []) {
    claims.push(makeClaim(area, "Research", record.evidence));
  }

  for (const repository of record.repositories ?? []) {
    claims.push(makeClaim(repository.repository, "Repository", record.evidence));
  }

  for (const affiliation of record.affiliations ?? []) {
    claims.push(makeClaim(affiliation.organization, "Affiliation", record.evidence));
  }

  return claims;
}

function evidenceScore(record: TechnicalTalentDiscoveryRecord): number {
  const evidence = record.evidence ?? [];
  if (evidence.length === 0) return 0;

  const confidence = evidence.reduce(
    (sum, item) => sum + RANK[item.confidence] * 10,
    0,
  );
  const sourceBonus = Math.min(new Set(evidence.map((item) => item.source)).size * 10, 30);
  const dateBonus = Math.min(evidence.filter((item) => Boolean(item.date)).length * 2, 20);

  return Math.min(100, confidence + sourceBonus + dateBonus);
}

function profile(record: TechnicalTalentDiscoveryRecord): TechnicalTalentEvidenceProfile {
  const claims = buildClaims(record);
  const supported = claims.filter((claim) => claim.evidenceIds.length > 0).length;
  const sources = new Set(record.evidence.map((item) => item.source)).size;

  return {
    candidateId: record.id,
    claims,
    supportedClaimCount: supported,
    unsupportedClaimCount: claims.length - supported,
    evidenceCount: record.evidence.length,
    independentSourceCount: sources,
    evidenceScore: evidenceScore(record),
    assessedAt: new Date().toISOString(),
  };
}

function gate(
  record: TechnicalTalentDiscoveryRecord,
  evidenceProfile: TechnicalTalentEvidenceProfile,
  policy: TechnicalTalentEvidenceGatePolicy,
): TechnicalTalentEvidenceGateResult {
  const evidence = record.evidence;
  const sourceCount = new Set(evidence.map((item) => item.source)).size;
  const datedCount = evidence.filter((item) => Boolean(item.date)).length;
  const strongest = strongestConfidence(evidence);
  const warnings: string[] = [];

  if (evidence.length < policy.minimumEvidenceItems) {
    warnings.push(`Evidence gate requires at least ${policy.minimumEvidenceItems} evidence item${policy.minimumEvidenceItems === 1 ? "" : "s"}.`);
  }
  if (sourceCount < policy.minimumIndependentSources) {
    warnings.push(`Evidence gate requires evidence from at least ${policy.minimumIndependentSources} independent source${policy.minimumIndependentSources === 1 ? "" : "s"}.`);
  }
  if (
    strongest !== "None" &&
    RANK[strongest] < RANK[policy.minimumEvidenceConfidence]
  ) {
    warnings.push(`Strongest evidence confidence is ${strongest}; minimum is ${policy.minimumEvidenceConfidence}.`);
  }
  if (
    policy.requireTechnicalClaimEvidence &&
    evidenceProfile.claims.some(
      (claim) => ["Skill", "Technology", "Repository"].includes(claim.category) && claim.evidenceIds.length === 0,
    )
  ) {
    warnings.push("One or more technical claims lack directly linked evidence.");
  }
  if (datedCount < evidence.length) {
    warnings.push(`${evidence.length - datedCount} evidence item${evidence.length - datedCount === 1 ? " is" : "s are"} missing a source date.`);
  }
  if (policy.requireDatedEvidence && datedCount < evidence.length) {
    warnings.push("Evidence gate requires dated evidence.");
  }

  const hardFailures = warnings.filter((warning) =>
    warning.startsWith("Evidence gate") ||
    warning.startsWith("Strongest evidence") ||
    warning.startsWith("One or more technical"),
  );
  const eligible = hardFailures.length === 0;

  return {
    candidateId: record.id,
    status: eligible ? (warnings.length > 0 ? "Review" : "Passed") : "Blocked",
    eligible,
    evidenceCount: evidence.length,
    independentSourceCount: sourceCount,
    strongestEvidenceConfidence: strongest,
    datedEvidenceCount: datedCount,
    unsupportedClaimCount: evidenceProfile.unsupportedClaimCount,
    warnings: unique(warnings),
    evaluatedAt: new Date().toISOString(),
  };
}

function sourceBiasAudit(
  result: TechnicalTalentOrchestrationResult,
): TechnicalTalentSourceBiasAudit {
  const coverage = result.sourcesRequested.map((source) => {
    const execution = result.executions.find((item) => item.source === source);
    const adapter = technicalTalentSourceRegistry.get(source);
    const capabilities = adapter?.config.capabilities ?? {};

    return {
      source,
      requested: true,
      successful: result.sourcesSuccessful.includes(source),
      recordCount: execution?.result?.records.length ?? 0,
      evidenceCount: execution?.result?.evidence.length ?? 0,
      capabilities: Object.entries(capabilities)
        .filter(([, enabled]) => Boolean(enabled))
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
    risks.push(`Source failure may bias the candidate pool: ${result.sourcesFailed.join(", ")}.`);
  }
  if (result.sourcesSuccessful.length === 1) {
    risks.push(`Only one source succeeded (${result.sourcesSuccessful[0]}), creating single-source bias.`);
  }
  for (const item of coverage) {
    if (item.successful && item.recordCount > 0 && item.evidenceCount === 0) {
      risks.push(`${item.source} returned candidates without evidence items.`);
    }
  }

  const query = result.query;
  for (const item of coverage) {
    if ((query.researchAreas?.length ?? 0) > 0 &&
        !item.capabilities.includes("publications") &&
        !item.capabilities.includes("researchProjects")) {
      missingCoverage.push(`${item.source} does not advertise publication/research-project coverage.`);
    }
    if ((query.companies?.length ?? 0) > 0 && !item.capabilities.includes("employment")) {
      missingCoverage.push(`${item.source} does not advertise employment coverage.`);
    }
    if ((query.technologies?.length ?? 0) > 0 &&
        !item.capabilities.includes("technologies") &&
        !item.capabilities.includes("technicalProfile")) {
      missingCoverage.push(`${item.source} does not advertise technical-profile/technology coverage.`);
    }
  }

  const riskLevel = risks.length >= 2
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
    risks: unique(risks),
    missingCoverage: unique(missingCoverage),
    searchedAt: new Date().toISOString(),
  };
}

function ecosystemMap(records: TechnicalTalentDiscoveryRecord[]): TechnicalTalentEcosystemMap {
  const nodes = new Map<string, TechnicalTalentEcosystemNode>();
  const edges = new Map<string, TechnicalTalentEcosystemEdge>();

  const addNode = (node: TechnicalTalentEcosystemNode) => {
    const existing = nodes.get(node.id);
    nodes.set(node.id, existing
      ? { ...existing, evidenceIds: unique([...(existing.evidenceIds ?? []), ...(node.evidenceIds ?? [])]) }
      : node);
  };

  const addEdge = (edge: TechnicalTalentEcosystemEdge) => {
    const existing = edges.get(edge.id);
    edges.set(edge.id, existing
      ? { ...existing, evidenceIds: unique([...existing.evidenceIds, ...edge.evidenceIds]) }
      : edge);
  };

  for (const record of records) {
    const candidateId = `candidate:${record.id}`;
    addNode({
      id: candidateId,
      type: "Candidate",
      label: record.name,
      candidateId: record.id,
      evidenceIds: record.evidence.map((item) => item.id),
    });

    for (const skill of record.skills) {
      const skillId = `skill:${key(skill.normalizedName ?? skill.name)}`;
      addNode({ id: skillId, type: "Skill", label: skill.name, evidenceIds: skill.evidenceIds });
      addEdge({
        id: `${candidateId}->${skillId}:demonstrates`,
        source: candidateId,
        target: skillId,
        type: "demonstrates",
        evidenceIds: skill.evidenceIds ?? [],
      });
    }

    for (const technology of record.technologies) {
      const technologyId = `technology:${key(technology.normalizedName ?? technology.name)}`;
      addNode({ id: technologyId, type: "Technology", label: technology.name, evidenceIds: technology.evidenceIds });
      addEdge({
        id: `${candidateId}->${technologyId}:uses`,
        source: candidateId,
        target: technologyId,
        type: "uses",
        evidenceIds: technology.evidenceIds ?? [],
      });
    }

    for (const repository of record.repositories ?? []) {
      const repositoryId = `repository:${repository.repository}`;
      const evidenceIds = repository.evidenceId ? [repository.evidenceId] : [];
      addNode({ id: repositoryId, type: "Repository", label: repository.repository, candidateId: record.id, evidenceIds });
      addEdge({
        id: `${repositoryId}->${candidateId}:contributes-to`,
        source: repositoryId,
        target: candidateId,
        type: "contributes-to",
        evidenceIds,
      });
      for (const technology of repository.technologies ?? []) {
        const technologyId = `technology:${key(technology)}`;
        addNode({ id: technologyId, type: "Technology", label: technology });
        addEdge({
          id: `${technologyId}->${repositoryId}:implements`,
          source: technologyId,
          target: repositoryId,
          type: "implements",
          evidenceIds,
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

export async function orchestrateEvidenceFirstTechnicalTalentDiscovery(
  query: TechnicalTalentDiscoveryQuery = {},
  options: TechnicalTalentOrchestrationOptions & {
    evidenceGatePolicy?: Partial<TechnicalTalentEvidenceGatePolicy>;
  } = {},
): Promise<TechnicalTalentEvidenceFirstDiscoveryResult> {
  const base = await orchestrateTechnicalTalentDiscovery(query, {
    ...options,
    limit: Math.max(options.limit ?? 50, 100),
    offset: 0,
  });

  const policy: TechnicalTalentEvidenceGatePolicy = {
    ...DEFAULT_EVIDENCE_GATE_POLICY,
    ...(options.evidenceGatePolicy ?? {}),
  };

  const evidenceProfiles = base.records.map(profile);
  const evidenceGates = base.records.map((record, index) =>
    gate(record, evidenceProfiles[index], policy),
  );
  const gateById = new Map(evidenceGates.map((item) => [item.candidateId, item]));

  const eligible = base.records.filter((record) => gateById.get(record.id)?.eligible);
  const profileById = new Map(evidenceProfiles.map((item) => [item.candidateId, item]));
  eligible.sort((left, right) => {
    const evidenceDelta =
      (profileById.get(right.id)?.evidenceScore ?? 0) -
      (profileById.get(left.id)?.evidenceScore ?? 0);
    return evidenceDelta !== 0
      ? evidenceDelta
      : (right.fitScore?.overall ?? 0) - (left.fitScore?.overall ?? 0);
  });

  const offset = Math.max(options.offset ?? 0, 0);
  const limit = Math.max(options.limit ?? 50, 1);
  const records = eligible.slice(offset, offset + limit);

  return {
    ...base,
    records,
    total: eligible.length,
    evidence: records.flatMap((record) => record.evidence),
    evidenceProfiles,
    evidenceGates,
    blockedCandidateCount: base.records.length - eligible.length,
    evidenceGatePolicy: policy,
    ecosystemMap: ecosystemMap(eligible),
    sourceBiasAudit: sourceBiasAudit(base),
    evidenceFirst: true,
  };
}
