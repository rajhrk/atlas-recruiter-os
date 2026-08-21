// ============================================================
// Atlas Recruiter OS
// Technical Talent Enrichment Initialization
// ============================================================

import {
  technicalTalentEnrichmentRegistry,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichment";

import {
  GitHubTechnicalTalentEnrichment,
} from "@/lib/technicalTalent/enrichment/sources/GitHubTechnicalTalentEnrichment";

/**
 * Prevent duplicate registration during development.
 */
let initialized = false;

export function initializeTechnicalTalentEnrichment(): void {
  if (initialized) {
    return;
  }

  technicalTalentEnrichmentRegistry.register(
    new GitHubTechnicalTalentEnrichment(),
  );

  initialized = true;
}

/**
 * Initialize registered enrichment sources when this
 * module is imported.
 */
initializeTechnicalTalentEnrichment();
