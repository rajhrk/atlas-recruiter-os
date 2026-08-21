import {
  enrichTechnicalTalentCandidate,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichmentOrchestrator";

import {
  mergeTechnicalTalentEnrichment,
} from "@/lib/technicalTalent/enrichment/technicalTalentEnrichmentMerger";

import type {
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

const VALID_SOURCES: DiscoverySource[] = [
  "GitHub",
  "Semantic Scholar",
  "OpenReview",
];

interface EnrichmentApiRequest {
  candidate?: TechnicalTalentDiscoveryRecord;
  sources?: DiscoverySource[];
}

function validateSources(
  values: unknown,
): DiscoverySource[] {
  if (!Array.isArray(values) || values.length === 0) {
    return [...VALID_SOURCES];
  }

  const invalid = values.filter(
    (value) =>
      typeof value !== "string" ||
      !VALID_SOURCES.includes(
        value as DiscoverySource,
      ),
  );

  if (invalid.length > 0) {
    throw new Error(
      `Unsupported enrichment source: ${String(invalid[0])}`,
    );
  }

  return Array.from(
    new Set(values as DiscoverySource[]),
  );
}

function validateCandidate(
  value: unknown,
): TechnicalTalentDiscoveryRecord {
  if (
    !value ||
    typeof value !== "object"
  ) {
    throw new Error(
      "A candidate record is required.",
    );
  }

  const candidate =
    value as Partial<TechnicalTalentDiscoveryRecord>;

  if (
    typeof candidate.id !== "string" ||
    !candidate.id.trim()
  ) {
    throw new Error(
      "Candidate id is required.",
    );
  }

  if (
    typeof candidate.name !== "string" ||
    !candidate.name.trim()
  ) {
    throw new Error(
      "Candidate name is required.",
    );
  }

  if (
    typeof candidate.primaryDomain !== "string"
  ) {
    throw new Error(
      "Candidate primaryDomain is required.",
    );
  }

  if (
    !Array.isArray(candidate.skills)
  ) {
    throw new Error(
      "Candidate skills must be an array.",
    );
  }

  if (
    !Array.isArray(candidate.technologies)
  ) {
    throw new Error(
      "Candidate technologies must be an array.",
    );
  }

  if (
    !Array.isArray(candidate.evidence)
  ) {
    throw new Error(
      "Candidate evidence must be an array.",
    );
  }

  if (
    typeof candidate.approvalStatus !== "string"
  ) {
    throw new Error(
      "Candidate approvalStatus is required.",
    );
  }

  return candidate as TechnicalTalentDiscoveryRecord;
}

export async function POST(
  request: Request,
): Promise<Response> {
  try {
    const body =
      (await request.json()) as EnrichmentApiRequest;

    const candidate =
      validateCandidate(
        body?.candidate,
      );

    const sources =
      validateSources(
        body?.sources,
      );

    const orchestration =
      await enrichTechnicalTalentCandidate(
        candidate,
        sources,
      );

    const enrichedCandidate =
      mergeTechnicalTalentEnrichment(
        candidate,
        orchestration.results,
      );

    return Response.json(
      {
        candidate:
          enrichedCandidate,

        enrichment:
          orchestration,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Technical talent enrichment failed.";

    return Response.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}
