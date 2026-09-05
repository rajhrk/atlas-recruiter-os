// ============================================================
// Atlas Recruiter OS
// Adaptive Source Routing v1
// ============================================================

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

import {
  planTechnicalTalentEvidenceTrail,
  type EvidenceTrailRequirement,
  type TechnicalTalentEvidenceTrailPlan,
} from "@/lib/technicalTalent/technicalTalentEvidenceTrailPlanner";

export interface AdaptiveSourceRoutingState {
  completedRequirements: EvidenceTrailRequirement[];
  missingRequirements: EvidenceTrailRequirement[];
  partiallyCoveredRequirements: EvidenceTrailRequirement[];
  queriedSources: DiscoverySource[];
}

export interface AdaptiveSourceRoute {
  source: DiscoverySource;
  priority: number;
  targets: EvidenceTrailRequirement[];
  rationale: string;
}

export interface AdaptiveSourceRoutingPlan {
  evidencePlan: TechnicalTalentEvidenceTrailPlan;
  state: AdaptiveSourceRoutingState;
  routes: AdaptiveSourceRoute[];
  nextSource?: DiscoverySource;
}

function getRequirementPlans(
  plan: TechnicalTalentEvidenceTrailPlan,
): Map<
  EvidenceTrailRequirement,
  TechnicalTalentEvidenceTrailPlan["requirements"][number]
> {
  return new Map(
    plan.requirements.map(
      (requirement) => [
        requirement.requirement,
        requirement,
      ],
    ),
  );
}

function getQueriedSourceCount(
  requirement: EvidenceTrailRequirement,
  plan: TechnicalTalentEvidenceTrailPlan,
  queriedSources: Set<DiscoverySource>,
): number {
  const requirementPlan =
    getRequirementPlans(plan).get(requirement);

  if (!requirementPlan) {
    return 0;
  }

  return requirementPlan.capableSources.filter(
    (source) => queriedSources.has(source),
  ).length;
}

function isRequirementRuntimeCovered(
  requirement: EvidenceTrailRequirement,
  plan: TechnicalTalentEvidenceTrailPlan,
  queriedSources: Set<DiscoverySource>,
): boolean {
  const requirementPlan =
    getRequirementPlans(plan).get(requirement);

  if (!requirementPlan || !requirementPlan.required) {
    return true;
  }

  if (requirement === "Verification") {
    return queriedSources.size >= 2;
  }

  if (requirementPlan.minimumIndependentSources <= 0) {
    return true;
  }

  return (
    getQueriedSourceCount(
      requirement,
      plan,
      queriedSources,
    ) >=
    requirementPlan.minimumIndependentSources
  );
}

function getCompletedRequirements(
  plan: TechnicalTalentEvidenceTrailPlan,
  queriedSources: Set<DiscoverySource>,
): EvidenceTrailRequirement[] {
  return plan.requirements
    .filter(
      (requirement) =>
        !requirement.required ||
        isRequirementRuntimeCovered(
          requirement.requirement,
          plan,
          queriedSources,
        ),
    )
    .map(
      (requirement) =>
        requirement.requirement,
    );
}

function getMissingRequirements(
  plan: TechnicalTalentEvidenceTrailPlan,
  queriedSources: Set<DiscoverySource>,
): EvidenceTrailRequirement[] {
  return plan.requirements
    .filter(
      (requirement) =>
        requirement.required &&
        !isRequirementRuntimeCovered(
          requirement.requirement,
          plan,
          queriedSources,
        ),
    )
    .map(
      (requirement) =>
        requirement.requirement,
    );
}

function getPartiallyCoveredRequirements(
  plan: TechnicalTalentEvidenceTrailPlan,
  queriedSources: Set<DiscoverySource>,
): EvidenceTrailRequirement[] {
  return plan.requirements
    .filter((requirement) => {
      if (!requirement.required) {
        return false;
      }

      const queriedCount =
        getQueriedSourceCount(
          requirement.requirement,
          plan,
          queriedSources,
        );

      return (
        queriedCount > 0 &&
        !isRequirementRuntimeCovered(
          requirement.requirement,
          plan,
          queriedSources,
        )
      );
    })
    .map(
      (requirement) =>
        requirement.requirement,
    );
}

function getSourceTargets(
  source: TechnicalTalentDiscoverySourceAdapter,
  plan: TechnicalTalentEvidenceTrailPlan,
  queriedSources: Set<DiscoverySource>,
): EvidenceTrailRequirement[] {
  return plan.requirements
    .filter((requirement) => {
      if (!requirement.required) {
        return false;
      }

      if (
        queriedSources.has(
          source.config.source,
        )
      ) {
        return false;
      }

      if (
        isRequirementRuntimeCovered(
          requirement.requirement,
          plan,
          queriedSources,
        )
      ) {
        return false;
      }

      return requirement.capableSources.includes(
        source.config.source,
      );
    })
    .map(
      (requirement) =>
        requirement.requirement,
    );
}

function routePriority(
  source: TechnicalTalentDiscoverySourceAdapter,
  targets: EvidenceTrailRequirement[],
  plan: TechnicalTalentEvidenceTrailPlan,
): number {
  if (targets.length === 0) {
    return 0;
  }

  const targetPlans = getRequirementPlans(plan);

  const targetScores = targets.map(
    (requirement) => {
      const requirementPlan =
        targetPlans.get(requirement);

      if (!requirementPlan) {
        return 0;
      }

      const priorityIndex =
        requirementPlan.recommendedSources.indexOf(
          source.config.source,
        );

      const rankScore =
        priorityIndex === 0
          ? 100
          : priorityIndex === 1
            ? 80
            : priorityIndex === 2
              ? 60
              : 40;

      const coverageBonus =
        requirementPlan.coverage === "Uncovered"
          ? 20
          : requirementPlan.coverage ===
              "Partially Covered"
            ? 10
            : 0;

      return rankScore + coverageBonus;
    },
  );

  const bestTargetScore =
    Math.max(...targetScores, 0);

  const additionalTargetBonus =
    Math.min(
      30,
      Math.max(targets.length - 1, 0) * 10,
    );

  return (
    bestTargetScore +
    additionalTargetBonus
  );
}

function routeRationale(
  source: TechnicalTalentDiscoverySourceAdapter,
  targets: EvidenceTrailRequirement[],
  plan: TechnicalTalentEvidenceTrailPlan,
): string {
  const targetPlans = getRequirementPlans(plan);

  const targetLabels = targets.map(
    (requirement) => {
      const requirementPlan =
        targetPlans.get(requirement);

      const slots =
        requirementPlan?.evidenceSlots ?? [];

      return slots.length > 0
        ? `${requirement} (${slots.join(", ")})`
        : requirement;
    },
  );

  return `${source.config.source} is recommended because it can provide evidence for ${targetLabels.join("; ")}.`;
}

/**
 * Build the next adaptive source-routing plan.
 *
 * v1 is deterministic:
 * - planner determines what evidence is needed
 * - router removes already-queried sources
 * - remaining sources are ranked by planner recommendation
 * - no source is selected if it cannot satisfy a missing requirement
 *
 * This function does not execute sources.
 */
export function planAdaptiveSourceRouting(
  query: TechnicalTalentDiscoveryQuery,
  adapters: TechnicalTalentDiscoverySourceAdapter[],
  queriedSources: DiscoverySource[] = [],
): AdaptiveSourceRoutingPlan {
  const evidencePlan =
    planTechnicalTalentEvidenceTrail(
      query,
      adapters,
    );

  const queriedSourceSet =
    new Set(queriedSources);

  const completedRequirements =
    getCompletedRequirements(
        evidencePlan,
        queriedSourceSet,
    );

  const missingRequirements =
    getMissingRequirements(
      evidencePlan,
        queriedSourceSet,
    );

  const partiallyCoveredRequirements =
    getPartiallyCoveredRequirements(
      evidencePlan,
        queriedSourceSet,
    );

  const routes =
    adapters
      .filter(
        (adapter) =>
          adapter.config.enabled,
      )
      .map(
        (adapter) => {
          const targets =
            getSourceTargets(
              adapter,
              evidencePlan,
              queriedSourceSet,
            );

          return {
            source:
              adapter.config.source,
            priority:
              routePriority(
                adapter,
                targets,
                evidencePlan,
              ),
            targets,
            rationale:
              routeRationale(
                adapter,
                targets,
                evidencePlan,
              ),
          };
        },
      )
      .filter(
        (route) =>
          route.targets.length > 0 &&
          route.priority > 0,
      )
      .sort(
        (left, right) =>
          right.priority -
          left.priority,
      );

  return {
    evidencePlan,
    state: {
      completedRequirements,
      missingRequirements,
      partiallyCoveredRequirements,
      queriedSources,
    },
    routes,
    nextSource:
      routes[0]?.source,
  };
}
