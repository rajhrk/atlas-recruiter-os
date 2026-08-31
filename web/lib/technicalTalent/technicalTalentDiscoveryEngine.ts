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

import {
  rankTechnicalTalentCandidates,
} from "@/lib/graph/technicalTalentCombinedRanking";

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
 * Convert an Atlas discovery candidate ID into the
 * canonical technical talent graph candidate ID.
 */
function graphCandidateId(
  candidateId: string,
): string {
  return `candidate:${candidateId}`;
}

/**
 * Convert a canonical graph candidate ID back into the
 * Atlas discovery candidate ID used by the discovery API.
 */
function discoveryCandidateId(
  candidateId: string,
): string {
  return candidateId.startsWith("candidate:")
    ? candidateId.slice("candidate:".length)
    : candidateId;
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

    repositories:
      query.repositories,

    publications:
      query.publications,

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
   * Build the graph from every candidate that survived
   * deterministic discovery filtering.
   *
   * Graph evidence must be available before pagination
   * because combined ranking can change candidate order.
   */
  const graph =
    buildDiscoveryGraph(
      candidates,
    );


  /**
   * Run the graph query across the full filtered
   * candidate population.
   *
   * Do not apply query.limit here. Pagination must happen
   * only after combined fit + graph ranking.
   */
  const graphQuery =
    buildGraphQuery(
      query,
    );


  const graphMatches =
    queryTechnicalTalentGraph(
      graph,
      graphQuery,
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

  /**
   * Combine the existing evidence-first fit score with
   * graph evidence.
   *
   * Fit remains 70%.
   * Graph evidence contributes 30%.
   *
   * Every candidate in this deterministic graph pipeline
   * has graph evidence available, including candidates with
   * zero graph matches. Those candidates therefore receive
   * an explicit graph score of zero rather than being treated
   * as unavailable.
   */
  const combinedRankings =
    rankTechnicalTalentCandidates(
      candidates.map(
        (candidate) => ({
          candidateId:
            candidate.id,

          candidateLabel:
            candidate.name,

          fitScore:
            candidate.fitScore?.overall ?? 0,

          graphMatch:
            graphMatchByCandidateId.get(
              graphCandidateId(
                candidate.id,
              ),
            ),

          graphEvidenceAvailable:
            true,

          graphMatchRequestedSignalCount:
            [
              ...(query.skills ?? []),
              ...(query.technologies ?? []),
              ...(query.researchAreas ?? []),
              ...(query.conferences ?? []),
            ].length,
        }),
      ),
    );

  const candidateById =
    new Map(
      candidates.map(
        (candidate) => [
          candidate.id,
          candidate,
        ],
      ),
    );

  /**
   * Reorder the actual discovery records according to
   * the combined ranking.
   */
  candidates =
    combinedRankings.map(
      (ranking) => {
        const candidate =
          candidateById.get(
            ranking.candidateId,
          );

        if (!candidate) {
          throw new Error(
            `Discovery ranking referenced unknown candidate: ${ranking.candidateId}`,
          );
        }

        return candidate;
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

  const paginatedCandidates =
    candidates.slice(
      offset,
      offset + limit,
    );

  const returnedCandidateIds =
    new Set(
      paginatedCandidates.map(
        (candidate) =>
          candidate.id,
      ),
    );

  const paginatedGraphMatches =
    graphMatches
      .filter(
        (match) =>
          returnedCandidateIds.has(
            discoveryCandidateId(
              match.candidateId,
            ),
          ),
      )
      .map(
        (match) => ({
          ...match,

          candidateId:
            discoveryCandidateId(
              match.candidateId,
            ),
        }),
      );

  const rankings =
    combinedRankings.filter(
      (ranking) =>
        returnedCandidateIds.has(
          ranking.candidateId,
        ),
    );

  return {
    query,

    candidates:
      paginatedCandidates,

    total,

    graphMatches:
      paginatedGraphMatches,

    rankings,

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
