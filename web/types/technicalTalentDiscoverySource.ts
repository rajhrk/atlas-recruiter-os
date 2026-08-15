// ============================================================
// Atlas Recruiter OS
// Technical Talent Discovery Source Contract
//
// Defines the common contract used by external discovery
// sources.
//
// This layer does NOT connect to external APIs yet.
//
// Its purpose is to make every future source adapter return
// evidence in a consistent, explainable format.
//
// Future adapters:
// - GitHub
// - LinkedIn
// - Google Scholar
// - Google Patents
// - ORCID
// - DBLP
// - arXiv
// - Semantic Scholar
// - IEEE
// - Conference Proceedings
// - University
// - Research Lab
// - Company
// - Personal Website
// ============================================================

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryQuery,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

/**
 * Capability flags allow Atlas to understand what a source
 * can actually provide.
 *
 * A source should never be assumed to support every signal.
 */
export interface TechnicalTalentSourceCapabilities {
  identity?: boolean;

  employment?: boolean;

  technicalProfile?: boolean;

  skills?: boolean;

  technologies?: boolean;

  publications?: boolean;

  citations?: boolean;

  patents?: boolean;

  repositories?: boolean;

  openSource?: boolean;

  conferences?: boolean;

  education?: boolean;

  researchProjects?: boolean;

  locations?: boolean;
}

/**
 * Source-level configuration.
 */
export interface TechnicalTalentDiscoverySourceConfig {
  source: DiscoverySource;

  name: string;

  description: string;

  capabilities: TechnicalTalentSourceCapabilities;

  enabled: boolean;
}

/**
 * A normalized source query.
 *
 * The source adapter receives the common Atlas query rather
 * than inventing its own query contract.
 */
export interface TechnicalTalentSourceQuery {
  query: TechnicalTalentDiscoveryQuery;

  requestedSource: DiscoverySource;

  requestedAt: string;
}

/**
 * Raw evidence returned by a source before Atlas performs
 * normalization.
 *
 * This deliberately remains lightweight.
 */
export interface TechnicalTalentSourceEvidence {
  source: DiscoverySource;

  sourceRecordId: string;

  externalId?: string;

  name?: string;

  headline?: string;

  url?: string;

  title?: string;

  description?: string;

  organization?: string;

  location?: string;

  publishedAt?: string;

  metadata?: Record<string, string | number | boolean>;

  rawSignals?: string[];

  confidence?: "Very High" | "High" | "Medium" | "Low";
}

/**
 * Result returned by one source adapter.
 */
export interface TechnicalTalentSourceResult {
  source: DiscoverySource;

  query: TechnicalTalentSourceQuery;

  records: TechnicalTalentDiscoveryRecord[];

  evidence: TechnicalTalentSourceEvidence[];

  total: number;

  hasMore?: boolean;

  nextCursor?: string;

  searchedAt: string;

  warnings?: string[];
}

/**
 * Every external source adapter implements this interface.
 *
 * The adapter is responsible for:
 *
 * 1. Receiving an Atlas discovery query
 * 2. Querying its source
 * 3. Returning normalized records/evidence
 * 4. Returning pagination information
 * 5. Reporting source limitations
 *
 * It is NOT responsible for:
 *
 * - cross-source deduplication
 * - final candidate scoring
 * - recruiter approval
 * - global ranking
 */
export interface TechnicalTalentDiscoverySourceAdapter {
  readonly config: TechnicalTalentDiscoverySourceConfig;

  search(
    request: TechnicalTalentSourceQuery,
  ): Promise<TechnicalTalentSourceResult>;
}

/**
 * Source registry entry.
 *
 * The registry will allow Atlas to discover which adapters
 * are available without hard-coding source logic into the
 * discovery engine.
 */
export interface TechnicalTalentSourceRegistry {
  register(
    adapter: TechnicalTalentDiscoverySourceAdapter,
  ): void;

  get(
    source: DiscoverySource,
  ):
    | TechnicalTalentDiscoverySourceAdapter
    | undefined;

  list(): TechnicalTalentDiscoverySourceAdapter[];
}

/**
 * Standard source health state.
 *
 * Useful once external integrations are introduced.
 */
export type TechnicalTalentSourceHealth =
  | "Available"
  | "Unavailable"
  | "Rate Limited"
  | "Authentication Required"
  | "Configuration Required"
  | "Error";

/**
 * Runtime source status.
 */
export interface TechnicalTalentSourceStatus {
  source: DiscoverySource;

  health: TechnicalTalentSourceHealth;

  lastCheckedAt?: string;

  message?: string;
}