import type {
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import {
  technicalTalentEnrichmentRegistry,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichment";

import type {
  TechnicalTalentEnrichmentResult,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichment";

export interface TechnicalTalentEnrichmentExecution {
  source: DiscoverySource;

  result?: TechnicalTalentEnrichmentResult;

  error?: string;

  durationMs: number;
}

export interface TechnicalTalentEnrichmentOrchestrationResult {
  candidateId: string;

  executions: TechnicalTalentEnrichmentExecution[];

  results: TechnicalTalentEnrichmentResult[];

  sourcesRequested: DiscoverySource[];

  sourcesSuccessful: DiscoverySource[];

  sourcesFailed: DiscoverySource[];

  searchedAt: string;
}

export async function enrichTechnicalTalentCandidate(
  candidate: TechnicalTalentDiscoveryRecord,
  sources: DiscoverySource[],
): Promise<TechnicalTalentEnrichmentOrchestrationResult> {
  const requestedSources =
    Array.from(
      new Set(
        sources,
      ),
    );

  const executions =
    await Promise.all(
      requestedSources.map(
        async (
          source,
        ): Promise<TechnicalTalentEnrichmentExecution> => {
          const startedAt =
            Date.now();

          const adapter =
            technicalTalentEnrichmentRegistry.get(
              source,
            );

          if (
            !adapter
          ) {
            return {
              source,

              error:
                `No enrichment adapter is registered for ${source}.`,

              durationMs:
                Date.now() -
                startedAt,
            };
          }

          if (
            !adapter.config.enabled
          ) {
            return {
              source,

              error:
                `Enrichment adapter ${source} is disabled.`,

              durationMs:
                Date.now() -
                startedAt,
            };
          }

          try {
            const result =
              await adapter.enrich(
                candidate,
              );

            return {
              source,

              result,

              durationMs:
                Date.now() -
                startedAt,
            };
          } catch (
            error
          ) {
            return {
              source,

              error:
                error instanceof Error
                  ? error.message
                  : String(error),

              durationMs:
                Date.now() -
                startedAt,
            };
          }
        },
      ),
    );

  const results =
    executions
      .filter(
        (
          execution,
        ) =>
          Boolean(
            execution.result,
          ),
      )
      .map(
        (
          execution,
        ) =>
          execution.result!,
      );

  const sourcesSuccessful =
    executions
      .filter(
        (
          execution,
        ) =>
          Boolean(
            execution.result,
          ),
      )
      .map(
        (
          execution,
        ) =>
          execution.source,
      );

  const sourcesFailed =
    executions
      .filter(
        (
          execution,
        ) =>
          Boolean(
            execution.error,
          ),
      )
      .map(
        (
          execution,
        ) =>
          execution.source,
      );

  return {
    candidateId:
      candidate.id,

    executions,

    results,

    sourcesRequested:
      requestedSources,

    sourcesSuccessful,

    sourcesFailed,

    searchedAt:
      new Date().toISOString(),
  };
}
