import type {
  DiscoveryConfidence,
  DiscoveryFitScore,
  DiscoveryMatchReason,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

/**
 * Atlas Technical Talent Fit Scorer
 *
 * Deterministic, evidence-aware candidate scoring layer.
 *
 * Responsibilities:
 * - score a normalized technical talent record against a discovery query
 * - reward explicit technical, research, and domain matches
 * - incorporate evidence strength
 * - incorporate candidate verification
 * - produce explainable match reasons
 *
 * This layer deliberately does NOT:
 * - perform external API calls
 * - resolve identities
 * - invent evidence
 * - approve candidates
 * - make hiring decisions
 */

const TECHNICAL_WEIGHT = 40;
const RESEARCH_WEIGHT = 20;
const DOMAIN_WEIGHT = 15;
const EVIDENCE_WEIGHT = 25;

/**
 * Verification is intentionally NOT part of candidate fit.
 *
 * Fit answers:
 *   "How well does this candidate match the query?"
 *
 * Verification answers:
 *   "How strongly can Atlas corroborate this candidate?"
 *
 * Keeping these dimensions separate prevents strong technical or
 * research candidates from being unfairly penalized simply because
 * Atlas has not yet enriched them with employment or identity
 * evidence from additional sources.
 */

const CONFIDENCE_SCORE: Record<
  DiscoveryConfidence,
  number
> = {
  "Very High": 100,
  High: 85,
  Medium: 70,
  Low: 55,
};

function normalize(
  value?: string,
): string {
  return (
    value ?? ""
  )
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .trim();
}

function includesNormalized(
  value: string,
  target: string,
): boolean {
  const normalizedValue =
    normalize(value);

  const normalizedTarget =
    normalize(target);

  if (
    !normalizedValue ||
    !normalizedTarget
  ) {
    return false;
  }

  return (
    normalizedValue ===
      normalizedTarget ||
    normalizedValue.includes(
      normalizedTarget,
    ) ||
    normalizedTarget.includes(
      normalizedValue,
    )
  );
}

function uniqueStrings(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map(normalize)
        .filter(Boolean),
    ),
  );
}

function addReason(
  reasons: DiscoveryMatchReason[],
  reason: DiscoveryMatchReason,
): void {
  reasons.push(reason);
}

function evidenceIdsForSkill(
  record: TechnicalTalentDiscoveryRecord,
  skillName: string,
): string[] {
  const skill =
    record.skills.find(
      (item) =>
        includesNormalized(
          item.name,
          skillName,
        ),
    );

  return skill?.evidenceIds ?? [];
}

function evidenceIdsForTechnology(
  record: TechnicalTalentDiscoveryRecord,
  technologyName: string,
): string[] {
  const technology =
    record.technologies.find(
      (item) =>
        includesNormalized(
          item.name,
          technologyName,
        ),
    );

  return (
    technology?.evidenceIds ?? []
  );
}

function scoreTechnicalMatch(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery,
  reasons: DiscoveryMatchReason[],
): number {
  const requestedSkills =
    uniqueStrings(
      query.skills ?? [],
    );

  const requestedTechnologies =
    uniqueStrings(
      query.technologies ?? [],
    );

  const totalRequested =
    requestedSkills.length +
    requestedTechnologies.length;

  if (totalRequested === 0) {
    return 50;
  }

  let matched = 0;

  for (
    const requestedSkill of requestedSkills
  ) {
    const match =
      record.skills.some(
        (skill) =>
          includesNormalized(
            skill.name,
            requestedSkill,
          ),
      );

    if (!match) {
      continue;
    }

    matched += 1;

    addReason(
      reasons,
      {
        category: "Skill",
        signal: requestedSkill,
        weight:
          TECHNICAL_WEIGHT,
        explanation:
          `Candidate demonstrates the requested skill "${requestedSkill}".`,
        evidenceIds:
          evidenceIdsForSkill(
            record,
            requestedSkill,
          ),
      },
    );
  }

  for (
    const requestedTechnology of requestedTechnologies
  ) {
    const match =
      record.technologies.some(
        (technology) =>
          includesNormalized(
            technology.name,
            requestedTechnology,
          ),
      );

    if (!match) {
      continue;
    }

    matched += 1;

    addReason(
      reasons,
      {
        category: "Technology",
        signal:
          requestedTechnology,
        weight:
          TECHNICAL_WEIGHT,
        explanation:
          `Candidate demonstrates the requested technology "${requestedTechnology}".`,
        evidenceIds:
          evidenceIdsForTechnology(
            record,
            requestedTechnology,
          ),
      },
    );
  }

  return Math.round(
    (matched /
      totalRequested) *
      100,
  );
}

function scoreResearchMatch(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery,
  reasons: DiscoveryMatchReason[],
): number {
  const requestedResearchAreas =
    uniqueStrings(
      query.researchAreas ?? [],
    );

  if (
    requestedResearchAreas.length === 0
  ) {
    return 50;
  }

  const candidateResearch =
    record.researchAreas ?? [];

  const matchedAreas =
    requestedResearchAreas.filter(
      (requested) =>
        candidateResearch.some(
          (area) =>
            includesNormalized(
              area,
              requested,
            ),
        ),
    );

  for (
    const area of matchedAreas
  ) {
    const evidenceIds =
      record.evidence
        .filter(
          (item) =>
            item.supports?.some(
              (support) =>
                includesNormalized(
                  support,
                  area,
                ),
            ) ||
            includesNormalized(
              item.title,
              area,
            ) ||
            includesNormalized(
              item.description ?? "",
              area,
            ),
        )
        .map(
          (item) => item.id,
        );

    addReason(
      reasons,
      {
        category: "Research",
        signal: area,
        weight:
          RESEARCH_WEIGHT,
        explanation:
          `Candidate demonstrates research activity related to "${area}".`,
        evidenceIds:
          Array.from(
            new Set(evidenceIds),
          ),
      },
    );
  }

  return Math.round(
    (matchedAreas.length /
      requestedResearchAreas.length) *
      100,
  );
}

function scoreDomainMatch(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery,
  reasons: DiscoveryMatchReason[],
): number {
  const requestedDomains =
    query.domains ?? [];

  if (
    requestedDomains.length === 0
  ) {
    return 50;
  }

  const matches =
    requestedDomains.filter(
      (domain) =>
        record.primaryDomain ===
          domain ||
        (
          record.secondaryDomains ??
          []
        ).includes(domain),
    );

  for (
    const domain of matches
  ) {
    addReason(
      reasons,
      {
        category: "Other",
        signal: domain,
        weight:
          DOMAIN_WEIGHT,
        explanation:
          `Candidate has demonstrated experience in the requested technical domain "${domain}".`,
      },
    );
  }

  return Math.round(
    (matches.length /
      requestedDomains.length) *
      100,
  );
}

function scoreEvidence(
  record: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const evidence =
    record.evidence ?? [];

  if (
    evidence.length === 0
  ) {
    return 0;
  }

  const uniqueSources =
    new Set(
      evidence.map(
        (item) =>
          item.source,
      ),
    );

  const confidenceValues =
    evidence.map(
      (item) =>
        CONFIDENCE_SCORE[
          item.confidence
        ],
    );

  const highestConfidence =
    Math.max(
      ...confidenceValues,
    );

  const sourceBreadthScore =
    Math.min(
      100,
      uniqueSources.size *
        25,
    );

  const evidenceCountScore =
    Math.min(
      100,
      evidence.length *
        20,
    );

  const score =
    Math.round(
      highestConfidence *
        0.5 +
        sourceBreadthScore *
          0.3 +
        evidenceCountScore *
          0.2,
    );

  addReason(
    reasons,
    {
      category: "Other",
      signal:
        `${evidence.length} evidence item${evidence.length === 1 ? "" : "s"}`,
      weight:
        EVIDENCE_WEIGHT,
      explanation:
        `Candidate has ${evidence.length} evidence item${evidence.length === 1 ? "" : "s"} across ${uniqueSources.size} independent source${uniqueSources.size === 1 ? "" : "s"}.`,
      evidenceIds:
        evidence.map(
          (item) => item.id,
        ),
    },
  );

  return score;
}

function scoreVerification(
  record: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const verification =
    record.verification;

  if (!verification) {
    return 0;
  }

  const score =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          verification.score,
        ),
      ),
    );

  addReason(
    reasons,
    {
      category: "Experience",
      signal:
        verification.status,
      weight:
        0,
      explanation:
        `Candidate verification is "${verification.status}" with a verification score of ${verification.score}.`,
      evidenceIds:
        verification.verifiedEvidenceIds,
    },
  );

  return score;
}

function scoreRoleFamily(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery,
  reasons: DiscoveryMatchReason[],
): number {
  const requestedRoles =
    uniqueStrings(
      query.roleFamilies ?? [],
    );

  if (
    requestedRoles.length === 0
  ) {
    return 50;
  }

  const candidateRole =
    [
      record.roleFamily,
      record.normalizedRole,
      record.headline,
    ]
      .filter(Boolean)
      .join(" ");

  const matches =
    requestedRoles.filter(
      (role) =>
        includesNormalized(
          candidateRole,
          role,
        ),
    );

  for (
    const role of matches
  ) {
    addReason(
      reasons,
      {
        category: "Role",
        signal: role,
        weight:
          TECHNICAL_WEIGHT,
        explanation:
          `Candidate role information matches the requested role family "${role}".`,
      },
    );
  }

  return Math.round(
    (matches.length /
      requestedRoles.length) *
      100,
  );
}

function scoreKeywords(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery,
  reasons: DiscoveryMatchReason[],
): number {
  const keywords =
    uniqueStrings(
      query.keywords ?? [],
    );

  if (
    keywords.length === 0
  ) {
    return 50;
  }

  const searchableText = [
    record.name,
    record.headline,
    record.primaryDomain,
    ...(record.secondaryDomains ??
      []),
    record.roleFamily,
    record.normalizedRole,
    ...(record.skills ?? []).map(
      (item) => item.name,
    ),
    ...(record.technologies ?? []).map(
      (item) => item.name,
    ),
    ...(record.researchAreas ??
      []),
  ]
    .filter(Boolean)
    .join(" ");

  const matches =
    keywords.filter(
      (keyword) =>
        includesNormalized(
          searchableText,
          keyword,
        ),
    );

  for (
    const keyword of matches
  ) {
    addReason(
      reasons,
      {
        category: "Other",
        signal: keyword,
        weight:
          TECHNICAL_WEIGHT,
        explanation:
          `Candidate profile contains the requested keyword "${keyword}".`,
      },
    );
  }

  return Math.round(
    (matches.length /
      keywords.length) *
      100,
  );
}

/**
 * Calculate an explainable fit score for one
 * technical talent candidate.
 */
export function scoreTechnicalTalentCandidate(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery = {},
): DiscoveryFitScore {
  const reasons:
    DiscoveryMatchReason[] =
    [];

  const technicalScore =
    scoreTechnicalMatch(
      record,
      query,
      reasons,
    );

  const researchScore =
    scoreResearchMatch(
      record,
      query,
      reasons,
    );

  const domainScore =
    scoreDomainMatch(
      record,
      query,
      reasons,
    );

  const evidenceScore =
    scoreEvidence(
      record,
      reasons,
    );

  scoreVerification(
    record,
    reasons,
  );

  const roleScore =
    scoreRoleFamily(
      record,
      query,
      reasons,
    );

  const keywordScore =
    scoreKeywords(
      record,
      query,
      reasons,
    );

  const adjustedTechnical =
    Math.round(
      technicalScore *
        0.8 +
        roleScore *
          0.1 +
        keywordScore *
          0.1,
    );

  /**
   * Candidate fit is based on relevance and evidence strength.
   *
   * Verification remains calculated separately and is exposed
   * through record.verification. It must not suppress a strong
   * technical/research match merely because employment evidence
   * has not yet been discovered.
   */
  let overall =
    Math.round(
      adjustedTechnical *
        (TECHNICAL_WEIGHT / 100) +
        researchScore *
          (RESEARCH_WEIGHT / 100) +
        domainScore *
          (DOMAIN_WEIGHT / 100) +
        evidenceScore *
          (EVIDENCE_WEIGHT / 100),
    );

  const requestedDomains =
    query.domains ?? [];

  const hasDomainMismatch =
    requestedDomains.length > 0 &&
    domainScore === 0;

  if (hasDomainMismatch) {
    overall = Math.round(
      overall * 0.6,
    );

    addReason(
      reasons,
      {
        category: "Other",
        signal:
          "Domain mismatch",
        weight:
          DOMAIN_WEIGHT,
        explanation:
          "Candidate does not demonstrate any of the requested technical domains.",
      },
    );
  }

  return {
    overall: Math.min(
      100,
      Math.max(
        0,
        overall,
      ),
    ),

    technical:
      adjustedTechnical,

    research:
      researchScore,

    domain:
      domainScore,

    evidence:
      evidenceScore,

    /**
     * Fit confidence reflects the strength of the evidence
     * supporting the match, while candidate verification remains
     * available separately on record.verification.
     */
    confidence:
      evidenceScore,

    reasons,
  };
}
