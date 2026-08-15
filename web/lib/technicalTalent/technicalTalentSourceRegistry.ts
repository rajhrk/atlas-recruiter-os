// ============================================================
// Atlas Recruiter OS
// Technical Talent Discovery Source Registry
//
// Central registry for future external discovery adapters.
// ============================================================

import type {
  DiscoverySource,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceRegistry,
  TechnicalTalentSourceStatus,
} from "@/types/technicalTalentDiscoverySource";

/**
 * Default in-memory source registry.
 *
 * The registry keeps source adapters separate from the
 * discovery engine so new external sources can be added
 * without modifying the core discovery logic.
 */
class DefaultTechnicalTalentSourceRegistry
  implements TechnicalTalentSourceRegistry
{
  private readonly adapters = new Map<
    DiscoverySource,
    TechnicalTalentDiscoverySourceAdapter
  >();

  /**
   * Register a source adapter.
   *
   * If an adapter for the same source already exists,
   * it is replaced by the newly registered adapter.
   */
  register(
    adapter: TechnicalTalentDiscoverySourceAdapter,
  ): void {
    this.adapters.set(
      adapter.config.source,
      adapter,
    );
  }

  /**
   * Retrieve a registered adapter by source.
   */
  get(
    source: DiscoverySource,
  ):
    | TechnicalTalentDiscoverySourceAdapter
    | undefined {
    return this.adapters.get(source);
  }

  /**
   * Return all currently registered adapters.
   */
  list(): TechnicalTalentDiscoverySourceAdapter[] {
    return Array.from(
      this.adapters.values(),
    );
  }
}

/**
 * Global Atlas source registry.
 *
 * External adapters can be registered here during
 * application initialization.
 */
export const technicalTalentSourceRegistry =
  new DefaultTechnicalTalentSourceRegistry();

/**
 * Return all sources currently registered with Atlas.
 */
export function getRegisteredTechnicalTalentSources(): TechnicalTalentDiscoverySourceAdapter[] {
  return technicalTalentSourceRegistry.list();
}

/**
 * Return one registered source adapter.
 */
export function getTechnicalTalentSource(
  source: DiscoverySource,
):
  | TechnicalTalentDiscoverySourceAdapter
  | undefined {
  return technicalTalentSourceRegistry.get(
    source,
  );
}

/**
 * Return the current runtime status of every
 * registered source.
 *
 * For now, registration plus the adapter's enabled
 * configuration determines basic availability.
 *
 * Real integrations can later add:
 *
 * - authentication state
 * - API connectivity
 * - rate limits
 * - quota information
 * - last successful request
 * - error state
 */
export function getTechnicalTalentSourceStatuses(): TechnicalTalentSourceStatus[] {
  return technicalTalentSourceRegistry
    .list()
    .map((adapter) => ({
      source: adapter.config.source,

      health: adapter.config.enabled
        ? "Available"
        : "Configuration Required",

      message: adapter.config.enabled
        ? undefined
        : "Source adapter is registered but disabled.",
    }));
}