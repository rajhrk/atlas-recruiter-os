import {
  initializeTechnicalTalentSources,
} from "@/lib/technicalTalent/initializeTechnicalTalentSources";

import {
  orchestrateEvidenceFirstTechnicalTalentDiscovery,
} from "@/lib/technicalTalent/technicalTalentEvidenceLayer";

import type {
  DiscoveryConfidence,
  DiscoverySource,
  DiscoveryTechnicalDomain,
  TechnicalTalentDiscoveryQuery,
} from "@/types/technicalTalentDiscovery";

const VALID_DOMAINS: DiscoveryTechnicalDomain[] = [
  "AI / ML",
  "Robotics",
  "Hardware / Embedded",
  "Semiconductor",
];

const VALID_CONFIDENCE: DiscoveryConfidence[] = [
  "Low",
  "Medium",
  "High",
  "Very High",
];

const VALID_SOURCES: DiscoverySource[] = [
  "GitHub",
  "OpenReview",
  "Semantic Scholar",
];

interface EvidenceFirstApiRequest {
  keywords?: string[];
  domains?: DiscoveryTechnicalDomain[];
  skills?: string[];
  technologies?: string[];
  researchAreas?: string[];
  roleFamilies?: string[];
  minimumFitScore?: number;
  minimumConfidence?: DiscoveryConfidence;
  sources?: DiscoverySource[];
  limit?: number;
  offset?: number;
  evidenceGatePolicy?: {
    minimumEvidenceItems?: number;
    minimumIndependentSources?: number;
    minimumEvidenceConfidence?: DiscoveryConfidence;
    requireDatedEvidence?: boolean;
    requireTechnicalClaimEvidence?: boolean;
  };
}

function cleanStrings(values: unknown): string[] | undefined {
  if (!Array.isArray(values)) {
    return undefined;
  }

  const cleaned = values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  return cleaned.length > 0
    ? Array.from(new Set(cleaned))
    : undefined;
}

function validateDomains(values: unknown): DiscoveryTechnicalDomain[] | undefined {
  const cleaned = cleanStrings(values);

  if (!cleaned) {
    return undefined;
  }

  const invalid = cleaned.filter(
    (value) => !VALID_DOMAINS.includes(value as DiscoveryTechnicalDomain),
  );

  if (invalid.length > 0) {
    throw new Error(`Unsupported technical domain: ${invalid[0]}`);
  }

  return cleaned as DiscoveryTechnicalDomain[];
}

function validateConfidence(value: unknown): DiscoveryConfidence | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (
    typeof value !== "string" ||
    !VALID_CONFIDENCE.includes(value as DiscoveryConfidence)
  ) {
    throw new Error("Unsupported confidence value.");
  }

  return value as DiscoveryConfidence;
}

function validateSources(values: unknown): DiscoverySource[] | undefined {
  const cleaned = cleanStrings(values);

  if (!cleaned) {
    return undefined;
  }

  const invalid = cleaned.filter(
    (value) => !VALID_SOURCES.includes(value as DiscoverySource),
  );

  if (invalid.length > 0) {
    throw new Error(`Unsupported discovery source: ${invalid[0]}`);
  }

  return cleaned as DiscoverySource[];
}

function validateLimit(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("limit must be a number.");
  }

  return Math.min(Math.max(Math.floor(value), 1), 100);
}

function validateOffset(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("offset must be a number.");
  }

  return Math.max(Math.floor(value), 0);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as EvidenceFirstApiRequest;

    const query: TechnicalTalentDiscoveryQuery = {
      keywords: cleanStrings(body?.keywords),
      domains: validateDomains(body?.domains),
      skills: cleanStrings(body?.skills),
      technologies: cleanStrings(body?.technologies),
      researchAreas: cleanStrings(body?.researchAreas),
      roleFamilies: cleanStrings(body?.roleFamilies),
      minimumFitScore:
        typeof body?.minimumFitScore === "number" &&
        Number.isFinite(body.minimumFitScore)
          ? Math.min(Math.max(Math.floor(body.minimumFitScore), 0), 100)
          : undefined,
      minimumConfidence: validateConfidence(body?.minimumConfidence),
    };

    const sources = validateSources(body?.sources);
    const limit = validateLimit(body?.limit);
    const offset = validateOffset(body?.offset);

    initializeTechnicalTalentSources();

    const result = await orchestrateEvidenceFirstTechnicalTalentDiscovery(
      query,
      {
        sources,
        limit,
        offset,
        evidenceGatePolicy: {
          minimumEvidenceItems: 1,
          minimumIndependentSources: 1,
          minimumEvidenceConfidence: "Medium",
          requireDatedEvidence: false,
          requireTechnicalClaimEvidence: true,
          ...(body?.evidenceGatePolicy ?? {}),
        },
      },
    );

    return Response.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Evidence-first technical talent discovery failed.";

    return Response.json({ error: message }, { status: 400 });
  }
}
