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

import {
  SemanticScholarTechnicalTalentEnrichment,
} from "@/lib/technicalTalent/enrichment/sources/SemanticScholarTechnicalTalentEnrichment";

import {
  OpenReviewTechnicalTalentEnrichment,
} from "@/lib/technicalTalent/enrichment/sources/OpenReviewTechnicalTalentEnrichment";

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

  technicalTalentEnrichmentRegistry.register(
    new SemanticScholarTechnicalTalentEnrichment(),
  );

  technicalTalentEnrichmentRegistry.register(
    new OpenReviewTechnicalTalentEnrichment(),
  );

  initialized = true;
}

/**
 * Initialize registered enrichment sources when this
 * module is imported.
 */
initializeTechnicalTalentEnrichment();
