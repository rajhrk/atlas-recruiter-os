import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceCapabilities,
} from "@/types/technicalTalentDiscoverySource";

/**
 * Evidence requirements Atlas may need to satisfy for a
 * technical talent discovery query.
 */
export type EvidenceTrailRequirement =
  | "Identity"
  | "Technical"
  | "Employment"
  | "Location"
  | "Experience"
  | "Research"
  | "Open Source"
  | "Verification";

/**
 * A planned evidence requirement.
 */
export type EvidenceTrailCoverage =
  | "Covered"
  | "Partially Covered"
  | "Uncovered";

export interface EvidenceTrailRequirementPlan {
  requirement: EvidenceTrailRequirement;

  required: boolean;

  rationale: string;

  evidenceSlots: string[];

  capableSources: DiscoverySource[];

  recommendedSources: DiscoverySource[];

  minimumIndependentSources: number;

  coverage: EvidenceTrailCoverage;
}

/**
 * Complete evidence trail plan for a discovery query.
 */
export interface TechnicalTalentEvidenceTrailPlan {
  requirements: EvidenceTrailRequirementPlan[];

  recommendedSources: DiscoverySource[];

  uncoveredRequirements: EvidenceTrailRequirement[];

  partiallyCoveredRequirements: EvidenceTrailRequirement[];

  minimumIndependentSources: number;
}

/**
 * Source capability mapping for an evidence requirement.
 */
function getEvidenceSlots(
  query: TechnicalTalentDiscoveryQuery,
  requirement: EvidenceTrailRequirement,
): string[] {
  switch (requirement) {
    case "Identity":
      return ["person identity"];

    case "Technical":
      return [
        ...(query.skills ?? []).map(
          (skill) => `skill: ${skill}`,
        ),
        ...(query.technologies ?? []).map(
          (technology) => `technology: ${technology}`,
        ),
        ...(query.roleFamilies ?? []).map(
          (role) => `role: ${role}`,
        ),
        ...(query.domains ?? []).map(
          (domain) => `domain: ${domain}`,
        ),
      ].length > 0
        ? [
            ...(query.skills ?? []).map(
              (skill) => `skill: ${skill}`,
            ),
            ...(query.technologies ?? []).map(
              (technology) => `technology: ${technology}`,
            ),
            ...(query.roleFamilies ?? []).map(
              (role) => `role: ${role}`,
            ),
            ...(query.domains ?? []).map(
              (domain) => `domain: ${domain}`,
            ),
          ]
        : ["technical relevance"];

    case "Employment":
      return query.companies?.length
        ? query.companies.map(
            (company) => `employment: ${company}`,
          )
        : ["employment history"];

    case "Location":
      return [
        ...(query.locations ?? []).map(
          (location) => `location: ${location}`,
        ),
        ...(query.countries ?? []).map(
          (country) => `country: ${country}`,
        ),
      ];

    case "Experience":
      if (
        query.minimumExperienceYears !== undefined
      ) {
        return [
          `minimum experience: ${query.minimumExperienceYears} years`,
        ];
      }

      if (
        query.maximumExperienceYears !== undefined
      ) {
        return [
          `maximum experience: ${query.maximumExperienceYears} years`,
        ];
      }

      return ["career history"];

    case "Research":
      return [
        ...(query.researchAreas ?? []).map(
          (area) => `research area: ${area}`,
        ),
        ...(query.publications ?? []).map(
          (publication) => `publication: ${publication}`,
        ),
        ...(query.conferences ?? []).map(
          (conference) => `conference: ${conference}`,
        ),
      ].length > 0
        ? [
            ...(query.researchAreas ?? []).map(
              (area) => `research area: ${area}`,
            ),
            ...(query.publications ?? []).map(
              (publication) => `publication: ${publication}`,
            ),
            ...(query.conferences ?? []).map(
              (conference) => `conference: ${conference}`,
            ),
          ]
        : ["research activity"];

    case "Open Source":
      return query.repositories?.length
        ? query.repositories.map(
            (repository) => `repository: ${repository}`,
          )
        : ["open-source contribution"];

    case "Verification":
      return [
        "independent source corroboration",
      ];
  }
}

function supportsRequirement(
  capabilities: TechnicalTalentSourceCapabilities,
  requirement: EvidenceTrailRequirement,
): boolean {
  switch (requirement) {
    case "Identity":
      return Boolean(capabilities.identity);

    case "Technical":
      return Boolean(
        capabilities.technicalProfile ||
        capabilities.skills ||
        capabilities.technologies,
      );

    case "Employment":
      return Boolean(capabilities.employment);

    case "Location":
      return Boolean(capabilities.locations);

    /*
     * Experience is intentionally not mapped to employment.
     *
     * Employment evidence does not automatically establish
     * years of experience. The capability contract currently
     * has no dedicated experience capability.
     */
    case "Experience":
      return false;

    case "Research":
      return Boolean(
        capabilities.publications ||
        capabilities.researchProjects ||
        capabilities.conferences,
      );

    case "Open Source":
      return Boolean(
        capabilities.repositories ||
        capabilities.openSource,
      );

    /*
     * Verification is a cross-source requirement rather than
     * a capability provided by an individual source.
     */
    case "Verification":
      return false;
  }
}

/**
 * Rank sources for a particular evidence requirement.
 *
 * This is deliberately deterministic. Adaptive Source Routing
 * will later be able to replace this with dynamic routing.
 */
function sourcePriority(
  source: TechnicalTalentDiscoverySourceAdapter,
  requirement: EvidenceTrailRequirement,
): number {
  const capabilities = source.config.capabilities;

  switch (requirement) {
    case "Identity":
      if (capabilities.identity) return 100;
      return 0;

    case "Technical":
      if (
        capabilities.technicalProfile &&
        capabilities.technologies
      ) {
        return 100;
      }

      if (
        capabilities.technicalProfile ||
        capabilities.skills
      ) {
        return 90;
      }

      return 0;

    case "Employment":
      return capabilities.employment ? 100 : 0;

    case "Location":
      return capabilities.locations ? 100 : 0;

    case "Experience":
      return 0;

    case "Research":
      if (
        capabilities.publications &&
        capabilities.researchProjects
      ) {
        return 100;
      }

      if (capabilities.publications) return 90;

      if (capabilities.researchProjects) return 80;

      if (capabilities.conferences) return 70;

      return 0;

    case "Open Source":
      if (
        capabilities.repositories &&
        capabilities.openSource
      ) {
        return 100;
      }

      if (capabilities.repositories) return 90;

      if (capabilities.openSource) return 80;

      return 0;

    case "Verification":
      return 0;
  }
}

/**
 * Return the requirements implied by a discovery query.
 */
function buildRequirements(
  query: TechnicalTalentDiscoveryQuery,
): Array<{
  requirement: EvidenceTrailRequirement;
  required: boolean;
  rationale: string;
  minimumIndependentSources: number;
}> {
  const requirements: Array<{
    requirement: EvidenceTrailRequirement;
    required: boolean;
    rationale: string;
    minimumIndependentSources: number;
  }> = [
    {
      requirement: "Identity",
      required: true,
      rationale:
        "Every discovered candidate should have an evidence-backed identity.",
      minimumIndependentSources: 1,
    },
    {
      requirement: "Technical",
      required: true,
      rationale:
        "Technical discovery requires evidence supporting the candidate's technical relevance.",
      minimumIndependentSources: 1,
    },
  ];

  const hasEmploymentConstraint =
    Boolean(query.companies?.length);

  requirements.push({
    requirement: "Employment",
    required: hasEmploymentConstraint,
    rationale: hasEmploymentConstraint
      ? "The query contains company constraints that require employment evidence."
      : "Employment evidence strengthens candidate verification even when no company constraint is supplied.",
    minimumIndependentSources: hasEmploymentConstraint ? 1 : 0,
  });

  const hasLocationConstraint =
    Boolean(
      query.locations?.length ||
      query.countries?.length,
    );

  requirements.push({
    requirement: "Location",
    required: hasLocationConstraint,
    rationale: hasLocationConstraint
      ? "The query contains a location constraint that requires location evidence."
      : "Location evidence is optional when the query has no location constraint.",
    minimumIndependentSources: hasLocationConstraint ? 1 : 0,
  });

  const hasExperienceConstraint =
    query.minimumExperienceYears !== undefined ||
    query.maximumExperienceYears !== undefined;

  requirements.push({
    requirement: "Experience",
    required: hasExperienceConstraint,
    rationale: hasExperienceConstraint
      ? "The query contains an experience constraint that requires career-history evidence."
      : "Experience evidence is optional when the query has no experience constraint.",
    minimumIndependentSources: hasExperienceConstraint ? 1 : 0,
  });

  const researchRequired =
    Boolean(
      query.researchAreas?.length ||
      query.publications?.length ||
      query.conferences?.length ||
      query.researchFocused ||
      query.talentTypes?.some(
        (type) =>
          type === "Professor" ||
          type === "PhD Researcher" ||
          type === "Postdoctoral Researcher",
      ),
    );

  requirements.push({
    requirement: "Research",
    required: researchRequired,
    rationale: researchRequired
      ? "The query contains research-oriented signals."
      : "Research evidence is optional for this query.",
    minimumIndependentSources: researchRequired ? 1 : 0,
  });

  const openSourceRequired =
    Boolean(
      query.repositories?.length ||
      query.openSourceFocused,
    );

  requirements.push({
    requirement: "Open Source",
    required: openSourceRequired,
    rationale: openSourceRequired
      ? "The query contains open-source or repository requirements."
      : "Open-source evidence is optional for this query.",
    minimumIndependentSources: openSourceRequired ? 1 : 0,
  });

  requirements.push({
    requirement: "Verification",
    required: true,
    rationale:
      "Important candidate facts should be corroborated across independent sources whenever possible.",
    minimumIndependentSources: 2,
  });

  return requirements;
}

/**
 * Build an evidence trail before source execution.
 *
 * This planner does not query sources and does not score candidates.
 */
export function planTechnicalTalentEvidenceTrail(
  query: TechnicalTalentDiscoveryQuery,
  adapters: TechnicalTalentDiscoverySourceAdapter[],
): TechnicalTalentEvidenceTrailPlan {
  const requirements = buildRequirements(query);

  const activeAdapters =
    adapters.filter(
      (adapter) => adapter.config.enabled,
    );

  const plannedRequirements =
    requirements.map(
      ({
        requirement,
        required,
        rationale,
        minimumIndependentSources,
      }) => {
        const evidenceSlots =
          getEvidenceSlots(
            query,
            requirement,
          );

        const capableSources =
          activeAdapters
            .filter((adapter) =>
              supportsRequirement(
                adapter.config.capabilities,
                requirement,
              ),
            )
            .map(
              (adapter) =>
                adapter.config.source,
            );

        const recommendedSources =
          activeAdapters
            .filter((adapter) =>
              supportsRequirement(
                adapter.config.capabilities,
                requirement,
              ),
            )
            .sort(
              (left, right) =>
                sourcePriority(
                  right,
                  requirement,
                ) -
                sourcePriority(
                  left,
                  requirement,
                ),
            )
            .map(
              (adapter) =>
                adapter.config.source,
            );

        const coverage: EvidenceTrailCoverage =
          !required ||
          requirement === "Verification"
            ? "Covered"
            : capableSources.length === 0
              ? "Uncovered"
              : capableSources.length === 1
                ? "Partially Covered"
                : "Covered";

        return {
          requirement,
          required,
          rationale,
          evidenceSlots,
          capableSources,
          recommendedSources,
          minimumIndependentSources,
          coverage,
        };
      },
    );

  const requiredSourceRecommendations =
    plannedRequirements.flatMap(
      (plan) =>
        plan.required
          ? plan.recommendedSources
          : [],
    );

  const recommendedSources =
    Array.from(
      new Set(
        requiredSourceRecommendations,
      ),
    );

  const uncoveredRequirements =
    plannedRequirements
      .filter(
        (plan) =>
          plan.required &&
          plan.coverage === "Uncovered",
      )
      .map(
        (plan) =>
          plan.requirement,
      );

  const partiallyCoveredRequirements =
    plannedRequirements
      .filter(
        (plan) =>
          plan.required &&
          plan.coverage === "Partially Covered",
      )
      .map(
        (plan) =>
          plan.requirement,
      );

  return {
    requirements:
      plannedRequirements,

    recommendedSources,

    uncoveredRequirements,

    partiallyCoveredRequirements,

    minimumIndependentSources: Math.max(
      ...plannedRequirements.map(
        (plan) =>
          plan.required
            ? plan.minimumIndependentSources
            : 0,
      ),
      0,
    ),
  };
}
