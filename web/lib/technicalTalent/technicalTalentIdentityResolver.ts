// ============================================================
// Atlas Recruiter OS
// Technical Talent Identity Resolver
//
// Deterministic, explainable cross-source identity resolution.
//
// This module does NOT make hiring decisions.
// It estimates whether two technical talent records likely
// represent the same real-world person.
//
// Important:
// - Name alone is never sufficient for a merge.
// - Weak signals are treated conservatively.
// - Every positive match produces an explanation.
// - Low-confidence matches should remain separate.
// ============================================================

import type {
  DiscoveryConfidence,
  DiscoveryMatchReason,
  DiscoveryTechnicalDomain,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

export interface TechnicalTalentIdentityMatchResult {
  /**
   * Normalized identity keys used during comparison.
   */
  leftIdentityKey: string;

  rightIdentityKey: string;

  /**
   * Overall identity match score from 0 to 100.
   */
  score: number;

  /**
   * Confidence classification for the identity match.
   */
  confidence: DiscoveryConfidence;

  /**
   * Whether Atlas should automatically merge the records.
   *
   * This is deliberately stricter than merely identifying
   * a probable match.
   */
  shouldMerge: boolean;

  /**
   * Whether the records should be sent for manual review.
   */
  requiresReview: boolean;

  /**
   * Explainable reasons supporting the identity decision.
   */
  reasons: DiscoveryMatchReason[];
}

export interface TechnicalTalentIdentityResolverOptions {
  /**
   * Minimum score required for an automatic merge.
   *
   * Default: 90.
   */
  mergeThreshold?: number;

  /**
   * Minimum score at which Atlas considers the records
   * a probable identity match requiring review.
   *
   * Default: 75.
   */
  reviewThreshold?: number;
}

const DEFAULT_MERGE_THRESHOLD = 90;

const DEFAULT_REVIEW_THRESHOLD = 75;

function normalizeText(
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
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}

function normalizeCompact(
  value?: string,
): string {
  return normalizeText(
    value,
  ).replace(
    /\s+/g,
    "",
  );
}

function normalizeUrl(
  value?: string,
): string {
  if (!value) {
    return "";
  }

  try {
    const url =
      new URL(value);

    return [
      url.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          "",
        ),

      url.pathname
        .replace(
          /\/+$/,
          "",
        )
        .toLowerCase(),
    ].join("");
  } catch {
    return normalizeCompact(
      value,
    );
  }
}

function getNameParts(
  record: TechnicalTalentDiscoveryRecord,
): {
  full: string;
  first: string;
  last: string;
} {
  const full =
    normalizeText(
      record.name,
    );

  const first =
    normalizeText(
      record.firstName,
    );

  const last =
    normalizeText(
      record.lastName,
    );

  if (
    first ||
    last
  ) {
    return {
      full:
        [first, last]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        full,

      first,

      last,
    };
  }

  const parts =
    full.split(" ")
      .filter(Boolean);

  return {
    full,

    first:
      parts[0] ??
      "",

    last:
      parts.length > 1
        ? parts[
            parts.length - 1
          ]
        : "",
  };
}

function namesMatch(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
): boolean {
  const leftName =
    getNameParts(left);

  const rightName =
    getNameParts(right);

  if (
    !leftName.full ||
    !rightName.full
  ) {
    return false;
  }

  if (
    leftName.full ===
    rightName.full
  ) {
    return true;
  }

  if (
    leftName.first &&
    leftName.last &&
    rightName.first &&
    rightName.last &&
    leftName.first ===
      rightName.first &&
    leftName.last ===
      rightName.last
  ) {
    return true;
  }

  return false;
}

function namesShareStrongPattern(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
): boolean {
  const leftName =
    getNameParts(left);

  const rightName =
    getNameParts(right);

  if (
    !leftName.first ||
    !rightName.first ||
    !leftName.last ||
    !rightName.last
  ) {
    return false;
  }

  if (
    leftName.last ===
      rightName.last &&
    leftName.first[0] ===
      rightName.first[0]
  ) {
    return true;
  }

  return false;
}

function arraysOverlap(
  left: string[],
  right: string[],
): string[] {
  const rightSet =
    new Set(
      right.map(
        normalizeCompact,
      ),
    );

  return left
    .map(
      normalizeCompact,
    )
    .filter(Boolean)
    .filter(
      (value) =>
        rightSet.has(
          value,
        ),
    )
    .filter(
      (
        value,
        index,
        values,
      ) =>
        values.indexOf(
          value,
        ) === index,
    );
}

function getSkillNames(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return record.skills
    .map(
      (skill) =>
        skill.normalizedName ??
        skill.name,
    )
    .filter(Boolean);
}

function getTechnologyNames(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return record.technologies
    .map(
      (technology) =>
        technology.normalizedName ??
        technology.name,
    )
    .filter(Boolean);
}

function getResearchAreas(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return [
    ...(record.researchAreas ??
      []),
    ...(record.publications ??
      []).flatMap(
        (publication) =>
          publication.researchAreas ??
          [],
      ),
  ];
}

function getOrganizations(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return (
    record.affiliations ??
    []
  )
    .map(
      (affiliation) =>
        affiliation.organization,
    )
    .filter(Boolean);
}

function getLocations(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return [
    record.location,
    record.city,
    record.country,
    ...(record.affiliations ??
      []).flatMap(
        (affiliation) =>
          [
            affiliation.location,
          ],
      ),
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  );
}

function getPublicationTitles(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return (
    record.publications ??
    []
  )
    .map(
      (publication) =>
        publication.title,
    )
    .filter(Boolean);
}

function getRepositoryUrls(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return (
    record.repositories ??
    []
  )
    .map(
      (repository) =>
        repository.url,
    )
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    );
}

function getEvidenceUrls(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return record.evidence
    .map(
      (evidence) =>
        evidence.url,
    )
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    );
}

function getSourceRecordIds(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  return (
    record.sourceRecordIds ??
    []
  ).filter(Boolean);
}

function getDomains(
  record: TechnicalTalentDiscoveryRecord,
): DiscoveryTechnicalDomain[] {
  return [
    record.primaryDomain,
    ...(record.secondaryDomains ??
      []),
  ];
}

function addReason(
  reasons: DiscoveryMatchReason[],
  reason: DiscoveryMatchReason,
): void {
  reasons.push(reason);
}

function confidenceFromScore(
  score: number,
): DiscoveryConfidence {
  if (score >= 90) {
    return "Very High";
  }

  if (score >= 75) {
    return "High";
  }

  if (score >= 50) {
    return "Medium";
  }

  return "Low";
}

function clampScore(
  score: number,
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score),
    ),
  );
}

function getPersonLevelSourceIdentity(
  record: TechnicalTalentDiscoveryRecord,
): string | undefined {
  /*
   * Only source identifiers that represent a person/account
   * may be used as automatic identity evidence.
   *
   * OpenReview note IDs and Semantic Scholar paper IDs are
   * publication-level identifiers and must not identify a
   * person because co-authors share the same publication ID.
   */
  if (
    record.id.startsWith("github:")
  ) {
    return normalizeCompact(
      record.id,
    );
  }

  return undefined;
}

function buildIdentityKey(
  record: TechnicalTalentDiscoveryRecord,
): string {
  const personIdentity =
    getPersonLevelSourceIdentity(
      record,
    );

  if (personIdentity) {
    return personIdentity;
  }

  const name =
    normalizeCompact(
      record.name,
    );

  const domain =
    normalizeCompact(
      record.primaryDomain,
    );

  return [
    name,
    domain,
  ]
    .filter(Boolean)
    .join("|");
}

function scoreSourceIdentity(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const leftIdentity =
    getPersonLevelSourceIdentity(
      left,
    );

  const rightIdentity =
    getPersonLevelSourceIdentity(
      right,
    );

  if (
    !leftIdentity ||
    !rightIdentity ||
    leftIdentity !==
      rightIdentity
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Other",

      signal:
        "Shared external source identity",

      weight:
        40,

      explanation:
        "Both records resolve to the same person-level external source identity.",

      evidenceIds:
        [],
    },
  );

  return 40;
}

function scoreExactName(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  if (
    !namesMatch(
      left,
      right,
    )
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Other",

      signal:
        "Exact normalized name match",

      weight:
        25,

      explanation:
        `Both records normalize to the same person name: "${left.name}".`,
    },
  );

  return 25;
}

function scoreStrongNamePattern(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  if (
    namesMatch(
      left,
      right,
    ) ||
    !namesShareStrongPattern(
      left,
      right,
    )
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Other",

      signal:
        "Strong partial name match",

      weight:
        8,

      explanation:
        "The records share the same surname and first-name initial.",
    },
  );

  return 8;
}

function scoreOrganizations(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const overlap =
    arraysOverlap(
      getOrganizations(
        left,
      ),
      getOrganizations(
        right,
      ),
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Industry",

      signal:
        "Shared organization affiliation",

      weight:
        20,

      explanation:
        `Both records reference a common organization: ${overlap[0]}.`,
    },
  );

  return 20;
}

function scoreLocations(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const overlap =
    arraysOverlap(
      getLocations(
        left,
      ),
      getLocations(
        right,
      ),
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Location",

      signal:
        "Shared geographic signal",

      weight:
        8,

      explanation:
        `Both records contain a matching location signal: ${overlap[0]}.`,
    },
  );

  return 8;
}

function scoreDomains(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const overlap =
    arraysOverlap(
      getDomains(
        left,
      ),
      getDomains(
        right,
      ),
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Role",

      signal:
        "Shared technical domain",

      weight:
        10,

      explanation:
        `Both records demonstrate the ${overlap[0]} technical domain.`,
    },
  );

  return 10;
}

function scoreSkills(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const overlap =
    arraysOverlap(
      getSkillNames(
        left,
      ),
      getSkillNames(
        right,
      ),
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  const weight =
    Math.min(
      15,
      overlap.length *
        3,
    );

  addReason(
    reasons,
    {
      category:
        "Skill",

      signal:
        `${overlap.length} shared technical skill${
          overlap.length ===
          1
            ? ""
            : "s"
        }`,

      weight,

      explanation:
        `Shared skills include: ${overlap.slice(0, 5).join(", ")}.`,
    },
  );

  return weight;
}

function scoreTechnologies(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const overlap =
    arraysOverlap(
      getTechnologyNames(
        left,
      ),
      getTechnologyNames(
        right,
      ),
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  const weight =
    Math.min(
      15,
      overlap.length *
        3,
    );

  addReason(
    reasons,
    {
      category:
        "Technology",

      signal:
        `${overlap.length} shared technolog${
          overlap.length ===
          1
            ? "y"
            : "ies"
        }`,

      weight,

      explanation:
        `Shared technologies include: ${overlap.slice(0, 5).join(", ")}.`,
    },
  );

  return weight;
}


function getCoauthors(
  record: TechnicalTalentDiscoveryRecord,
): string[] {
  const self =
    normalizeCompact(
      record.name,
    );

  return Array.from(
    new Set(
      (record.publications ?? [])
        .flatMap(
          (publication) =>
            publication.authors ??
            [],
        )
        .map(
          normalizeCompact,
        )
        .filter(
          (author) =>
            author &&
            author !== self,
        ),
    ),
  );
}

function hasDifferentPublications(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
): boolean {
  const leftTitles =
    new Set(
      getPublicationTitles(
        left,
      ).map(
        normalizeCompact,
      ),
    );

  const rightTitles =
    new Set(
      getPublicationTitles(
        right,
      ).map(
        normalizeCompact,
      ),
    );

  for (
    const title of leftTitles
  ) {
    if (
      !rightTitles.has(
        title,
      )
    ) {
      return true;
    }
  }

  for (
    const title of rightTitles
  ) {
    if (
      !leftTitles.has(
        title,
      )
    ) {
      return true;
    }
  }

  return false;
}

function scoreSharedCoauthorNetwork(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  if (
    !namesMatch(
      left,
      right,
    )
  ) {
    return 0;
  }

  if (
    !hasDifferentPublications(
      left,
      right,
    )
  ) {
    return 0;
  }

  const overlap =
    arraysOverlap(
      getCoauthors(left),
      getCoauthors(right),
    );

  if (
    overlap.length ===
    0
  ) {
    return 0;
  }

  const weight =
    Math.min(
      20,
      overlap.length *
        5,
    );

  addReason(
    reasons,
    {
      category:
        "Research",

      signal:
        "Shared co-author network",

      weight,

      explanation:
        `Both records share ${overlap.length} recurring co-author(s) across different publications.`,

    },
  );

  return weight;
}

function scoreResearchAreas(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const overlap =
    arraysOverlap(
      getResearchAreas(
        left,
      ),
      getResearchAreas(
        right,
      ),
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  const weight =
    Math.min(
      10,
      overlap.length *
        5,
    );

  addReason(
    reasons,
    {
      category:
        "Research",

      signal:
        `${overlap.length} shared research area${
          overlap.length ===
          1
            ? ""
            : "s"
        }`,

      weight,

      explanation:
        `Shared research areas include: ${overlap.slice(0, 5).join(", ")}.`,
    },
  );

  return weight;
}

function scorePublications(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const leftTitles =
    getPublicationTitles(
      left,
    ).map(
      normalizeCompact,
    );

  const rightTitles =
    getPublicationTitles(
      right,
    ).map(
      normalizeCompact,
    );

  const overlap =
    arraysOverlap(
      leftTitles,
      rightTitles,
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  const weight =
    Math.min(
      20,
      overlap.length *
        20,
    );

  addReason(
    reasons,
    {
      category:
        "Publication",

      signal:
        "Shared publication",

      weight,

      explanation:
        "Both records contain the same normalized publication title.",
    },
  );

  return weight;
}

function scoreUrls(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const leftUrls =
    [
      ...getRepositoryUrls(
        left,
      ),
      ...getEvidenceUrls(
        left,
      ),
    ]
      .map(
        normalizeUrl,
      )
      .filter(Boolean);

  const rightUrls =
    [
      ...getRepositoryUrls(
        right,
      ),
      ...getEvidenceUrls(
        right,
      ),
    ]
      .map(
        normalizeUrl,
      )
      .filter(Boolean);

  const overlap =
    arraysOverlap(
      leftUrls,
      rightUrls,
    );

  if (
    overlap.length === 0
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Other",

      signal:
        "Shared external URL",

      weight:
        25,

      explanation:
        "Both records contain the same normalized external profile or evidence URL.",
    },
  );

  return 25;
}

function scoreHeadlineRole(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  reasons: DiscoveryMatchReason[],
): number {
  const leftRole =
    normalizeCompact(
      left.normalizedRole ??
        left.roleFamily ??
        left.talentType,
    );

  const rightRole =
    normalizeCompact(
      right.normalizedRole ??
        right.roleFamily ??
        right.talentType,
    );

  if (
    !leftRole ||
    !rightRole ||
    leftRole !==
      rightRole
  ) {
    return 0;
  }

  addReason(
    reasons,
    {
      category:
        "Role",

      signal:
        "Shared normalized role",

      weight:
        7,

      explanation:
        `Both records map to the same normalized role: ${
          left.normalizedRole ??
          left.roleFamily ??
          left.talentType ??
          "unknown"
        }.`,
    },
  );

  return 7;
}

/**
 * Resolve whether two records likely represent
 * the same technical talent identity.
 */
export function resolveTechnicalTalentIdentity(
  left: TechnicalTalentDiscoveryRecord,
  right: TechnicalTalentDiscoveryRecord,
  options: TechnicalTalentIdentityResolverOptions = {},
): TechnicalTalentIdentityMatchResult {
  const mergeThreshold =
    options.mergeThreshold ??
    DEFAULT_MERGE_THRESHOLD;

  const reviewThreshold =
    options.reviewThreshold ??
    DEFAULT_REVIEW_THRESHOLD;

  const reasons: DiscoveryMatchReason[] =
    [];

  let score = 0;

  score +=
    scoreSourceIdentity(
      left,
      right,
      reasons,
    );

  score +=
    scoreExactName(
      left,
      right,
      reasons,
    );

  score +=
    scoreStrongNamePattern(
      left,
      right,
      reasons,
    );

  score +=
    scoreOrganizations(
      left,
      right,
      reasons,
    );

  score +=
    scoreLocations(
      left,
      right,
      reasons,
    );

  score +=
    scoreDomains(
      left,
      right,
      reasons,
    );

  score +=
    scoreSkills(
      left,
      right,
      reasons,
    );

  score +=
    scoreTechnologies(
      left,
      right,
      reasons,
    );

  score +=
    scoreResearchAreas(
      left,
      right,
      reasons,
    );

  score +=
    scorePublications(
      left,
      right,
      reasons,
    );

  score +=
    scoreSharedCoauthorNetwork(
      left,
      right,
      reasons,
    );

  score +=
    scoreUrls(
      left,
      right,
      reasons,
    );

  score +=
    scoreHeadlineRole(
      left,
      right,
      reasons,
    );

  const normalizedScore =
    clampScore(
      score,
    );

  const confidence =
    confidenceFromScore(
      normalizedScore,
    );

  /**
   * Extra safety rule:
   *
   * An exact name match by itself is NOT enough for
   * automatic merging.
   *
   * Automatic merge requires either:
   *
   * - a shared source identity,
   * - a shared external URL,
   * - a shared publication plus another corroborating
   *   signal,
   * - or a sufficiently strong combination of independent
   *   signals.
   */
  const hasSourceIdentity =
    reasons.some(
      (reason) =>
        reason.signal ===
        "Shared external source identity",
    );

  const hasSharedUrl =
    reasons.some(
      (reason) =>
        reason.signal ===
        "Shared external URL",
    );

  const hasSharedPublication =
    reasons.some(
      (reason) =>
        reason.signal ===
        "Shared publication",
    );

  const corroboratingSignals =
    reasons.filter(
      (reason) =>
        reason.signal !==
        "Exact normalized name match" &&
        reason.signal !==
        "Strong partial name match",
    ).length;

  const strongEvidence =
    hasSourceIdentity ||
    hasSharedUrl ||
    (
      hasSharedPublication &&
      corroboratingSignals >=
        2
    ) ||
    (
      namesMatch(
        left,
        right,
      ) &&
      corroboratingSignals >=
        3
    );

  const shouldMerge =
    normalizedScore >=
      mergeThreshold &&
    strongEvidence;

  const requiresReview =
    !shouldMerge &&
    normalizedScore >=
      reviewThreshold;

  return {
    leftIdentityKey:
      buildIdentityKey(
        left,
      ),

    rightIdentityKey:
      buildIdentityKey(
        right,
      ),

    score:
      normalizedScore,

    confidence,

    shouldMerge,

    requiresReview,

    reasons,
  };
}

/**
 * Compare a record against a collection and return
 * the strongest identity candidate.
 */
export function findBestTechnicalTalentIdentityMatch(
  record: TechnicalTalentDiscoveryRecord,
  candidates: TechnicalTalentDiscoveryRecord[],
  options: TechnicalTalentIdentityResolverOptions = {},
): TechnicalTalentIdentityMatchResult | undefined {
  let best:
    | TechnicalTalentIdentityMatchResult
    | undefined;

  for (const candidate of candidates) {
    if (
      candidate.id ===
      record.id
    ) {
      continue;
    }

    const result =
      resolveTechnicalTalentIdentity(
        record,
        candidate,
        options,
      );

    if (
      !best ||
      result.score >
        best.score
    ) {
      best =
        result;
    }
  }

  return best;
}
