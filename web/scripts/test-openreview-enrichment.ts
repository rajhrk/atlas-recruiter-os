import {
  OpenReviewTechnicalTalentEnrichment,
} from "../lib/technicalTalent/enrichment/sources/OpenReviewTechnicalTalentEnrichment";

import type {
  TechnicalTalentDiscoveryRecord,
} from "../types/technicalTalentDiscovery";

async function main() {
  console.log(
    "===== ATLAS OPENREVIEW ENRICHMENT TEST =====",
  );

  const adapter =
    new OpenReviewTechnicalTalentEnrichment();

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
        "openreview:JsirqoRpMs:0",

      name:
        "OpenReview runtime fixture",

      headline:
        "Robotics research contributor",

      primaryDomain:
        "Robotics",

      roleFamily:
        "Research",

      normalizedRole:
        "Research Scientist",

      talentType:
        "Research Scientist",

      skills: [],

      technologies: [],

      researchAreas: [],

      publications: [
        {
          title:
            "Runtime OpenReview Evidence Fixture",
          venue:
            "OpenReview",
          year:
            2025,
          url:
            "https://openreview.net/forum?id=JsirqoRpMs",
          authors: [
            "OpenReview runtime fixture",
          ],
        },
      ],

      evidence: [
        {
          id:
            "openreview:JsirqoRpMs:0:publication",
          type:
            "Conference Paper",
          source:
            "OpenReview",
          title:
            "Runtime OpenReview Evidence Fixture",
          url:
            "https://openreview.net/forum?id=JsirqoRpMs",
          date:
            "2025-01-01",
          confidence:
            "High",
          supports: [
            "Robotics Research",
          ],
          relevance:
            "OpenReview publication evidence used to validate enrichment.",
        },
      ],

      approvalStatus:
        "Unreviewed",

      sourceRecordIds: [
        "openreview:JsirqoRpMs:0",
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
    "OpenReview"
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
      "FAIL: OpenReview returned no evidence.",
    );
  }

  if (
    !result.patch
  ) {
    throw new Error(
      "FAIL: OpenReview returned no patch.",
    );
  }

  if (
    !result.patch.publications ||
    result.patch.publications.length ===
      0
  ) {
    throw new Error(
      "FAIL: OpenReview returned no publications.",
    );
  }

  if (
    !result.evidence.some(
      (item) =>
        item.source ===
        "OpenReview",
    )
  ) {
    throw new Error(
      "FAIL: Evidence source is not OpenReview.",
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
      "FAIL: OpenReview evidence has no supports[] claim mapping.",
    );
  }

  if (
    !result.evidence.some(
      (item) =>
        item.source === "OpenReview" &&
        typeof item.url === "string" &&
        item.url.includes(
          "openreview.net",
        ) &&
        Array.isArray(item.supports) &&
        item.supports.length > 0 &&
        typeof item.confidence === "string",
    )
  ) {
    throw new Error(
      "FAIL: OpenReview evidence does not contain the required source, URL, supports[], and confidence fields.",
    );
  }

  console.log(
    "\n===== FIRST 5 EVIDENCE ITEMS =====",
  );

  result.evidence
    .slice(0, 5)
    .forEach(
      (item) => {
        console.log(
          `- ${item.type} | ${item.title} | ${item.url ?? "no URL"}`,
        );
      },
    );

  console.log(
    "\n✅ OPENREVIEW ENRICHMENT TEST PASSED",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ OPENREVIEW ENRICHMENT TEST FAILED",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);
