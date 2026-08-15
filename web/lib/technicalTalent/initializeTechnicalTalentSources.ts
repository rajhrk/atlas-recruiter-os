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

  initialized = true;
}

/**
 * Initialize registered sources when this module
 * is imported.
 */
initializeTechnicalTalentSources();