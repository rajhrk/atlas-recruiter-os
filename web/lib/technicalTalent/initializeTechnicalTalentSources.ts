// ============================================================
// Atlas Recruiter OS
// Technical Talent Source Initialization
// ============================================================

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import {
  mockTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/MockTechnicalTalentSource";

import {
  githubTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/github/GitHubTechnicalTalentSource";

import {
  semanticScholarTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/SemanticScholarTechnicalTalentSource";

import {
  openReviewTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/OpenReviewTechnicalTalentSource";

/**
 * Prevent duplicate registration during development.
 */
let initialized = false;

export function initializeTechnicalTalentSources(): void {
  if (initialized) {
    return;
  }

  technicalTalentSourceRegistry.register(
    mockTechnicalTalentSource,
  );

  technicalTalentSourceRegistry.register(
    githubTechnicalTalentSource,
  );

  technicalTalentSourceRegistry.register(
    semanticScholarTechnicalTalentSource,
  );

  technicalTalentSourceRegistry.register(
    openReviewTechnicalTalentSource,
  );

  initialized = true;
}

/**
 * Initialize registered sources when this module
 * is imported.
 */
initializeTechnicalTalentSources();
