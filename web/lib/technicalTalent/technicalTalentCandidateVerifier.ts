import {
  assessCrossSourceEvidence,
} from "./technicalTalentEvidenceVerifier";

import type {
  DiscoveryConfidence,
  DiscoveryEvidence,
  DiscoveryEvidenceAssessment,
  DiscoveryEvidenceType,
  TechnicalTalentDiscoveryRecord,
  DiscoveryVerification,
} from "@/types/technicalTalentDiscovery";

const IDENTITY_WEIGHT = 25;
const EMPLOYMENT_WEIGHT = 20;
const TECHNICAL_WEIGHT = 25;
const RESEARCH_WEIGHT = 15;
const SOURCE_WEIGHT = 15;

const VERIFIED_THRESHOLD = 75;
const PARTIALLY_VERIFIED_THRESHOLD = 40;

const EMPLOYMENT_TYPES: DiscoveryEvidenceType[] = [
  "Employment",
];

const TECHNICAL_TYPES: DiscoveryEvidenceType[] = [
  "Technical Profile",
  "Repository",
  "Open Source Contribution",
  "Patent",
  "Model",
  "Dataset",
  "Competition",
];

const RESEARCH_TYPES: DiscoveryEvidenceType[] = [
  "Publication",
  "Citation",
  "Research Project",
  "Conference Paper",
  "Conference Proceeding",
  "Dissertation",
  "Talk",
];

function confidenceRank(
  confidence: DiscoveryConfidence,
): number {
  switch (confidence) {
    case "Very High":
      return 4;

    case "High":
      return 3;

    case "Medium":
      return 2;

    case "Low":
      return 1;
  }
}

function confidenceScore(
  confidence: DiscoveryConfidence,
): number {
  return (
    40 +
    confidenceRank(
      confidence,
    ) *
      15
  );
}

function getIndependentSources(
  evidence: DiscoveryEvidence[],
): Set<string> {
  return new Set(
    evidence.map(
      (item) =>
        item.source,
    ),
  );
}

function evidenceForTypes(
  evidence: DiscoveryEvidence[],
  types: DiscoveryEvidenceType[],
): DiscoveryEvidence[] {
  const allowed =
    new Set(types);

  return evidence.filter(
    (item) =>
      allowed.has(
        item.type,
      ),
  );
}

function categoryScore(
  evidence: DiscoveryEvidence[],
  evidenceAssessments: DiscoveryEvidenceAssessment[],
): number {
  if (
    evidence.length === 0
  ) {
    return 0;
  }

  const highest =
    Math.max(
      ...evidence.map(
        (item) =>
          confidenceScore(
            item.confidence,
          ),
      ),
    );

  /*
   * Corroboration must come from independent sources
   * supporting the same fact.
   *
   * Multiple evidence items from the same source do
   * not count as independent corroboration.
   *
   * 1 source  -> +0
   * 2 sources -> +5
   * 3 sources -> +10
   * 4+ sources -> +15
   */
  const categoryEvidenceIds =
    new Set(
      evidence.map(
        (item) => item.id,
      ),
    );

  const strongestIndependentSourceCount =
    evidenceAssessments.reduce(
      (highestCount, assessment) => {
        const appliesToCategory =
          assessment.evidenceIds.some(
            (id) =>
              categoryEvidenceIds.has(id),
          );

        if (!appliesToCategory) {
          return highestCount;
        }

        return Math.max(
          highestCount,
          assessment.independentSourceCount,
        );
      },
      0,
    );

  const corroborationBonus =
    Math.min(
      15,
      Math.max(
        strongestIndependentSourceCount - 1,
        0,
      ) *
        5,
    );

  return Math.min(
    100,
    highest +
      corroborationBonus,
  );
}
function identityScore(
  evidence: DiscoveryEvidence[],
): number {
  const sourceCount =
    getIndependentSources(
      evidence,
    ).size;

  if (
    sourceCount >= 4
  ) {
    return 100;
  }

  if (
    sourceCount === 3
  ) {
    return 90;
  }

  if (
    sourceCount === 2
  ) {
    return 70;
  }

  if (
    sourceCount === 1
  ) {
    return 40;
  }

  return 0;
}

function identityConfidence(
  evidence: DiscoveryEvidence[],
): DiscoveryConfidence {
  const sourceCount =
    getIndependentSources(
      evidence,
    ).size;

  if (
    sourceCount >= 3
  ) {
    return "Very High";
  }

  if (
    sourceCount === 2
  ) {
    return "High";
  }

  if (
    sourceCount === 1
  ) {
    return "Medium";
  }

  return "Low";
}

function independentSourceScore(
  sourceCount: number,
): number {
  if (
    sourceCount >= 4
  ) {
    return 100;
  }

  if (
    sourceCount === 3
  ) {
    return 90;
  }

  if (
    sourceCount === 2
  ) {
    return 70;
  }

  if (
    sourceCount === 1
  ) {
    return 40;
  }

  return 0;
}

function highestConfidence(
  evidence: DiscoveryEvidence[],
): DiscoveryConfidence {
  if (
    evidence.length === 0
  ) {
    return "Low";
  }

  return evidence.reduce<DiscoveryConfidence>(
    (
      highest,
      item,
    ) =>
      confidenceRank(
        item.confidence,
      ) >
      confidenceRank(
        highest,
      )
        ? item.confidence
        : highest,
    "Low",
  );
}

function getRelevantEvidenceIds(
  evidence: DiscoveryEvidence[],
): string[] {
  return Array.from(
    new Set(
      evidence.map(
        (item) =>
          item.id,
      ),
    ),
  );
}

function buildExplanation(
  status: DiscoveryVerification["status"],
  independentSourceCount: number,
  evidenceCount: number,
  warnings: string[],
): string {
  const evidenceLabel =
    evidenceCount === 1
      ? "evidence item"
      : "evidence items";

  const sourceLabel =
    independentSourceCount === 1
      ? "independent source"
      : "independent sources";

  const base =
    `${status} candidate verification based on ` +
    `${evidenceCount} ${evidenceLabel} from ` +
    `${independentSourceCount} ${sourceLabel}.`;

  if (
    warnings.length === 0
  ) {
    return base;
  }

  return (
    `${base} ` +
    warnings.join(" ")
  );
}

export function verifyTechnicalTalentCandidate(
  record: TechnicalTalentDiscoveryRecord,
): DiscoveryVerification {
  const evidence =
    record.evidence ?? [];

  const independentSourceCount =
    getIndependentSources(
      evidence,
    ).size;

  const employmentEvidence =
    evidenceForTypes(
      evidence,
      EMPLOYMENT_TYPES,
    );

  const technicalEvidence =
    evidenceForTypes(
      evidence,
      TECHNICAL_TYPES,
    );

  const researchEvidence =
    evidenceForTypes(
      evidence,
      RESEARCH_TYPES,
    );

  const evidenceAssessments =
    assessCrossSourceEvidence(
      evidence,
    );

  const identity =
    identityScore(
      evidence,
    );

  const employment =
    categoryScore(
      employmentEvidence,
      evidenceAssessments,
    );

  const technical =
    categoryScore(
      technicalEvidence,
      evidenceAssessments,
    );

  const research =
    categoryScore(
      researchEvidence,
      evidenceAssessments,
    );

  const sourceIndependence =
    independentSourceScore(
      independentSourceCount,
    );

  const score =
    Math.round(
      identity *
        (IDENTITY_WEIGHT / 100) +
      employment *
        (EMPLOYMENT_WEIGHT / 100) +
      technical *
        (TECHNICAL_WEIGHT / 100) +
      research *
        (RESEARCH_WEIGHT / 100) +
      sourceIndependence *
        (SOURCE_WEIGHT / 100),
    );

  let status:
    DiscoveryVerification["status"];

  if (
    score >=
    VERIFIED_THRESHOLD
  ) {
    status = "Verified";
  } else if (
    score >=
    PARTIALLY_VERIFIED_THRESHOLD
  ) {
    status =
      "Partially Verified";
  } else {
    status = "Unverified";
  }

  const warnings: string[] =
    [];

  if (
    employmentEvidence.length === 0
  ) {
    warnings.push(
      "No employment evidence was found.",
    );
  }

  if (
    technicalEvidence.length === 0
  ) {
    warnings.push(
      "No direct technical evidence was found.",
    );
  }

  if (
    researchEvidence.length === 0
  ) {
    warnings.push(
      "No research evidence was found.",
    );
  }

  if (
    independentSourceCount < 2
  ) {
    warnings.push(
      "Verification is based on fewer than two independent sources.",
    );
  }

  return {
    status,

    evidenceAssessments,

    score,

    identity:
      identityConfidence(
        evidence,
      ),

    employment:
      employmentEvidence.length > 0
        ? highestConfidence(
            employmentEvidence,
          )
        : undefined,

    technical:
      technicalEvidence.length > 0
        ? highestConfidence(
            technicalEvidence,
          )
        : undefined,

    research:
      researchEvidence.length > 0
        ? highestConfidence(
            researchEvidence,
          )
        : undefined,

    independentSourceCount,

    evidenceCount:
      evidence.length,

    verifiedEvidenceIds:
      getRelevantEvidenceIds(
        evidence,
      ),

    warnings,

    explanation:
      buildExplanation(
        status,
        independentSourceCount,
        evidence.length,
        warnings,
      ),

    verifiedAt:
      new Date().toISOString(),
  };
}