import type {
  AtlasGraph,
} from "@/types/graph";

import {
  buildTechnicalTalentGraph,
} from "@/lib/graph/technicalTalentGraphBuilder";

import type {
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

/**
 * Build the knowledge graph for one normalized
 * technical-talent discovery record.
 *
 * The service intentionally delegates graph construction
 * to the graph builder. This gives Atlas a stable service
 * boundary for future graph persistence, merging, and
 * cross-candidate relationship operations.
 */
export function buildTechnicalTalentGraphForCandidate(
  candidate: TechnicalTalentDiscoveryRecord,
): AtlasGraph {
  return buildTechnicalTalentGraph(
    candidate,
  );
}
