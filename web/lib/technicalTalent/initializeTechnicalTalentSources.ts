// ============================================================
// Atlas Recruiter OS
// Technical Talent Source Initialization
//
// Registers the currently available source adapters.
// ============================================================

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import {
  mockTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/MockTechnicalTalentSource";

/**
 * Prevent duplicate registration when initialization
 * is called more than once during development.
 */
let initialized = false;

export function initializeTechnicalTalentSources(): void {
  if (initialized) {
    return;
  }

  technicalTalentSourceRegistry.register(
    mockTechnicalTalentSource,
  );

  initialized = true;
}

/**
 * Initialize sources immediately when this module
 * is imported.
 */
initializeTechnicalTalentSources();