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
  type EvidenceTrailRequirementPlan,
  type TechnicalTalentEvidenceTrailPlan,
} from "@/lib/technicalTalent/technicalTalentEvidenceTrailPlanner";

import {
  planAdaptiveSourceRouting,
  type AdaptiveSourceRoute,
} from "@/lib/technicalTalent/technicalTalentAdaptiveSourceRouter";

export interface EvidenceFirstDiscoveryObjective {
  requirement: EvidenceTrailRequirement;
  evidenceSlot: string;
  source: DiscoverySource;
  priority: number;
  rationale: string;
}

export interface EvidenceFirstDiscoveryPlan {
  evidencePlan: TechnicalTalentEvidenceTrailPlan;
  objectives: EvidenceFirstDiscoveryObjective[];
  routes: AdaptiveSourceRoute[];
  nextSource?: DiscoverySource;
}

function getRequirementPlans(
  plan: TechnicalTalentEvidenceTrailPlan,
): Map<
  EvidenceTrailRequirement,
  EvidenceTrailRequirementPlan
> {
  return new Map(
    plan.requirements.map((requirement) => [
      requirement.requirement,
      requirement,
    ]),
  );
}

function buildObjectiveRationale(
  requirement: EvidenceTrailRequirementPlan,
  evidenceSlot: string,
  source: DiscoverySource,
): string {
  return (
    `${source} is used to discover candidates through ` +
    `${requirement.requirement} evidence: ${evidenceSlot}.`
  );
}

/**
 * Build evidence-first discovery objectives.
 *
 * v1 deliberately plans discovery only.
 * It does not execute sources, resolve identities,
 * verify candidates, or score candidates.
 */
export function planEvidenceFirstDiscovery(
  query: TechnicalTalentDiscoveryQuery,
  adapters: TechnicalTalentDiscoverySourceAdapter[],
  queriedSources: DiscoverySource[] = [],
): EvidenceFirstDiscoveryPlan {
  const evidencePlan =
    planTechnicalTalentEvidenceTrail(
      query,
      adapters,
    );

  const routingPlan =
    planAdaptiveSourceRouting(
      query,
      adapters,
      queriedSources,
    );

  const requirementPlans =
    getRequirementPlans(evidencePlan);

  const objectives: EvidenceFirstDiscoveryObjective[] =
    routingPlan.routes.flatMap((route) =>
      route.targets.flatMap((requirementName) => {
        const requirement =
          requirementPlans.get(requirementName);

        if (!requirement) {
          return [];
        }

        return requirement.evidenceSlots.map(
          (evidenceSlot) => ({
            requirement: requirementName,
            evidenceSlot,
            source: route.source,
            priority: route.priority,
            rationale: buildObjectiveRationale(
              requirement,
              evidenceSlot,
              route.source,
            ),
          }),
        );
      }),
    );

  return {
    evidencePlan,
    objectives,
    routes: routingPlan.routes,
    nextSource: routingPlan.nextSource,
  };
}
