import type {
  TechnicalTalentGraphMatch,
} from "@/types/technicalTalentDiscovery";

export interface TechnicalTalentGraphMatchScore {
  score: number;
  matchCount: number;
  weightedMatchCount: number;
  explanation: string;
}

/**
 * Relationship weights reflect the strength of the technical
 * signal represented by a graph edge.
 *
 * Stronger technical/research evidence receives more weight
 * than simple participation or authorship signals.
 */
const RELATIONSHIP_WEIGHTS: Record<
  string,
  number
> = {
  demonstrates: 1.25,
  uses: 1.15,
  researches: 1.2,
  contributes_to: 1.1,
  authored: 1.0,
  participates_in: 0.8,
};

function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function relationshipWeight(
  relationship: string,
): number {
  return (
    RELATIONSHIP_WEIGHTS[
      normalize(relationship)
    ] ?? 1
  );
}

/**
 * Score graph evidence independently from the existing
 * candidate fit score.
 *
 * The score is deterministic and normalized to 0–100.
 */
export function scoreTechnicalTalentGraphMatch(
  match: TechnicalTalentGraphMatch,
  requestedSignalCount?: number,
): TechnicalTalentGraphMatchScore {
  const paths =
    match.paths ?? [];

  const weightedMatchCount =
    paths.reduce(
      (total, path) =>
        total +
        relationshipWeight(
          path.relationship,
        ),
      0,
    );

  const denominator =
    Math.max(
      requestedSignalCount ??
        match.matchCount,
      1,
    );

  const rawScore =
    (weightedMatchCount /
      denominator) *
    100;

  const score =
    Math.round(
      Math.min(
        100,
        rawScore,
      ),
    );

  const relationships =
    Array.from(
      new Set(
        paths.map(
          (path) =>
            path.relationship,
        ),
      ),
    );

  const explanation =
    paths.length === 0
      ? "No graph evidence matched the discovery query."
      : `${match.candidateLabel} matched ${match.matchCount} graph signal${match.matchCount === 1 ? "" : "s"} through ${relationships.join(", ")}.`;

  return {
    score,
    matchCount:
      match.matchCount,
    weightedMatchCount,
    explanation,
  };
}
