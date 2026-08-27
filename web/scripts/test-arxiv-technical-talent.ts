import type {
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function normalizeName(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

/**
 * Deterministic fixture representing the output
 * that the arXiv adapter receives when the same
 * researcher appears on multiple papers.
 */
const arxivAuthors = [
  {
    name: "Yafei Ou",
    paperId: "2608.25192v1",
    title:
      "CRESSim-Neo: A Batched GPU Simulation Engine for Surgical Robotics and Robot Learning",
    categories: ["cs.RO"],
  },
  {
    name: "Yafei Ou",
    paperId: "2605.31481v1",
    title:
      "Batched Differentiable Rigid Body Dynamics in PyTorch for GPU-Accelerated Robot Learning",
    categories: ["cs.RO", "cs.LG"],
  },
  {
    name: "Yafei Ou",
    paperId: "2601.12345v1",
    title:
      "Differentiable Simulation for Robot Learning",
    categories: ["cs.RO", "cs.LG"],
  },
  {
    name: "Different Researcher",
    paperId: "2602.54321v1",
    title:
      "Robotic Manipulation with Learned Policies",
    categories: ["cs.RO"],
  },
] as const;

/**
 * Mirror the aggregation invariant implemented
 * by the arXiv adapter:
 *
 * one normalized author identity
 * -> one Atlas record
 * -> accumulated publications
 * -> accumulated source identities
 * -> accumulated research areas
 */
function aggregateArxivAuthors(
  authors: typeof arxivAuthors,
): TechnicalTalentDiscoveryRecord[] {
  const records =
    new Map<
      string,
      TechnicalTalentDiscoveryRecord
    >();

  for (const author of authors) {
    const normalized =
      normalizeName(author.name);

    const identity =
      `arxiv:${normalized}`;

    const existing =
      records.get(identity);

    const sourceRecordId =
      `arxiv:${author.paperId}:${author.name}`;

    const publication = {
      title:
        author.title,
      venue:
        "arXiv",
      year:
        Number(
          `20${author.paperId.slice(0, 2)}`,
        ),
      url:
        `https://arxiv.org/abs/${author.paperId}`,
      researchAreas:
        [...author.categories],
    };

    if (!existing) {
      records.set(
        identity,
        {
          id:
            identity,
          name:
            author.name,
          talentType:
            "Robotics Engineer",
          primaryDomain:
            "Robotics",
          roleFamily:
            "Robotics Engineer",
          normalizedRole:
            "Robotics Engineer",
          skills: [],
          technologies: [],
          researchAreas:
            [...author.categories],
          publications: [
            publication,
          ],
          evidence: [],
          sourcingSignals: [],
          confidence:
            "High",
          approvalStatus:
            "Unreviewed",
          sourceRecordIds: [
            sourceRecordId,
          ],
          firstDiscoveredAt:
            "2026-08-27T00:00:00.000Z",
          lastVerifiedAt:
            "2026-08-27T00:00:00.000Z",
        },
      );

      continue;
    }

    existing.publications = [
      ...(existing.publications ?? []),
      publication,
    ];

    existing.researchAreas =
      Array.from(
        new Set([
          ...(existing.researchAreas ?? []),
          ...author.categories,
        ]),
      );

    existing.sourceRecordIds =
      Array.from(
        new Set([
          ...(existing.sourceRecordIds ?? []),
          sourceRecordId,
        ]),
      );
  }

  return Array.from(
    records.values(),
  );
}

function main(): void {
  console.log(
    "===== ATLAS ARXIV TECHNICAL TALENT AGGREGATION TEST =====",
  );

  const records =
    aggregateArxivAuthors(
      arxivAuthors,
    );

  console.log(
    "\nTOTAL UNIQUE AUTHORS:",
    records.length,
  );

  const yafei =
    records.find(
      (record) =>
        record.id ===
        "arxiv:yafei-ou",
    );

  assert(
    yafei,
    "Yafei Ou was not created.",
  );

  console.log(
    "\n===== YAFEI OU =====",
  );

  console.log({
    id:
      yafei.id,
    name:
      yafei.name,
    publications:
      yafei.publications?.map(
        (publication) =>
          publication.title,
      ),
    publicationCount:
      yafei.publications?.length ?? 0,
    researchAreas:
      yafei.researchAreas,
    sourceRecordIds:
      yafei.sourceRecordIds,
  });

  assert(
    records.length === 2,
    `Expected 2 unique authors, received ${records.length}.`,
  );

  assert(
    (yafei.publications?.length ?? 0) === 3,
    `Expected Yafei Ou to have 3 publications, received ${yafei.publications?.length ?? 0}.`,
  );

  assert(
    (yafei.sourceRecordIds?.length ?? 0) === 3,
    `Expected 3 source record IDs, received ${yafei.sourceRecordIds?.length ?? 0}.`,
  );

  assert(
    (yafei.researchAreas?.length ?? 0) === 2,
    `Expected 2 unique research areas, received ${yafei.researchAreas?.length ?? 0}.`,
  );

  assert(
    yafei.researchAreas?.includes(
      "cs.RO",
    ) === true,
    "cs.RO research area was not preserved.",
  );

  assert(
    yafei.researchAreas?.includes(
      "cs.LG",
    ) === true,
    "cs.LG research area was not accumulated.",
  );

  assert(
    new Set(
      yafei.sourceRecordIds ?? [],
    ).size === 3,
    "Duplicate source record IDs were introduced.",
  );

  console.log(
    "\nPASS: arXiv multi-paper author aggregation works.",
  );
}

main();
