import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import {
  googleScholarTechnicalTalentSource,
} from "@/lib/technicalTalent/sources/research/GoogleScholarTechnicalTalentSource";
import {
  serpApiGoogleScholarProvider,
} from "@/lib/technicalTalent/providers/research/SerpApiGoogleScholarProvider";

async function main() {
  console.log("===== LIVE ATLAS GOOGLE SCHOLAR ENRICHMENT TEST =====");

  if (!process.env.SERPAPI_API_KEY) {
    throw new Error(
      "SERPAPI_API_KEY is not loaded. Check .env.local.",
    );
  }

  const provider =
    serpApiGoogleScholarProvider;

  const source =
    googleScholarTechnicalTalentSource;

  console.log("");
  console.log("===== LIVE SCHOLAR SEARCH =====");

  const result =
    await source.search({
      query: {
        keywords:
          ["robot learning"],
        domains: [
          "Robotics",
        ],
        limit: 5,
      },

      requestedSource:
        "Google Scholar",

      requestedAt:
        new Date().toISOString(),
    });

  console.log(
    `Records: ${result.records.length}`,
  );

  console.log(
    `Total: ${result.total}`,
  );

  console.log(
    `Has more: ${result.hasMore}`,
  );

  console.log(
    `Next cursor: ${result.nextCursor ?? "none"}`,
  );

  if (result.records.length === 0) {
    throw new Error(
      "LIVE TEST FAILED: Scholar returned no candidates.",
    );
  }

  let enrichedCount = 0;

  for (
    const [index, record]
    of result.records.entries()
  ) {
    console.log("");
    console.log(
      `===== CANDIDATE ${index + 1} =====`,
    );

    console.log(
      `Name: ${record.name}`,
    );

    console.log(
      `Source ID: ${record.id}`,
    );

    console.log(
      `Affiliations: ${record.affiliations?.length ?? 0}`,
    );

    console.log(
      `Research areas: ${record.researchAreas?.join(", ") || "none"}`,
    );

    console.log(
      `Skills: ${record.skills.map(
        (skill) => skill.name,
      ).join(", ") || "none"}`,
    );

    console.log(
      `Publications: ${record.publications?.length ?? 0}`,
    );

    console.log(
      `Evidence: ${record.evidence.length}`,
    );

    console.log(
      `Sourcing signals: ${record.sourcingSignals?.length ?? 0}`,
    );

    const hasAuthorProfileEvidence =
      record.evidence.some(
        (item) =>
          item.source ===
          "Google Scholar",
      );

    const hasPublications =
      (record.publications?.length ?? 0) > 0;

    const hasEvidence =
      record.evidence.length > 0;

    if (
      hasAuthorProfileEvidence &&
      hasPublications &&
      hasEvidence
    ) {
      enrichedCount += 1;
    }
  }

  console.log("");
  console.log(
    `Enriched candidates: ${enrichedCount}/${result.records.length}`,
  );

  if (enrichedCount === 0) {
    throw new Error(
      "LIVE TEST FAILED: No candidate was enriched from a Scholar author profile.",
    );
  }

  console.log("");
  console.log(
    "PASS: Live Google Scholar search and author enrichment succeeded.",
  );
}

main().catch(
  (error) => {
    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exit(1);
  },
);
