import type {
  DiscoverySource,
} from "@/types/technicalTalentDiscovery";
import type {
  EvidenceTrailRequirement,
  TechnicalTalentEvidenceTrailPlan,
} from "@/lib/technicalTalent/technicalTalentEvidenceTrailPlanner";
import type {
  EvidenceFirstDiscoveryExecution,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscoveryExecutor";

export interface AdaptiveRuntimeRequirementEvidence {
  requirement: EvidenceTrailRequirement;
  evidenceIds: string[];
  sources: DiscoverySource[];
  candidateIds: string[];
  matchedSlots: string[];
}

export interface AdaptiveRuntimeEvidenceState {
  queriedSources: DiscoverySource[];
  exhaustedSources: DiscoverySource[];
  evidenceByRequirement: AdaptiveRuntimeRequirementEvidence[];
  completedRequirements: EvidenceTrailRequirement[];
  missingRequirements: EvidenceTrailRequirement[];
  partiallyCoveredRequirements: EvidenceTrailRequirement[];
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function getObjectiveEvidence(
  executions: EvidenceFirstDiscoveryExecution[],
  requirement: EvidenceTrailRequirement,
): AdaptiveRuntimeRequirementEvidence {
  const evidenceIds: string[] = [];
  const sources: DiscoverySource[] = [];
  const candidateIds: string[] = [];
  const matchedSlots: string[] = [];

  for (const execution of executions) {
    for (const surface of execution.candidates) {
      for (const match of surface.matchedObjectives) {
        if (match.requirement !== requirement) {
          continue;
        }

        evidenceIds.push(...match.evidenceIds);
        sources.push(match.source);
        candidateIds.push(surface.candidateId);
        matchedSlots.push(match.evidenceSlot);
      }
    }
  }

  return {
    requirement,
    evidenceIds: unique(evidenceIds),
    sources: unique(sources),
    candidateIds: unique(candidateIds),
    matchedSlots: unique(matchedSlots),
  };
}

function getRuntimeEvidence(
  executions: EvidenceFirstDiscoveryExecution[],
  requirement: EvidenceTrailRequirement,
): AdaptiveRuntimeRequirementEvidence {
  if (requirement === "Verification") {
    const relevantSources: DiscoverySource[] = [];
    const relevantEvidenceIds: string[] = [];
    const relevantCandidateIds: string[] = [];

    for (const execution of executions) {
      const hasRelevantEvidence = execution.candidates.some(
        (surface) => surface.matchedObjectives.length > 0,
      );

      if (!hasRelevantEvidence) {
        continue;
      }

      relevantSources.push(execution.source);

      for (const surface of execution.candidates) {
        relevantCandidateIds.push(surface.candidateId);
        for (const match of surface.matchedObjectives) {
          relevantEvidenceIds.push(...match.evidenceIds);
        }
      }
    }

    return {
      requirement,
      evidenceIds: unique(relevantEvidenceIds),
      sources: unique(relevantSources),
      candidateIds: unique(relevantCandidateIds),
      matchedSlots: [],
    };
  }

  return getObjectiveEvidence(executions, requirement);
}

function isRequirementCovered(
  requirement: EvidenceTrailRequirement,
  plan: TechnicalTalentEvidenceTrailPlan,
  evidence: AdaptiveRuntimeRequirementEvidence,
): boolean {
  const requirementPlan = plan.requirements.find(
    (item) => item.requirement === requirement,
  );

  if (!requirementPlan || !requirementPlan.required) {
    return true;
  }

  if (requirement === "Experience") {
    return false;
  }

  if (requirement === "Verification") {
    return evidence.sources.length >= 2;
  }

  if (requirementPlan.minimumIndependentSources <= 0) {
    return true;
  }

  return (
    evidence.sources.length >=
    requirementPlan.minimumIndependentSources
  );
}

function isRequirementPartiallyCovered(
  requirement: EvidenceTrailRequirement,
  plan: TechnicalTalentEvidenceTrailPlan,
  evidence: AdaptiveRuntimeRequirementEvidence,
): boolean {
  const requirementPlan = plan.requirements.find(
    (item) => item.requirement === requirement,
  );

  if (!requirementPlan || !requirementPlan.required) {
    return false;
  }

  if (isRequirementCovered(requirement, plan, evidence)) {
    return false;
  }

  return evidence.evidenceIds.length > 0;
}

export function buildAdaptiveRuntimeEvidenceState(
  plan: TechnicalTalentEvidenceTrailPlan,
  executions: EvidenceFirstDiscoveryExecution[],
  queriedSources: DiscoverySource[] = [],
  exhaustedSources: DiscoverySource[] = [],
): AdaptiveRuntimeEvidenceState {
  const evidenceByRequirement = plan.requirements.map((requirement) =>
    getRuntimeEvidence(
      executions,
      requirement.requirement,
    ),
  );

  const completedRequirements = plan.requirements
    .filter((requirement) =>
      isRequirementCovered(
        requirement.requirement,
        plan,
        evidenceByRequirement.find(
          (item) => item.requirement === requirement.requirement,
        ) ?? {
          requirement: requirement.requirement,
          evidenceIds: [],
          sources: [],
          candidateIds: [],
          matchedSlots: [],
        },
      ),
    )
    .map((requirement) => requirement.requirement);

  const missingRequirements = plan.requirements
    .filter((requirement) => {
      if (!requirement.required) {
        return false;
      }

      const evidence =
        evidenceByRequirement.find(
          (item) => item.requirement === requirement.requirement,
        ) ?? {
          requirement: requirement.requirement,
          evidenceIds: [],
          sources: [],
          candidateIds: [],
          matchedSlots: [],
        };

      return !isRequirementCovered(
        requirement.requirement,
        plan,
        evidence,
      );
    })
    .map((requirement) => requirement.requirement);

  const partiallyCoveredRequirements = plan.requirements
    .filter((requirement) => {
      const evidence =
        evidenceByRequirement.find(
          (item) => item.requirement === requirement.requirement,
        ) ?? {
          requirement: requirement.requirement,
          evidenceIds: [],
          sources: [],
          candidateIds: [],
          matchedSlots: [],
        };

      return isRequirementPartiallyCovered(
        requirement.requirement,
        plan,
        evidence,
      );
    })
    .map((requirement) => requirement.requirement);

  return {
    queriedSources: unique(queriedSources),
    exhaustedSources: unique(exhaustedSources),
    evidenceByRequirement,
    completedRequirements,
    missingRequirements,
    partiallyCoveredRequirements,
  };
}

export function mergeAdaptiveRuntimeEvidenceExecutions(
  executions: EvidenceFirstDiscoveryExecution[],
  nextExecutions: EvidenceFirstDiscoveryExecution[],
): EvidenceFirstDiscoveryExecution[] {
  return [...executions, ...nextExecutions];
}

export function getRuntimeCandidateEvidence(
  state: AdaptiveRuntimeEvidenceState,
  candidateId: string,
): AdaptiveRuntimeRequirementEvidence[] {
  return state.evidenceByRequirement.filter((item) =>
    item.candidateIds.includes(candidateId),
  );
}
