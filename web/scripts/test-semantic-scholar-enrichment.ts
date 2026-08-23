import {
  SemanticScholarTechnicalTalentEnrichment,
} from "../lib/technicalTalent/enrichment/sources/SemanticScholarTechnicalTalentEnrichment";

import type {
  TechnicalTalentDiscoveryRecord,
} from "../types/technicalTalentDiscovery";

async function main() {
  console.log(
    "===== ATLAS SEMANTIC SCHOLAR ENRICHMENT TEST =====",
  );

  const adapter =
    new SemanticScholarTechnicalTalentEnrichment();

  console.log(
    "ADAPTER:",
    adapter.config.name,
  );

  console.log(
    "ENABLED:",
    adapter.config.enabled,
  );

  const candidate =
    {
      id:
        "semantic-scholar:1741103:test-paper",

      name:
        "M. Bastarrica",

      headline:
        "Semantic Scholar researcher",

      primaryDomain:
        "AI / ML",

      roleFamily:
        "Research",

      normalizedRole:
        "Research Scientist",

      talentType:
        "Research Scientist",

      skills: [],

      technologies: [],

      researchAreas: [],

      publications: [],

      evidence: [],

      approvalStatus:
        "Unreviewed",

      sourceRecordIds: [
        "semantic-scholar:test-paper",
      ],
    } as TechnicalTalentDiscoveryRecord;

  const result =
    await adapter.enrich(
      candidate,
    );

  console.log(
    "\n===== RESULT =====",
  );

  console.log(
    "SOURCE:",
    result.source,
  );

  console.log(
    "CANDIDATE ID:",
    result.candidateId,
  );

  console.log(
    "CONFIDENCE:",
    result.confidence,
  );

  console.log(
    "WARNINGS:",
    result.warnings,
  );

  console.log(
    "EVIDENCE COUNT:",
    result.evidence.length,
  );

  console.log(
    "EVIDENCE TYPES:",
    Array.from(
      new Set(
        result.evidence.map(
          (item) => item.type,
        ),
      ),
    ),
  );

  console.log(
    "PATCH FIELDS:",
    result.patch
      ? Object.keys(
          result.patch,
        )
      : [],
  );

  console.log(
    "NAME:",
    result.patch?.name,
  );

  console.log(
    "HEADLINE:",
    result.patch?.headline,
  );

  console.log(
    "SKILLS:",
    result.patch?.skills?.map(
      (skill) => skill.name,
    ),
  );

  console.log(
    "TECHNOLOGIES:",
    result.patch?.technologies?.map(
      (technology) => technology.name,
    ),
  );

  console.log(
    "RESEARCH AREAS:",
    result.patch?.researchAreas,
  );

  console.log(
    "PUBLICATIONS:",
    result.patch?.publications?.length ?? 0,
  );

  console.log(
    "SOURCING SIGNALS:",
    result.patch?.sourcingSignals?.length ?? 0,
  );

  if (
    result.source !==
    "Semantic Scholar"
  ) {
    throw new Error(
      "FAIL: Wrong enrichment source.",
    );
  }

  if (
    result.candidateId !==
    candidate.id
  ) {
    throw new Error(
      "FAIL: Candidate ID changed.",
    );
  }

  if (
    result.evidence.length ===
    0
  ) {
    throw new Error(
      "FAIL: Semantic Scholar returned no evidence.",
    );
  }

  if (
    !result.patch
  ) {
    throw new Error(
      "FAIL: Semantic Scholar returned no patch.",
    );
  }

  if (
    !result.patch.publications ||
    result.patch.publications.length ===
      0
  ) {
    throw new Error(
      "FAIL: Semantic Scholar returned no publications.",
    );
  }

  if (
    !result.patch.researchAreas ||
    result.patch.researchAreas.length ===
      0
  ) {
    throw new Error(
      "FAIL: Semantic Scholar returned no research areas.",
    );
  }

  if (
    !result.evidence.some(
      (item) =>
        item.source ===
        "Semantic Scholar",
    )
  ) {
    throw new Error(
      "FAIL: Evidence source is not Semantic Scholar.",
    );
  }

  if (
    !result.evidence.some(
      (item) =>
        Array.isArray(
          item.supports,
        ) &&
        item.supports.length >
          0,
    )
  ) {
    throw new Error(
      "FAIL: Semantic Scholar evidence has no supports[] claim mapping.",
    );
  }

  console.log(
    "\n✅ SEMANTIC SCHOLAR ENRICHMENT TEST PASSED",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ SEMANTIC SCHOLAR ENRICHMENT TEST FAILED",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);
