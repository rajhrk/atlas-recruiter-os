import {
  scoreTechnicalTalentGraphMatch,
} from "@/lib/graph/technicalTalentGraphMatchScorer";

import type {
  TechnicalTalentGraphMatch,
} from "@/types/technicalTalentDiscovery";

export interface TechnicalTalentCombinedRankingInput {
  candidateId: string;
  candidateLabel: string;
  fitScore: number;
  graphMatch?: TechnicalTalentGraphMatch;

  /**
   * Whether graph evidence was actually available for
   * this candidate.
   *
   * false means graph enrichment was unavailable and the
   * candidate must not be penalized for missing graph data.
   */
  graphEvidenceAvailable?: boolean;

  /**
   * Total number of graph signals requested by the
   * discovery query.
   *
   * This allows partial graph coverage to be scored
   * correctly rather than treating every candidate's
   * matched signals as 100% coverage.
   */
  graphMatchRequestedSignalCount?: number;
}

export interface TechnicalTalentCombinedRankingResult {
  candidateId: string;
  candidateLabel: string;

  fitScore: number;

  graphScore: number;

  combinedScore: number;

  graphMatchCount: number;

  explanation: string;
}

const FIT_WEIGHT = 0.7;
const GRAPH_WEIGHT = 0.3;

/**
 * Combine Atlas's existing evidence-first candidate fit
 * with deterministic graph evidence.
 *
 * The existing fit score remains authoritative at 70%.
 * Graph evidence contributes an additional 30%.
 */
export function rankTechnicalTalentCandidate(
  input: TechnicalTalentCombinedRankingInput,
): TechnicalTalentCombinedRankingResult {
  const graphEvidenceAvailable =
    input.graphEvidenceAvailable ??
    !!input.graphMatch;

  const graphScoreResult =
    graphEvidenceAvailable &&
    input.graphMatch
      ? scoreTechnicalTalentGraphMatch(
          input.graphMatch,
          input.graphMatchRequestedSignalCount,
        )
      : {
          score: 0,
          matchCount: 0,
          weightedMatchCount: 0,
          explanation:
            "Graph evidence was unavailable for this candidate.",
        };

  const combinedScore =
    Math.round(
      graphEvidenceAvailable
        ? (
            (
              input.fitScore *
              FIT_WEIGHT
            ) +
            (
              graphScoreResult.score *
              GRAPH_WEIGHT
            )
          )
        : input.fitScore,
    );

  const explanation =
    !graphEvidenceAvailable
      ? `${input.candidateLabel}: ${input.fitScore} fit score; graph evidence unavailable, so no graph penalty was applied.`
      : input.graphMatch
        ? `${input.candidateLabel}: ${input.fitScore} fit score + ${graphScoreResult.score} graph score = ${combinedScore} combined score.`
        : `${input.candidateLabel}: ${input.fitScore} fit score + 0 graph score = ${combinedScore} combined score.`;

  return {
    candidateId:
      input.candidateId,

    candidateLabel:
      input.candidateLabel,

    fitScore:
      input.fitScore,

    graphScore:
      graphScoreResult.score,

    combinedScore,

    graphMatchCount:
      graphScoreResult.matchCount,

    explanation,
  };
}

/**
 * Rank a candidate collection using the combined score.
 *
 * Tie-breakers preserve the existing evidence-first
 * ordering semantics:
 *
 * 1. Combined score
 * 2. Existing fit score
 * 3. Graph score
 * 4. Candidate label
 */
export function rankTechnicalTalentCandidates(
  inputs: TechnicalTalentCombinedRankingInput[],
): TechnicalTalentCombinedRankingResult[] {
  return inputs
    .map(
      rankTechnicalTalentCandidate,
    )
    .sort(
      (a, b) =>
        b.combinedScore -
          a.combinedScore ||
        b.fitScore -
          a.fitScore ||
        b.graphScore -
          a.graphScore ||
        a.candidateLabel.localeCompare(
          b.candidateLabel,
        ),
    );
}
