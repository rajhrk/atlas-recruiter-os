import {
  orchestrateTechnicalTalentDiscovery,
} from "@/lib/technicalTalent/technicalTalentDiscoveryOrchestrator";

import {
  technicalTalentSourceRegistry,
} from "@/lib/technicalTalent/technicalTalentSourceRegistry";

import type {
  DiscoveryEvidence,
  DiscoverySource,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

import type {
  TechnicalTalentDiscoverySourceAdapter,
  TechnicalTalentSourceResult,
} from "@/types/technicalTalentDiscoverySource";

const OPENALEX = "OpenAlex" as DiscoverySource;
const GITHUB = "GitHub" as DiscoverySource;

const openAlexRecord: TechnicalTalentDiscoveryRecord = {
  id: "openalex:test-researcher",
  name: "Alex Researcher",
  normalizedRole: "Machine Learning Researcher",
  primaryDomain: "AI / ML",
  sourceRecordIds: ["openalex:author:ALEX123"],
   confidence: "High",
  approvalStatus: "Unreviewed",
  skills: [
    {
      name: "Machine Learning",
      normalizedName: "machine learning",
      evidenceIds: ["openalex:work:W123"],
    },
  ],
  technologies: [
    {
      name: "PyTorch",
      normalizedName: "pytorch",
      domain: "AI / ML",
      evidenceIds: ["openalex:work:W123"],
    },
  ],
  researchAreas: ["Deep Learning"],
  publications: [
    {
      title: "Deep Learning with PyTorch",
      url: "https://openalex.org/W123",
      evidenceId: "openalex:work:W123",
    },
  ],
  evidence: [
    {
      id: "openalex:orcid:0000-0002-1825-0097",
      source: "OpenAlex",
      type: "Technical Profile",
      title: "ORCID",
      url: "https://orcid.org/0000-0002-1825-0097",
      description: "ORCID identity for Alex Researcher.",
      confidence: "Very High",
      supports: ["ORCID identity"],
    },
    {
      id: "openalex:work:W123",
      source: "OpenAlex",
      type: "Publication",
      title: "Deep Learning with PyTorch",
      url: "https://openalex.org/W123",
      description:
        "Research publication demonstrating machine learning and PyTorch expertise.",
      confidence: "High",
      supports: ["Machine Learning", "PyTorch"],
    } satisfies DiscoveryEvidence,
  ],
};

const githubRecord: TechnicalTalentDiscoveryRecord = {
  id: "github:alex-researcher",
  name: "Alex Researcher",
  normalizedRole: "Machine Learning Researcher",
  primaryDomain: "AI / ML",
  sourceRecordIds: ["github:user:alex-researcher"],
   confidence: "High",
  approvalStatus: "Unreviewed",
  skills: [
    {
      name: "Machine Learning",
      normalizedName: "machine learning",
      evidenceIds: ["github:repo:ml-research-pytorch"],
    },
  ],
  technologies: [
    {
      name: "Python",
      normalizedName: "python",
      domain: "AI / ML",
      evidenceIds: ["github:repo:ml-research-pytorch"],
    },
    {
      name: "PyTorch",
      normalizedName: "pytorch",
      domain: "AI / ML",
      evidenceIds: ["github:repo:ml-research-pytorch"],
    },
  ],
  repositories: [
    {
      repository: "ml-research-pytorch",
      url: "https://github.com/alex-researcher/ml-research-pytorch",
      owner: "alex-researcher",
      description: "Machine learning repository using PyTorch and Python.",
      technologies: ["PyTorch", "Python"],
      evidenceId: "github:repo:ml-research-pytorch",
    },
  ],
  evidence: [
    {
      id: "github:orcid:0000-0002-1825-0097",
      source: "GitHub",
      type: "Technical Profile",
      title: "ORCID",
      url: "https://orcid.org/0000-0002-1825-0097",
      description: "ORCID identity for Alex Researcher.",
      confidence: "Very High",
      supports: ["ORCID identity"],
    },
    {
      id: "github:repo:ml-research-pytorch",
      source: "GitHub",
      type: "Repository",
      title: "ml-research-pytorch",
      url: "https://github.com/alex-researcher/ml-research-pytorch",
      description:
        "Machine learning repository using PyTorch and Python.",
      confidence: "High",
      supports: ["Machine Learning", "PyTorch"],
    } satisfies DiscoveryEvidence,
  ],
};

function createAdapter(
  source: DiscoverySource,
  record: TechnicalTalentDiscoveryRecord,
): TechnicalTalentDiscoverySourceAdapter {
  return {
    config: {
      source,
      name: source,
      description: `Test ${source} adapter`,
      enabled: true,
      capabilities: {
        identity: true,
        technicalProfile: true,
        skills: true,
        technologies: true,
        publications: source === OPENALEX,
        repositories: source === GITHUB,
        openSource: source === GITHUB,
        researchProjects: source === OPENALEX,
      },
    },

    async search(request): Promise<TechnicalTalentSourceResult> {
      return {
        source,
        query: request,
        records: [record],
        evidence: [],
        total: 1,
        hasMore: false,
        searchedAt: new Date().toISOString(),
      };
    },
  };
}

async function main() {
console.log("\n=== EVIDENCE → CANDIDATE NORMALIZATION ===");

const previousOpenAlex =
  technicalTalentSourceRegistry.get(OPENALEX);

const previousGitHub =
  technicalTalentSourceRegistry.get(GITHUB);

technicalTalentSourceRegistry.register(
  createAdapter(OPENALEX, openAlexRecord),
);

technicalTalentSourceRegistry.register(
  createAdapter(GITHUB, githubRecord),
);

try {
  const result =
    await orchestrateTechnicalTalentDiscovery(
      {
        skills: ["Machine Learning"],
        technologies: ["PyTorch", "Python"],
        researchAreas: ["Deep Learning"],
      },
      {
        sources: [OPENALEX, GITHUB],
        limit: 10,
      },
    );

  console.log("\n=== SOURCES ===");
  console.log(
    JSON.stringify(
      {
        requested: result.sourcesRequested,
        successful: result.sourcesSuccessful,
        failed: result.sourcesFailed,
      },
      null,
      2,
    ),
  );

  if (result.sourcesSuccessful.length !== 2) {
    throw new Error(
      "FAIL: Both test sources did not execute successfully.",
    );
  }

  console.log("\n=== RECORDS ===");
  console.log(
    JSON.stringify(
      result.records,
      null,
      2,
    ),
  );

  if (result.records.length !== 1) {
    throw new Error(
      `FAIL: Expected 1 merged candidate, got ${result.records.length}.`,
    );
  }

  const candidate =
    result.records[0];

  const evidence =
    candidate.evidence ?? [];

  const evidenceSources =
    new Set(
      evidence.map(
        (item) => item.source,
      ),
    );

  console.log("\n=== ASSERTIONS ===");

  if (!evidenceSources.has(OPENALEX)) {
    throw new Error(
      "FAIL: OpenAlex evidence was not retained.",
    );
  }

  console.log(
    "PASS: OpenAlex evidence retained.",
  );

  if (!evidenceSources.has(GITHUB)) {
    throw new Error(
      "FAIL: GitHub evidence was not retained.",
    );
  }

  console.log(
    "PASS: GitHub evidence retained.",
  );

  const sourceRecordIds =
    candidate.sourceRecordIds ?? [];

  if (
    !sourceRecordIds.includes(
      "openalex:author:ALEX123",
    )
  ) {
    throw new Error(
      "FAIL: OpenAlex source identity was not retained.",
    );
  }

  if (
    !sourceRecordIds.includes(
      "github:user:alex-researcher",
    )
  ) {
    throw new Error(
      "FAIL: GitHub source identity was not retained.",
    );
  }

  console.log(
    "PASS: Source identities retained.",
  );

  const technologyNames =
    (candidate.technologies ?? []).map(
      (technology) =>
        technology.normalizedName,
    );

  if (
    !technologyNames.includes("pytorch") ||
    !technologyNames.includes("python")
  ) {
    throw new Error(
      "FAIL: Cross-source technology signals were not normalized.",
    );
  }

  console.log(
    "PASS: Cross-source technology signals normalized.",
  );

  if (
    !candidate.verification
  ) {
    throw new Error(
      "FAIL: Candidate verification was not produced.",
    );
  }

  console.log(
    "PASS: Candidate verification produced.",
  );

  if (
    !candidate.fitScore ||
    candidate.fitScore.overall <= 0
  ) {
    throw new Error(
      "FAIL: Merged candidate received no technical fit score.",
    );
  }

  console.log(
    `PASS: Candidate fit score = ${candidate.fitScore.overall}.`,
  );

  if (
    !result.rankings ||
    result.rankings.length !== 1
  ) {
    throw new Error(
      "FAIL: Expected one final candidate ranking.",
    );
  }

  const ranking =
    result.rankings[0];

  if (
    ranking.combinedScore <= 0
  ) {
    throw new Error(
      "FAIL: Combined ranking score was not produced.",
    );
  }

  console.log(
    `PASS: Combined ranking score = ${ranking.combinedScore}.`,
  );

  console.log("\n=== VERIFICATION ===");
  console.log(
    JSON.stringify(
      candidate.verification,
      null,
      2,
    ),
  );

  console.log("\n=== FIT SCORE ===");
  console.log(
    JSON.stringify(
      candidate.fitScore,
      null,
      2,
    ),
  );

  console.log("\n=== RANKING ===");
  console.log(
    JSON.stringify(
      ranking,
      null,
      2,
    ),
  );

  console.log(
    "\n=== EVIDENCE → CANDIDATE NORMALIZATION TEST PASSED ===",
  );
} finally {
  if (previousOpenAlex) {
    technicalTalentSourceRegistry.register(
      previousOpenAlex,
    );
  }

  if (previousGitHub) {
    technicalTalentSourceRegistry.register(
      previousGitHub,
    );
  }
}

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
