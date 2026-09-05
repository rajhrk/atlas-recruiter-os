import {
  resolveTechnicalTalentIdentity,
} from "./lib/technicalTalent/technicalTalentIdentityResolver";
import {
  resolveCrossSourceIdentities,
} from "./lib/technicalTalent/technicalTalentDiscoveryOrchestrator";
import type {
  DiscoveryEvidence,
  TechnicalTalentDiscoveryRecord,
} from "./types/technicalTalentDiscovery";

function makeRecord(
  id: string,
  name: string,
  orcid?: string,
  extras: Partial<TechnicalTalentDiscoveryRecord> = {},
): TechnicalTalentDiscoveryRecord {
  return {
    id,
    name,
    firstName: name.split(" ")[0],
    lastName: name.split(" ").slice(1).join(" "),
    normalizedRole: "Machine Learning Researcher",
    primaryDomain: "AI / ML",
    secondaryDomains: [],
    skills: [
      {
        name: "Machine Learning",
        normalizedName: "machine learning",
        evidenceIds: [`${id}:skill`],
      },
    ],
    technologies: [
      {
        name: "PyTorch",
        normalizedName: "pytorch",
        domain: "AI / ML",
        evidenceIds: [`${id}:tech`],
      },
    ],
    researchAreas: ["Deep Learning"],
    publications: [],
    repositories: [],
    evidence: [
      ...(orcid
        ? [
            {
              id: `${id}:orcid:${orcid}`,
              source: id.startsWith("github:")
                ? "GitHub"
                : "OpenAlex",
              type: "Technical Profile",
              title: "ORCID",
              url: `https://orcid.org/${orcid}`,
              description: `ORCID identity for ${name}.`,
              confidence: "Very High",
            } satisfies DiscoveryEvidence,
          ]
        : []),
      ...(extras.evidence ?? []),
    ],
    sourceRecordIds: extras.sourceRecordIds ?? [id],
    confidence: extras.confidence ?? "High",
    approvalStatus: extras.approvalStatus ?? "Unreviewed",
    ...extras,
  };
}

function assert(
  condition: boolean,
  message: string,
) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

function run() {
  console.log(
    "\n=== ORCID IDENTITY CONFLICT REGRESSION TESTS ===\n",
  );

  /*
   * 1. Same ORCID → merge.
   */
  {
    const left = makeRecord(
      "openalex:author:alex",
      "Alex Researcher",
      "0000-0002-1825-0097",
    );

    const right = makeRecord(
      "github:user:alex",
      "Alex Researcher",
      "0000-0002-1825-0097",
    );

    const result =
      resolveTechnicalTalentIdentity(
        left,
        right,
      );

    assert(
      result.shouldMerge,
      "Same ORCID should merge",
    );

    assert(
      result.score >= 90,
      "Same ORCID should produce a high identity score",
    );
  }

  /*
   * 2. Different ORCID + same name → never merge.
   */
  {
    const left = makeRecord(
      "openalex:author:person-a",
      "Alex Researcher",
      "0000-0002-1825-0097",
    );

    const right = makeRecord(
      "openalex:author:person-b",
      "Alex Researcher",
      "0000-0003-1234-5678",
    );

    const result =
      resolveTechnicalTalentIdentity(
        left,
        right,
      );

    assert(
      !result.shouldMerge,
      "Different ORCID + same name must not merge",
    );

    assert(
      result.score === 0,
      "ORCID conflict must force identity score to zero",
    );

    assert(
      result.reasons.some(
        (reason) =>
          reason.signal ===
          "Conflicting ORCID identities",
      ),
      "ORCID conflict must be explicitly explained",
    );
  }

  /*
   * 3. OpenAlex ORCID + GitHub same ORCID → merge.
   */
  {
    const left = makeRecord(
      "openalex:author:cross-source",
      "Jordan Engineer",
      "0000-0002-1111-2222",
    );

    const right = makeRecord(
      "github:user:jordan-engineer",
      "Jordan Engineer",
      "0000-0002-1111-2222",
    );

    const result =
      resolveTechnicalTalentIdentity(
        left,
        right,
      );

    assert(
      result.shouldMerge,
      "OpenAlex + GitHub with same ORCID should merge",
    );
  }

  /*
   * 4. One side has no ORCID + strong GitHub identity.
   * ORCID absence must NOT become a conflict.
   */
  {
    const left = makeRecord(
      "openalex:author:no-orcid",
      "Taylor Engineer",
    );

    const right = makeRecord(
      "github:user:taylor-engineer",
      "Taylor Engineer",
      undefined,
      {
        evidence: [
          {
            id: "github:profile:taylor-engineer",
            source: "GitHub",
            type: "Technical Profile",
            title: "GitHub Profile",
            url: "https://github.com/taylor-engineer",
            description:
              "GitHub profile for Taylor Engineer.",
            confidence: "Very High",
          },
        ],
      },
    );

    const result =
      resolveTechnicalTalentIdentity(
        left,
        right,
      );

    assert(
      !result.reasons.some(
        (reason) =>
          reason.signal ===
          "Conflicting ORCID identities",
      ),
      "Missing ORCID must not create a conflict",
    );

    assert(
      result.score > 0,
      "Records without conflicting ORCID may still use probabilistic identity signals",
    );
  }

  /*
   * 5. Multiple OpenAlex author IDs with different ORCIDs
   * must remain separate.
   */
  {
    const records = [
      makeRecord(
        "openalex:author:adam-1",
        "Adam Paszke",
        "0000-0002-7665-4559",
      ),
      makeRecord(
        "openalex:author:adam-2",
        "Adam Paszke",
        "0000-0003-0697-6664",
      ),
      makeRecord(
        "openalex:author:adam-3",
        "Adam Paszke",
        "0000-0002-5216-6542",
      ),
    ];

    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        const result =
          resolveTechnicalTalentIdentity(
            records[i],
            records[j],
          );

        assert(
          !result.shouldMerge,
          `Adam Paszke OpenAlex identities ${i + 1} and ${j + 1} must remain separate`,
        );

        assert(
          result.score === 0,
          `Adam Paszke OpenAlex identities ${i + 1} and ${j + 1} must have zero identity score`,
        );
      }
    }
  }

  /*
   * 6. Adam Paszke-style collision:
   * same name + same technical profile + different ORCID.
   */
  {
    const left = makeRecord(
      "openalex:author:adam-a",
      "Adam Paszke",
      "0000-0002-7665-4559",
    );

    const right = makeRecord(
      "openalex:author:adam-b",
      "Adam Paszke",
      "0000-0003-2147-9850",
    );

    const result =
      resolveTechnicalTalentIdentity(
        left,
        right,
      );

    assert(
      !result.shouldMerge,
      "Adam Paszke-style identity collision must not merge",
    );

    assert(
      result.requiresReview === false,
      "Explicit ORCID conflict must not be promoted to manual identity review",
    );
  }


  /*
   * Cluster transitivity regression:
   *
   * A + ORCID X
   * B + ORCID X
   *   -> legitimate direct ORCID bridge
   *
   * (A+B) + C + ORCID X
   *   -> C must NOT be absorbed merely because the
   *      cluster already contains ORCID X.
   *
   * This protects against transitive same-source identity
   * contamination.
   */
  {
    const recordA = makeRecord(
      "openalex:author:cluster-a",
      "Cluster Researcher",
      "0000-0002-9999-0001",
    );

    const recordB = makeRecord(
      "openalex:author:cluster-b",
      "Cluster Researcher",
      "0000-0002-9999-0001",
    );

    const recordC = makeRecord(
      "openalex:author:cluster-c",
      "Cluster Researcher",
      "0000-0002-9999-0001",
    );

    const result =
      resolveCrossSourceIdentities([
        recordA,
        recordB,
        recordC,
      ]);

    assert(
      result.records.length === 2,
      "Transitive same-source ORCID cluster must remain split",
    );

    const cluster =
      result.records.find(
        (record) =>
          record.sourceRecordIds?.includes(
            "openalex:author:cluster-a",
          ) &&
          record.sourceRecordIds?.includes(
            "openalex:author:cluster-b",
          ),
      );

    assert(
      Boolean(cluster),
      "Direct same-ORCID OpenAlex identities should form a legitimate cluster",
    );

    assert(
      !cluster?.sourceRecordIds?.includes(
        "openalex:author:cluster-c",
      ),
      "Third OpenAlex identity must not enter an existing multi-ID cluster transitively",
    );

    const isolated =
      result.records.find(
        (record) =>
          record.sourceRecordIds?.includes(
            "openalex:author:cluster-c",
          ),
      );

    assert(
      Boolean(isolated),
      "Third OpenAlex identity must remain as a separate record",
    );

    assert(
      isolated?.sourceRecordIds?.length === 1,
      "Isolated third identity must retain only its own OpenAlex identity",
    );
  }

  console.log(
    "\n=== ALL ORCID CONFLICT TESTS PASSED ===\n",
  );
}

run();
