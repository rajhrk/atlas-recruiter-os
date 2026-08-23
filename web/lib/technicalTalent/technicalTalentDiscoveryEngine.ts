// ============================================================
// Atlas Recruiter OS
// Technical Talent Discovery Engine
//
// Deterministic discovery over the unified technical talent
// intelligence index.
//
// This layer does NOT use AI.
// It provides predictable filtering and matching that can
// later become one stage inside Atlas's AI discovery pipeline.
// ============================================================

import {
  technicalTalentDiscoveryIndex,
} from "@/lib/technicalTalent/technicalTalentDiscoveryIndex";

import {
  scoreTechnicalTalentCandidate,
} from "@/lib/technicalTalent/technicalTalentFitScorer";

import {
  buildTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphBuilder";

import type {
  GraphNode,
  GraphEdge,
} from "@/types/graph";

import {
  queryTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphQuery";

import type {
  DiscoveryConfidence,
  DiscoveryTechnicalDomain,
  DiscoveryTalentType,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
  TechnicalTalentDiscoveryResult,
} from "@/types/technicalTalentDiscovery";

/**
 * Confidence ranking used when applying minimum-confidence
 * filters.
 */
const CONFIDENCE_RANK: Record<
  DiscoveryConfidence,
  number
> = {
  Low: 1,
  Medium: 2,
  High: 3,
  "Very High": 4,
};

/**
 * Normalize free-text comparison values.
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim();
}

/**
 * Check whether a candidate record contains a term
 * anywhere in its normalized technical profile.
 */
function recordContainsTerm(
  record: TechnicalTalentDiscoveryRecord,
  term: string,
): boolean {
  const normalizedTerm = normalize(term);

  const values = [
    record.name,
    record.headline,
    record.primaryDomain,
    record.roleFamily,
    record.normalizedRole,
    record.seniority,
    record.talentType,

    ...(record.secondaryDomains ?? []),

    ...record.skills.flatMap(
      (skill) => [
        skill.name,
        skill.normalizedName,
      ],
    ),

    ...record.technologies.flatMap(
      (technology) => [
        technology.name,
        technology.normalizedName,
        technology.category,
      ],
    ),

    ...(record.researchAreas ?? []),

    ...(record.recruiterNotes ?? []),

    ...(record.affiliations ?? []).flatMap(
      (affiliation) => [
        affiliation.organization,
        affiliation.title,
        affiliation.normalizedTitle,
        affiliation.location,
      ],
    ),

    ...(record.conferences ?? []).flatMap(
      (conference) => [
        conference.name,
        conference.paperTitle,
      ],
    ),

    ...(record.sourcingSignals ?? []).flatMap(
      (signal) => [
        signal.signal,
        signal.explanation,
      ],
    ),
  ];

  return values
    .filter(
      (value): value is string =>
        Boolean(value),
    )
    .some((value) =>
      normalize(value).includes(
        normalizedTerm,
      ),
    );
}

/**
 * Return whether a record demonstrates a specific skill.
 */
function hasSkill(
  record: TechnicalTalentDiscoveryRecord,
  skill: string,
): boolean {
  const target = normalize(skill);

  return record.skills.some(
    (item) =>
      normalize(item.name) === target ||
      normalize(
        item.normalizedName ?? "",
      ) === target ||
      normalize(item.name).includes(target),
  );
}

/**
 * Return whether a record demonstrates a specific technology.
 */
function hasTechnology(
  record: TechnicalTalentDiscoveryRecord,
  technology: string,
): boolean {
  const target = normalize(technology);

  return record.technologies.some(
    (item) =>
      normalize(item.name) === target ||
      normalize(
        item.normalizedName ?? "",
      ) === target ||
      normalize(item.name).includes(target),
  );
}

/**
 * Return whether a record is associated with a requested
 * company.
 */
function hasCompany(
  record: TechnicalTalentDiscoveryRecord,
  company: string,
): boolean {
  const target = normalize(company);

  return (
    record.affiliations?.some(
      (affiliation) =>
        normalize(
          affiliation.organization,
        ).includes(target),
    ) ?? false
  );
}

/**
 * Return whether a record is associated with a requested
 * location.
 */
function hasLocation(
  record: TechnicalTalentDiscoveryRecord,
  location: string,
): boolean {
  const target = normalize(location);

  const directLocationValues = [
    record.location,
    record.city,
    record.country,
  ];

  const affiliationLocations =
    record.affiliations?.map(
      (affiliation) =>
        affiliation.location,
    ) ?? [];

  return [
    ...directLocationValues,
    ...affiliationLocations,
  ]
    .filter(
      (value): value is string =>
        Boolean(value),
    )
    .some((value) =>
      normalize(value).includes(target),
    );
}

/**
 * Return whether a record demonstrates a requested
 * research area.
 */
function hasResearchArea(
  record: TechnicalTalentDiscoveryRecord,
  researchArea: string,
): boolean {
  const target = normalize(researchArea);

  return (
    record.researchAreas?.some(
      (area) =>
        normalize(area).includes(target),
    ) ?? false
  );
}

/**
 * Return whether a record has a conference signal.
 */
function hasConference(
  record: TechnicalTalentDiscoveryRecord,
  conference: string,
): boolean {
  const target = normalize(conference);

  return (
    record.conferences?.some(
      (item) =>
        normalize(item.name).includes(
          target,
        ),
    ) ?? false
  );
}

/**
 * Determine whether a record demonstrates evidence from
 * more than one technical domain.
 */
function isCrossDomain(
  record: TechnicalTalentDiscoveryRecord,
): boolean {
  return (
    (record.secondaryDomains?.length ?? 0) >
    0
  );
}

/**
 * Apply deterministic filtering to one record.
 */
function matchesQuery(
  record: TechnicalTalentDiscoveryRecord,
  query: TechnicalTalentDiscoveryQuery,
): boolean {
  if (
    query.domains?.length &&
    !query.domains.includes(
      record.primaryDomain,
    )
  ) {
    return false;
  }

  if (
    query.talentTypes?.length &&
    (!record.talentType ||
      !query.talentTypes.includes(
        record.talentType,
      ))
  ) {
    return false;
  }

  if (
    query.roleFamilies?.length &&
    (!record.roleFamily ||
      !query.roleFamilies.some(
        (family) =>
          normalize(record.roleFamily ?? "") ===
          normalize(family),
      ))
  ) {
    return false;
  }

  if (
    query.skills?.length &&
    !query.skills.every(
      (skill) =>
        hasSkill(record, skill),
    )
  ) {
    return false;
  }

  if (
    query.technologies?.length &&
    !query.technologies.every(
      (technology) =>
        hasTechnology(
          record,
          technology,
        ),
    )
  ) {
    return false;
  }

  if (
    query.researchAreas?.length &&
    !query.researchAreas.every(
      (area) =>
        hasResearchArea(
          record,
          area,
        ),
    )
  ) {
    return false;
  }

  if (
    query.companies?.length &&
    !query.companies.every(
      (company) =>
        hasCompany(record, company),
    )
  ) {
    return false;
  }

  if (
    query.locations?.length &&
    !query.locations.some(
      (location) =>
        hasLocation(record, location),
    )
  ) {
    return false;
  }

  if (
    query.countries?.length &&
    !query.countries.some(
      (country) =>
        hasLocation(record, country),
    )
  ) {
    return false;
  }

  if (
    query.conferences?.length &&
    !query.conferences.every(
      (conference) =>
        hasConference(
          record,
          conference,
        ),
    )
  ) {
    return false;
  }

  if (
    query.minimumFitScore !== undefined
  ) {
    if (
      (record.fitScore?.overall ?? 0) <
      query.minimumFitScore
    ) {
      return false;
    }
  }

  if (
    query.minimumConfidence
  ) {
    if (
      !record.confidence ||
      CONFIDENCE_RANK[
        record.confidence
      ] <
        CONFIDENCE_RANK[
          query.minimumConfidence
        ]
    ) {
      return false;
    }
  }

  if (
    query.researchFocused &&
    (!record.researchAreas ||
      record.researchAreas.length === 0)
  ) {
    return false;
  }

  if (
    query.openSourceFocused &&
    (!record.repositories ||
      record.repositories.length === 0)
  ) {
    return false;
  }

  if (
    query.patentFocused &&
    (!record.patents ||
      record.patents.length === 0)
  ) {
    return false;
  }

  if (
    query.crossDomainOnly &&
    !isCrossDomain(record)
  ) {
    return false;
  }

  if (
    query.keywords?.length &&
    !query.keywords.every(
      (keyword) =>
        recordContainsTerm(
          record,
          keyword,
        ),
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Build one technical talent graph from the candidate
 * population currently participating in discovery.
 *
 * Graph matching is scoped to the active discovery
 * population so graph evidence cannot introduce candidates
 * that failed the deterministic discovery filters.
 */
function buildDiscoveryGraph(
  candidates: TechnicalTalentDiscoveryRecord[],
) {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (const candidate of candidates) {
    const candidateGraph =
      buildTechnicalTalentGraph(
        candidate,
      );

    for (const node of candidateGraph.nodes) {
      if (
        !nodes.some(
          (existing) =>
            existing.id === node.id &&
            existing.type === node.type,
        )
      ) {
        nodes.push(node);
      }
    }

    for (const edge of candidateGraph.edges) {
      if (
        !edges.some(
          (existing) =>
            existing.from === edge.from &&
            existing.to === edge.to &&
            existing.relationship ===
              edge.relationship,
        )
      ) {
        edges.push(edge);
      }
    }
  }

  return {
    nodes,
    edges,
  };
}

/**
 * Convert the recruiter discovery query into the graph
 * query contract.
 *
 * Only fields with a direct graph representation are mapped.
 */
function buildGraphQuery(
  query: TechnicalTalentDiscoveryQuery,
) {
  return {
    skills:
      query.skills,

    technologies:
      query.technologies,

    researchAreas:
      query.researchAreas,

    conferences:
      query.conferences,
  };
}

/**
 * Run a deterministic discovery query.
 */
export function discoverTechnicalTalent(
  query: TechnicalTalentDiscoveryQuery = {},
): TechnicalTalentDiscoveryResult {
  /**
   * Score every indexed record before filtering.
   *
   * This is important because matchesQuery() supports
   * minimumFitScore and therefore must see the newly
   * calculated fitScore.
   */
  const scoredIndex =
    technicalTalentDiscoveryIndex.map(
      (record) => ({
        ...record,

        fitScore:
          scoreTechnicalTalentCandidate(
            record,
            query,
          ),
      }),
    );

  /**
   * Preserve the existing deterministic filtering
   * behavior, but now filters operate against the
   * newly calculated fit score.
   */
  let candidates =
    scoredIndex.filter(
      (record) =>
        matchesQuery(
          record,
          query,
        ),
    );

  const total =
    candidates.length;

  /**
   * Rank strongest candidates first.
   *
   * Tie-breakers:
   * 1. Overall fit
   * 2. Technical fit
   * 3. Evidence strength
   *
   * Array sort in modern JavaScript is stable, so
   * candidates with identical values retain their
   * original discovery-index ordering.
   */
  candidates =
    candidates.sort(
      (a, b) => {
        const overallDifference =
          (b.fitScore?.overall ?? 0) -
          (a.fitScore?.overall ?? 0);

        if (
          overallDifference !== 0
        ) {
          return overallDifference;
        }

        const technicalDifference =
          (b.fitScore?.technical ?? 0) -
          (a.fitScore?.technical ?? 0);

        if (
          technicalDifference !== 0
        ) {
          return technicalDifference;
        }

        return (
          (b.fitScore?.evidence ?? 0) -
          (a.fitScore?.evidence ?? 0)
        );
      },
    );

  const offset = Math.max(
    query.offset ?? 0,
    0,
  );

  const limit = Math.max(
    query.limit ?? 50,
    1,
  );

  candidates =
    candidates.slice(
      offset,
      offset + limit,
    );

  /*
   * Graph matching is intentionally performed after
   * pagination.
   *
   * This guarantees that graphMatches corresponds exactly
   * to the candidate page returned by this discovery query.
   *
   * The existing fitScore and deterministic ranking remain
   * authoritative; graph evidence is an explainable
   * complementary signal.
   */
  const graph =
    buildDiscoveryGraph(
      candidates,
    );

  const graphMatches =
    queryTechnicalTalentGraph(
      graph,
      buildGraphQuery(
        query,
      ),
    );

  return {
    query,

    candidates,

    total,

    graphMatches,

    sourcesUsed: [
      "Company",
      "University",
      "Research Lab",
      "GitHub",
      "Google Scholar",
      "IEEE",
    ],

    searchedAt:
      new Date().toISOString(),
  };
}

/**
 * Convenience helper for cross-domain discovery.
 */
export function discoverAcrossTechnicalDomains(
  keywords: string[],
  options: Omit<
    TechnicalTalentDiscoveryQuery,
    "keywords" | "domains"
  > = {},
): TechnicalTalentDiscoveryResult {
  return discoverTechnicalTalent({
    ...options,
    keywords,
    domains: [
      "AI / ML",
      "Robotics",
      "Hardware / Embedded",
      "Semiconductor",
    ],
  });
}