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

/**
 * Score how strongly one discovery keyword is supported by
 * the candidate's structured technical and research profile.
 *
 * This is deliberately evidence-aware without relying on a
 * hard-coded robotics vocabulary. The candidate record itself
 * provides the technical concepts Atlas has already extracted.
 */
function scoreKeywordTechnicalDepth(
  record: TechnicalTalentDiscoveryRecord,
  keyword: string,
): {
  score: number;
  matchedSignals: number;
  relevantPublications: number;
  relevantEvidence: number;
} {
  const normalizedKeyword =
    normalize(keyword);

  if (!normalizedKeyword) {
    return {
      score: 0,
      matchedSignals: 0,
      relevantPublications: 0,
      relevantEvidence: 0,
    };
  }

  const skillMatch =
    record.skills.some(
      (skill) =>
        includesNormalized(
          skill.name,
          normalizedKeyword,
        ),
    );

  const technologyMatch =
    record.technologies.some(
      (technology) =>
        includesNormalized(
          technology.name,
          normalizedKeyword,
        ),
    );

  const researchMatches =
    (record.researchAreas ?? []).filter(
      (area) =>
        includesNormalized(
          area,
          normalizedKeyword,
        ),
    );

  /*
   * Publication relevance should not depend only on the literal
   * query phrase appearing in the publication title.
   *
   * A publication can support a discovery keyword through:
   * - its title,
   * - its structured research areas, or
   * - research areas on the candidate record that are themselves
   *   semantically aligned with the requested keyword.
   *
   * This is particularly important for technical domains such as
   * robot learning, where papers often use a more specific
   * technique or application in the title.
   */
  const candidateResearchAreas =
    record.researchAreas ?? [];

  const keywordResearchAreas =
    candidateResearchAreas.filter(
      (area) =>
        includesNormalized(
          area,
          normalizedKeyword,
        ),
    );

  const relevantPublications =
    (record.publications ?? []).filter(
      (publication) => {
        const titleMatch =
          includesNormalized(
            publication.title,
            normalizedKeyword,
          );

        const publicationResearchAreas =
          publication.researchAreas ?? [];

        const directResearchAreaMatch =
          publicationResearchAreas.some(
            (area) =>
              includesNormalized(
                area,
                normalizedKeyword,
              ),
          );

        const alignedResearchAreaMatch =
          publicationResearchAreas.some(
            (publicationArea) =>
              keywordResearchAreas.some(
                (candidateArea) =>
                  includesNormalized(
                    publicationArea,
                    candidateArea,
                  ) ||
                  includesNormalized(
                    candidateArea,
                    publicationArea,
                  ),
              ),
          );

        /*
         * Follow the publication's evidence link.
         *
         * This lets Atlas recognize a paper as relevant when
         * the paper title/research-area metadata uses a more
         * specific technical term, but its abstract/evidence
         * explicitly establishes the requested concept.
         *
         * The lookup is restricted to this publication's own
         * evidenceId so unrelated candidate evidence cannot
         * inflate publication relevance.
         */
        const linkedEvidence =
          publication.evidenceId
            ? (
                record.evidence ?? []
              ).find(
                (item) =>
                  item.id ===
                  publication.evidenceId,
              )
            : undefined;

        const linkedEvidenceMatch =
          linkedEvidence
            ? (
                includesNormalized(
                  linkedEvidence.title,
                  normalizedKeyword,
                ) ||
                includesNormalized(
                  linkedEvidence.description ?? "",
                  normalizedKeyword,
                ) ||
                (
                  linkedEvidence.supports ?? []
                ).some(
                  (support) =>
                    includesNormalized(
                      support,
                      normalizedKeyword,
                    ),
                )
              )
            : false;

        return (
          titleMatch ||
          directResearchAreaMatch ||
          alignedResearchAreaMatch ||
          linkedEvidenceMatch
        );
      },
    );

  const relevantEvidence =
    (record.evidence ?? []).filter(
      (item) =>
        includesNormalized(
          item.title,
          normalizedKeyword,
        ) ||
        includesNormalized(
          item.description ?? "",
          normalizedKeyword,
        ) ||
        (item.supports ?? []).some(
          (support) =>
            includesNormalized(
              support,
              normalizedKeyword,
            ),
        ),
    );

  const signalCount =
    Number(skillMatch) +
    Number(technologyMatch) +
    Math.min(
      researchMatches.length,
      3,
    ) +
    Math.min(
      relevantPublications.length,
      3,
    ) +
    Math.min(
      relevantEvidence.length,
      3,
    );

  /*
   * Base relevance:
   *
   * Exact structured technical signal = strong.
   * Research/publication/evidence corroboration increases depth.
   */
  let score =
    skillMatch || technologyMatch
      ? 70
      : 0;

  if (
    !skillMatch &&
    !technologyMatch &&
    researchMatches.length > 0
  ) {
    score = 60;
  }

  if (
    relevantPublications.length > 0
  ) {
    score += Math.min(
      15,
      relevantPublications.length * 5,
    );
  }

  if (
    relevantEvidence.length > 0
  ) {
    score += Math.min(
      10,
      relevantEvidence.length * 3,
    );
  }

  if (
    researchMatches.length > 0
  ) {
    score += Math.min(
      10,
      researchMatches.length * 3,
    );
  }

  /*
   * Distinct technical signals indicate depth rather than
   * simply repeating the same keyword.
   */
  if (signalCount >= 5) {
    score += 10;
  } else if (signalCount >= 3) {
    score += 5;
  }

  return {
    score: Math.min(
      100,
      score,
    ),
    matchedSignals:
      signalCount,
    relevantPublications:
      relevantPublications.length,
    relevantEvidence:
      relevantEvidence.length,
  };
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

  const requestedKeywords =
    uniqueStrings(
      query.keywords ?? [],
    );

  /*
   * Technical scoring rules:
   *
   * 1. Explicit skills and technologies are the strongest
   *    technical signals.
   *
   * 2. Keywords are broad discovery terms. They can match
   *    research areas, publications, or evidence, but they
   *    must not be counted twice when the same signal already
   *    exists as an explicit skill/technology.
   *
   * 3. A keyword-only match should not automatically produce
   *    a near-perfect technical score.
   *
   * 4. Multiple independent technical signals can improve
   *    the score, so candidates with richer technical profiles
   *    naturally rank above candidates with only one matching
   *    phrase.
   */

  const explicitRequests = [
    ...requestedSkills,
    ...requestedTechnologies,
  ];

  const distinctKeywords =
    requestedKeywords.filter(
      (keyword) =>
        !explicitRequests.some(
          (request) =>
            includesNormalized(
              request,
              keyword,
            ) ||
            includesNormalized(
              keyword,
              request,
            ),
        ),
    );

  const totalRequests =
    explicitRequests.length +
    distinctKeywords.length;

  if (totalRequests === 0) {
    return 50;
  }

  let scorePoints = 0;
  let maxPoints = 0;

  /*
   * Explicit skills.
   *
   * These are worth more because the candidate's normalized
   * profile explicitly identifies the skill.
   */
  for (
    const requestedSkill of requestedSkills
  ) {
    maxPoints += 100;

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

    scorePoints += 100;

    addReason(
      reasons,
      {
        category: "Skill",
        signal:
          requestedSkill,
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

  /*
   * Explicit technologies.
   */
  for (
    const requestedTechnology of requestedTechnologies
  ) {
    maxPoints += 100;

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

    scorePoints += 100;

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

  /*
   * Broad keywords.
   *
   * Use the technical depth engine rather than treating every
   * keyword match as equally strong.
   *
   * This allows candidates with:
   * - explicit technical skills
   * - multiple relevant research areas
   * - multiple relevant publications
   * - corroborating evidence
   *
   * to rank above candidates who merely contain the keyword once.
   */
  for (
    const keyword of distinctKeywords
  ) {
    maxPoints += 100;

    const depth =
      scoreKeywordTechnicalDepth(
        record,
        keyword,
      );

    if (
      depth.score <= 0
    ) {
      continue;
    }

    scorePoints +=
      depth.score;

    addReason(
      reasons,
      {
        category:
          depth.relevantPublications > 0 ||
          depth.relevantEvidence > 0
            ? "Research"
            : "Skill",

        signal:
          `Technical depth: ${keyword}`,

        weight:
          TECHNICAL_WEIGHT,

        explanation:
          `Candidate has a technical relevance score of ${depth.score}/100 for "${keyword}", supported by ${depth.matchedSignals} distinct signal${depth.matchedSignals === 1 ? "" : "s"}, ${depth.relevantPublications} relevant publication${depth.relevantPublications === 1 ? "" : "s"}, and ${depth.relevantEvidence} relevant evidence item${depth.relevantEvidence === 1 ? "" : "s"}.`,
      },
    );
  }

  /*
   * Convert the weighted technical signal score into 0–100.
   */
  return Math.round(
    (
      scorePoints /
      maxPoints
    ) *
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
    ...(record.publications ?? []).flatMap(
      (publication) => [
        publication.title,
        publication.venue,
        ...(publication.researchAreas ?? []),
      ],
    ),
    ...(record.evidence ?? []).flatMap(
      (item) => [
        item.title,
        item.description,
        ...(item.supports ?? []),
      ],
    ),
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * scoreTechnicalMatch() already evaluates query keywords against
   * structured technical signals, research areas, and technical
   * evidence.
   *
   * scoreKeywords() must not award a second score for the same signal.
   * It remains useful for explaining keyword matches, but only
   * residual keywords that are not already represented by the
   * structured technical/research scoring path should contribute.
   */
  const matches =
    keywords.filter(
      (keyword) => {
        const matchedByStructuredTechnical =
          record.skills.some(
            (skill) =>
              includesNormalized(
                skill.name,
                keyword,
              ),
          ) ||
          record.technologies.some(
            (technology) =>
              includesNormalized(
                technology.name,
                keyword,
              ),
          ) ||
          (record.researchAreas ?? []).some(
            (area) =>
              includesNormalized(
                area,
                keyword,
              ),
          );

        if (
          matchedByStructuredTechnical
        ) {
          return false;
        }

        return includesNormalized(
          searchableText,
          keyword,
        );
      },
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

  const hasRequestedRole =
    (query.roleFamilies ?? []).length > 0;

  const hasResidualKeywordMatch =
    keywordScore > 0;

  const adjustedTechnical =
    hasRequestedRole
      ? Math.round(
          technicalScore *
            0.9 +
            roleScore *
              0.1,
        )
      : hasResidualKeywordMatch
        ? Math.round(
            technicalScore *
              0.9 +
              keywordScore *
                0.1,
          )
        : technicalScore;

  /**
   * Candidate fit is based on relevance and evidence strength.
   *
   * Verification remains calculated separately and is exposed
   * through record.verification. It must not suppress a strong
   * technical/research match merely because employment evidence
   * has not yet been discovered.
   */
  /*
   * Query-aware weighting.
   *
   * Only dimensions explicitly requested by the recruiter
   * participate in the final score.
   */
  const requestedResearchAreas =
    uniqueStrings(
      query.researchAreas ?? [],
    );

  const requestedDomains =
    uniqueStrings(
      query.domains ?? [],
    );

  const scoringDimensions: Array<{
    score: number;
    weight: number;
  }> = [
    {
      score:
        adjustedTechnical,
      weight:
        TECHNICAL_WEIGHT,
    },
    {
      score:
        evidenceScore,
      weight:
        EVIDENCE_WEIGHT,
    },
  ];

  if (
    requestedResearchAreas.length > 0
  ) {
    scoringDimensions.push({
      score:
        researchScore,
      weight:
        RESEARCH_WEIGHT,
    });
  }

  if (
    requestedDomains.length > 0
  ) {
    scoringDimensions.push({
      score:
        domainScore,
      weight:
        DOMAIN_WEIGHT,
    });
  }

  const totalActiveWeight =
    scoringDimensions.reduce(
      (sum, dimension) =>
        sum + dimension.weight,
      0,
    );

  let overall =
    totalActiveWeight > 0
      ? Math.round(
          scoringDimensions.reduce(
            (sum, dimension) =>
              sum +
              dimension.score *
                dimension.weight,
            0,
          ) /
            totalActiveWeight,
        )
      : 0;

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
