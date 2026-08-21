import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentSourceCapabilities,
} from "@/types/technicalTalentDiscoverySource";

/**
 * Atlas Recruiter OS
 *
 * Technical Talent Enrichment Contract
 *
 * Enrichment operates on an already-discovered candidate.
 *
 * It may add evidence-backed information to that candidate,
 * but it must not:
 *
 * - create a new candidate
 * - perform cross-source identity resolution
 * - approve a candidate
 * - calculate final fit
 * - modify recruiter workflow state
 */

/**
 * Fields that an enrichment source is allowed to contribute.
 *
 * This deliberately excludes:
 *
 * - id
 * - sourceRecordIds
 * - approvalStatus
 * - recruiterNotes
 * - fitScore
 * - verification
 *
 * Identity resolution and recruiter workflow remain Atlas-owned.
 */
export type TechnicalTalentEnrichmentPatch =
  Partial<
    Pick<
      TechnicalTalentDiscoveryRecord,
      | "name"
      | "headline"
      | "normalizedRole"
      | "roleFamily"
      | "talentType"
      | "seniority"
      | "primaryDomain"
      | "secondaryDomains"
      | "location"
      | "city"
      | "country"
      | "skills"
      | "technologies"
      | "affiliations"
      | "publications"
      | "patents"
      | "repositories"
      | "conferences"
      | "researchAreas"
      | "sourcingSignals"
    >
  >;

/**
 * Enrichment source configuration.
 */
export interface TechnicalTalentEnrichmentConfig {
  source: DiscoverySource;

  name: string;

  description: string;

  capabilities: TechnicalTalentSourceCapabilities;

  enabled: boolean;
}

/**
 * Result returned by one enrichment source.
 */
export interface TechnicalTalentEnrichmentResult {
  source: DiscoverySource;

  candidateId: string;

  patch?: TechnicalTalentEnrichmentPatch;

  evidence: DiscoveryEvidence[];

  confidence: DiscoveryConfidence;

  warnings?: string[];

  searchedAt: string;
}

/**
 * Every enrichment source implements this interface.
 */
export interface TechnicalTalentEnrichmentAdapter {
  readonly config: TechnicalTalentEnrichmentConfig;

  enrich(
    candidate: TechnicalTalentDiscoveryRecord,
  ): Promise<TechnicalTalentEnrichmentResult>;
}

/**
 * Registry for enrichment adapters.
 */
export interface TechnicalTalentEnrichmentRegistry {
  register(
    adapter: TechnicalTalentEnrichmentAdapter,
  ): void;

  get(
    source: DiscoverySource,
  ):
    | TechnicalTalentEnrichmentAdapter
    | undefined;

  list(): TechnicalTalentEnrichmentAdapter[];
}

/**
 * Default in-memory enrichment registry.
 */
class DefaultTechnicalTalentEnrichmentRegistry
  implements TechnicalTalentEnrichmentRegistry
{
  private readonly adapters =
    new Map<
      DiscoverySource,
      TechnicalTalentEnrichmentAdapter
    >();

  register(
    adapter: TechnicalTalentEnrichmentAdapter,
  ): void {
    this.adapters.set(
      adapter.config.source,
      adapter,
    );
  }

  get(
    source: DiscoverySource,
  ):
    | TechnicalTalentEnrichmentAdapter
    | undefined {
    return this.adapters.get(
      source,
    );
  }

  list(): TechnicalTalentEnrichmentAdapter[] {
    return Array.from(
      this.adapters.values(),
    );
  }
}

/**
 * Global Atlas enrichment registry.
 */
export const technicalTalentEnrichmentRegistry =
  new DefaultTechnicalTalentEnrichmentRegistry();

/**
 * Return all registered enrichment adapters.
 */
export function getRegisteredTechnicalTalentEnrichmentSources(): TechnicalTalentEnrichmentAdapter[] {
  return technicalTalentEnrichmentRegistry.list();
}

/**
 * Return one enrichment adapter.
 */
export function getTechnicalTalentEnrichmentSource(
  source: DiscoverySource,
):
  | TechnicalTalentEnrichmentAdapter
  | undefined {
  return technicalTalentEnrichmentRegistry.get(
    source,
  );
}
