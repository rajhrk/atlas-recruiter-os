import type {
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

import type {
  DiscoverySource,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
} from "@/types/technicalTalentDiscoverySource";

import {
  planTechnicalTalentEvidenceTrail,
  type EvidenceTrailRequirement,
  type TechnicalTalentEvidenceTrailPlan,
} from "@/lib/technicalTalent/technicalTalentEvidenceTrailPlanner";

import type {
  AdaptiveRuntimeEvidenceState,
} from "@/lib/technicalTalent/technicalTalentAdaptiveRuntimeEvidence";

import type {
  AdaptiveSourceRoute,
  AdaptiveSourceRoutingState,
  AdaptiveSourceRoutingPlan,
} from "@/lib/technicalTalent/technicalTalentAdaptiveSourceRouter";

export interface AdaptiveRuntimeSourceRoutingPlan
  extends AdaptiveSourceRoutingPlan {
  runtimeState: AdaptiveRuntimeEvidenceState;
}

function getRequirementPlans(
  plan: TechnicalTalentEvidenceTrailPlan,
): Map<
  EvidenceTrailRequirement,
  TechnicalTalentEvidenceTrailPlan["requirements"][number]
> {
  return new Map(
    plan.requirements.map((requirement) => [
      requirement.requirement,
      requirement,
    ]),
  );
}

function getRuntimeRouteTargets(
  source: DiscoverySource,
  plan: TechnicalTalentEvidenceTrailPlan,
  runtimeState: AdaptiveRuntimeEvidenceState,
): EvidenceTrailRequirement[] {
  const missing = new Set(runtimeState.missingRequirements);
  const partial = new Set(
    runtimeState.partiallyCoveredRequirements,
  );
  const queried = new Set(runtimeState.queriedSources);
  const exhausted = new Set(runtimeState.exhaustedSources);

  if (queried.has(source) || exhausted.has(source)) {
    return [];
  }

  return plan.requirements
    .filter((requirement) => {
      if (!requirement.required) {
        return false;
      }

      const name = requirement.requirement;

      if (!missing.has(name) && !partial.has(name)) {
        return false;
      }

      return requirement.capableSources.includes(source);
    })
    .map((requirement) => requirement.requirement);
}

function routePriority(
  source: DiscoverySource,
  targets: EvidenceTrailRequirement[],
  plan: TechnicalTalentEvidenceTrailPlan,
  runtimeState: AdaptiveRuntimeEvidenceState,
): number {
  if (targets.length === 0) {
    return 0;
  }

  const targetPlans = getRequirementPlans(plan);
  const missing = new Set(runtimeState.missingRequirements);
  const partial = new Set(
    runtimeState.partiallyCoveredRequirements,
  );

  const targetScores = targets.map((requirement) => {
    const requirementPlan = targetPlans.get(requirement);

    if (!requirementPlan) {
      return 0;
    }

    const priorityIndex =
      requirementPlan.recommendedSources.indexOf(source);

    const rankScore =
      priorityIndex === 0
        ? 100
        : priorityIndex === 1
          ? 80
          : priorityIndex === 2
            ? 60
            : 40;

    const coverageBonus = missing.has(requirement)
      ? 20
      : partial.has(requirement)
        ? 10
        : 0;

    return rankScore + coverageBonus;
  });

  const bestTargetScore = Math.max(...targetScores, 0);

  const additionalTargetBonus = Math.min(
    30,
    Math.max(targets.length - 1, 0) * 10,
  );

  return bestTargetScore + additionalTargetBonus;
}

function routeRationale(
  source: DiscoverySource,
  targets: EvidenceTrailRequirement[],
  plan: TechnicalTalentEvidenceTrailPlan,
): string {
  const targetPlans = getRequirementPlans(plan);

  const targetLabels = targets.map((requirement) => {
    const requirementPlan = targetPlans.get(requirement);
    const slots = requirementPlan?.evidenceSlots ?? [];

    return slots.length > 0
      ? `${requirement} (${slots.join(", ")})`
      : requirement;
  });

  return (
    `${source} is recommended because it can provide runtime evidence for ` +
    `${targetLabels.join("; ")}.`
  );
}

export function planAdaptiveRuntimeSourceRouting(
  query: TechnicalTalentDiscoveryQuery,
  adapters: TechnicalTalentDiscoverySourceAdapter[],
  runtimeState: AdaptiveRuntimeEvidenceState,
): AdaptiveRuntimeSourceRoutingPlan {
  const evidencePlan = planTechnicalTalentEvidenceTrail(
    query,
    adapters,
  );

  const routes: AdaptiveSourceRoute[] = adapters
    .filter((adapter) => adapter.config.enabled)
    .map((adapter) => {
      const source = adapter.config.source;
      const targets = getRuntimeRouteTargets(
        source,
        evidencePlan,
        runtimeState,
      );

      return {
        source,
        priority: routePriority(
          source,
          targets,
          evidencePlan,
          runtimeState,
        ),
        targets,
        rationale: routeRationale(
          source,
          targets,
          evidencePlan,
        ),
      };
    })
    .filter(
      (route) =>
        route.targets.length > 0 &&
        route.priority > 0,
    )
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return left.source.localeCompare(right.source);
    });

  const state: AdaptiveSourceRoutingState = {
    completedRequirements:
      runtimeState.completedRequirements,
    missingRequirements:
      runtimeState.missingRequirements,
    partiallyCoveredRequirements:
      runtimeState.partiallyCoveredRequirements,
    queriedSources: runtimeState.queriedSources,
  };

  return {
    evidencePlan,
    runtimeState,
    state,
    routes,
    nextSource: routes[0]?.source,
  };
}
