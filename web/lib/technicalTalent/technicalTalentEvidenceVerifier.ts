import type {
  DiscoveryEvidence,
  DiscoveryEvidenceAssessment,
  DiscoveryEvidenceStrength,
  DiscoveryEvidenceVerificationStatus,
} from "@/types/technicalTalentDiscovery";

/**
 * Normalize an evidence-backed fact for deterministic
 * cross-source grouping.
 */
function normalizeFact(
  fact: string,
): string {
  return fact
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Determine evidence strength from source independence,
 * source-level confidence, and corroboration.
 *
 * Source independence is deliberately more important than
 * raw evidence-item count.
 */
function evidenceStrength(
  evidence: DiscoveryEvidence[],
  independentSourceCount: number,
): DiscoveryEvidenceStrength {
  if (evidence.length === 0) {
    return "Unverified";
  }

  const hasVeryHigh =
    evidence.some(
      (item) =>
        item.confidence === "Very High",
    );

  const hasHighOrBetter =
    evidence.some(
      (item) =>
        item.confidence === "Very High" ||
        item.confidence === "High",
    );

  /*
   * Very High requires both:
   *
   * - at least three independent sources
   * - strong evidence from those sources
   *
   * Three independent High-confidence sources therefore
   * provide Very High corroboration even when none of the
   * individual sources is independently rated Very High.
   */
  if (
    independentSourceCount >= 3 &&
    hasHighOrBetter
  ) {
    return "Very High";
  }

  /*
   * Two independent sources with strong evidence
   * provide High corroboration.
   */
  if (
    independentSourceCount >= 2 &&
    hasHighOrBetter
  ) {
    return "High";
  }

  /*
   * Multiple independent sources still provide
   * meaningful corroboration even when confidence
   * is only Medium/Low.
   */
  if (
    independentSourceCount >= 2
  ) {
    return "Medium";
  }

  /*
   * A single source cannot independently establish
   * Very High evidence strength.
   */
  if (
    independentSourceCount === 1 &&
    hasVeryHigh
  ) {
    return "High";
  }

  if (
    independentSourceCount === 1 &&
    hasHighOrBetter
  ) {
    return "Medium";
  }

  return "Low";
}

/**
 * Analyze all explicit facts declared through
 * DiscoveryEvidence.supports.
 *
 * Each fact is evaluated independently. Multiple
 * evidence items from the same source do not count
 * as independent corroboration.
 */
export function assessCrossSourceEvidence(
  evidence: DiscoveryEvidence[],
): DiscoveryEvidenceAssessment[] {
  const factMap =
    new Map<
      string,
      DiscoveryEvidence[]
    >();

  for (const item of evidence) {
    for (const supportedFact of item.supports ?? []) {
      const fact =
        normalizeFact(
          supportedFact,
        );

      if (!fact) {
        continue;
      }

      const existing =
        factMap.get(fact) ?? [];

      existing.push(item);

      factMap.set(
        fact,
        existing,
      );
    }
  }

  return Array.from(
    factMap.entries(),
  ).map(
    ([fact, factEvidence]) => {
      const sources =
        Array.from(
          new Set(
            factEvidence.map(
              (item) =>
                item.source,
            ),
          ),
        );

      const independentSourceCount =
        sources.length;

      let status:
        DiscoveryEvidenceVerificationStatus;

      if (
        independentSourceCount >= 2
      ) {
        status = "Corroborated";
      } else if (
        independentSourceCount === 1
      ) {
        status = "Single Source";
      } else {
        status = "Unsupported";
      }

      const strength =
        evidenceStrength(
          factEvidence,
          independentSourceCount,
        );

      const evidenceIds =
        Array.from(
          new Set(
            factEvidence.map(
              (item) =>
                item.id,
            ),
          ),
        );

      const sourceLabel =
        sources.length === 1
          ? "1 independent source"
          : `${sources.length} independent sources`;

      const explanation =
        status === "Corroborated"
          ? `${fact} is supported by ${sourceLabel}.`
          : status === "Single Source"
            ? `${fact} is supported by a single independent source.`
            : `${fact} has no usable supporting evidence.`;

      return {
        fact,

        status,

        strength,

        independentSourceCount,

        sources,

        evidenceIds,

        explanation,
      };
    },
  );
}
