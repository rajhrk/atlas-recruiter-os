// ============================================================
// Atlas Recruiter OS
// Technical Talent Source Initialization
// ============================================================

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import {
  githubTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/github/GitHubTechnicalTalentSource";

import {
  semanticScholarTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/SemanticScholarTechnicalTalentSource";

import {
  openReviewTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/OpenReviewTechnicalTalentSource";


import {
  arxivTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/ArxivTechnicalTalentSource";


import {
  googleScholarTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/GoogleScholarTechnicalTalentSource";

/**
 * Prevent duplicate registration during development.
 */
let initialized = false;

export function initializeTechnicalTalentSources(): void {
  if (initialized) {
    return;
  }

  technicalTalentSourceRegistry.register(
    githubTechnicalTalentSource,
  );

  technicalTalentSourceRegistry.register(
    semanticScholarTechnicalTalentSource,
  );

  technicalTalentSourceRegistry.register(
    openReviewTechnicalTalentSource,
  );


  technicalTalentSourceRegistry.register(
    arxivTechnicalTalentSource,
  );


  technicalTalentSourceRegistry.register(
    googleScholarTechnicalTalentSource,
  );

  initialized = true;
}

/**
 * Initialize registered sources when this module
 * is imported.
 */
initializeTechnicalTalentSources();
