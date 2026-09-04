import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceResult,
  TechnicalTalentSourceQuery,
} from "@/types/technicalTalentDiscoverySource";

import type {
  EvidenceFirstDiscoveryObjective,
} from "@/lib/technicalTalent/technicalTalentEvidenceFirstDiscovery";

export interface EvidenceFirstCandidateObjectiveMatch {
  requirement: EvidenceFirstDiscoveryObjective["requirement"];
  evidenceSlot: string;
  source: DiscoverySource;
  evidenceIds: string[];
  rationale: string;
}

export interface EvidenceFirstCandidateSurface {
  candidateId: string;
  candidate: TechnicalTalentDiscoveryRecord;
  source: DiscoverySource;
  matchedObjectives: EvidenceFirstCandidateObjectiveMatch[];
}

export interface EvidenceFirstDiscoveryExecution {
  source: DiscoverySource;
  objectives: EvidenceFirstDiscoveryObjective[];
  result?: TechnicalTalentSourceResult;
  candidates: EvidenceFirstCandidateSurface[];
  error?: string;
  durationMs: number;
}

function createSourceRequest(
  query: TechnicalTalentDiscoveryQuery,
  objectives: EvidenceFirstDiscoveryObjective[],
): TechnicalTalentSourceQuery {
  const source = objectives[0]?.source;

  if (!source) {
    throw new Error("Evidence-first source request requires at least one objective.");
  }

  return {
    query,
    requestedSource: source,
    requestedAt: new Date().toISOString(),
    evidenceObjectives: objectives.map((objective) => ({
      requirement: objective.requirement,
      evidenceSlot: objective.evidenceSlot,
      rationale: objective.rationale,
    })),
  };
}

function getCandidateSurfaces(
  objectives: EvidenceFirstDiscoveryObjective[],
  result: TechnicalTalentSourceResult,
): EvidenceFirstCandidateSurface[] {
  return result.records
    .map((candidate) => {
      const matchedObjectives = objectives
        .filter(
          (objective) =>
            objective.source === result.source &&
            objective.evidenceSlot,
        )
        .map((objective) => {
          const matchingEvidenceIds = candidate.evidence
            .filter((evidence) =>
              evidence.supports?.some(
                (fact) =>
                  fact.trim().toLowerCase() ===
                  objective.evidenceSlot
                    .replace(/^[^:]+:\s*/, "")
                    .trim()
                    .toLowerCase(),
              ),
            )
            .map((evidence) => evidence.id);

          if (matchingEvidenceIds.length === 0) {
            return undefined;
          }

          return {
            requirement: objective.requirement,
            evidenceSlot: objective.evidenceSlot,
            source: objective.source,
            evidenceIds: Array.from(
              new Set(matchingEvidenceIds),
            ),
            rationale: objective.rationale,
          };
        })
        .filter(
          (
            match,
          ): match is EvidenceFirstCandidateObjectiveMatch =>
            Boolean(match),
        );

      if (matchedObjectives.length === 0) {
        return undefined;
      }

      return {
        candidateId: candidate.id,
        candidate,
        source: result.source,
        matchedObjectives,
      };
    })
    .filter(
      (
        surface,
      ): surface is EvidenceFirstCandidateSurface =>
        Boolean(surface),
    );
}

export async function executeEvidenceFirstDiscovery(
  query: TechnicalTalentDiscoveryQuery,
  objectives: EvidenceFirstDiscoveryObjective[],
  adapters: TechnicalTalentDiscoverySourceAdapter[],
): Promise<EvidenceFirstDiscoveryExecution[]> {
  const objectivesBySource = new Map<
    DiscoverySource,
    EvidenceFirstDiscoveryObjective[]
  >();

  for (const objective of objectives) {
    const existing =
      objectivesBySource.get(objective.source) ?? [];

    existing.push(objective);
    objectivesBySource.set(
      objective.source,
      existing,
    );
  }

  const executions = await Promise.all(
    Array.from(objectivesBySource.entries()).map(
      async ([source, sourceObjectives]) => {
        const adapter = adapters.find(
          (item) =>
            item.config.enabled &&
            item.config.source === source,
        );

        if (!adapter) {
          return {
            source,
            objectives: sourceObjectives,
            candidates: [],
            error: `No enabled adapter registered for ${source}.`,
            durationMs: 0,
          };
        }

        const startedAt = Date.now();

        try {
          const result =
            await adapter.search(
              createSourceRequest(
                query,
                sourceObjectives,
              ),
            );

          return {
            source,
            objectives: sourceObjectives,
            result,
            candidates:
              getCandidateSurfaces(
                sourceObjectives,
                result,
              ),
            durationMs:
              Date.now() - startedAt,
          };
        } catch (error) {
          return {
            source,
            objectives: sourceObjectives,
            candidates: [],
            error:
              error instanceof Error
                ? error.message
                : String(error),
            durationMs:
              Date.now() - startedAt,
          };
        }
      },
    ),
  );

  return executions;
}
