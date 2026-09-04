import assert from "node:assert/strict";

import {
  GitHubTechnicalTalentSource,
} from "./lib/technicalTalent/sources/github/GitHubTechnicalTalentSource";

const originalFetch = globalThis.fetch;

const requests: string[] = [];

const repository = {
  id: 101,
  name: "pytorch-examples",
  full_name: "acme-ai/pytorch-examples",
  html_url: "https://github.com/acme-ai/pytorch-examples",
  description: "PyTorch machine learning examples",
  language: "Python",
  topics: ["pytorch", "machine-learning"],
  stargazers_count: 1200,
  forks_count: 150,
  fork: false,
  owner: {
    login: "acme-ai",
    id: 900,
    avatar_url: "https://avatars.githubusercontent.com/u/900",
    html_url: "https://github.com/acme-ai",
    type: "Organization",
  },
};

const userProfile = {
  login: "alice-dev",
  id: 123,
  avatar_url: "https://avatars.githubusercontent.com/u/123",
  html_url: "https://github.com/alice-dev",
  name: "Alice Developer",
  bio: "Machine learning engineer working with PyTorch",
  company: "Meta",
  location: "Singapore",
  blog: "",
  public_repos: 42,
  followers: 500,
};

const contributors = [
  {
    login: "alice-dev",
    id: 123,
    html_url: "https://github.com/alice-dev",
    contributions: 87,
    type: "User",
  },
  {
    login: "dependabot[bot]",
    id: 456,
    html_url: "https://github.com/apps/dependabot",
    contributions: 200,
    type: "Bot",
  },
  {
    login: "some-org",
    id: 789,
    html_url: "https://github.com/some-org",
    contributions: 50,
    type: "Organization",
  },
  {
    login: "github-actions",
    id: 790,
    html_url: "https://github.com/github-actions",
    contributions: 500,
    type: "User",
  },
  {
    login: "C43H66N12O12S2",
    id: 791,
    html_url: "https://github.com/C43H66N12O12S2",
    contributions: 25,
    type: "User",
  },
];

globalThis.fetch = (async (
  input: RequestInfo | URL,
) => {
  const url = String(input);
  requests.push(url);

  if (
    url.includes("/search/repositories")
  ) {
    return new Response(
      JSON.stringify({
        total_count: 1,
        incomplete_results: false,
        items: [repository],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  if (
    url.includes(
      "/repos/acme-ai/pytorch-examples/contributors",
    )
  ) {
    return new Response(
      JSON.stringify(contributors),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  if (
    url.includes("/users/alice-dev")
  ) {
    return new Response(
      JSON.stringify(userProfile),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  throw new Error(
    `Unexpected GitHub request: ${url}`,
  );
}) as typeof fetch;

async function main() {
  try {
    const source =
      new GitHubTechnicalTalentSource();

  const result =
    await source.search({
      query: {
        roleFamilies: [
          "Machine Learning Engineer",
        ],
        technologies: [
          "PyTorch",
        ],
        openSourceFocused: true,
      },
      requestedSource: "GitHub",
      requestedAt:
        new Date().toISOString(),
      evidenceObjectives: [
        {
          requirement: "Technical",
          evidenceSlot: "technology: PyTorch",
          rationale:
            "GitHub is used to discover candidates through Technical evidence: technology: PyTorch.",
        },
        {
          requirement: "Open Source",
          evidenceSlot: "repositories",
          rationale:
            "GitHub is used to discover candidates through Open Source evidence: repositories.",
        },
      ],
    });

  const searchRequest =
    requests.find((url) =>
      url.includes(
        "/search/repositories",
      ),
    );

  assert.ok(
    searchRequest,
    "GitHub repository search should execute",
  );

  assert.match(
    searchRequest!,
    /PyTorch/i,
    "GitHub repository search should contain PyTorch",
  );

  assert.equal(
    result.source,
    "GitHub",
    "Result source should be GitHub",
  );

  assert.equal(
    result.records.length,
    2,
    "Evidence-first discovery should produce two eligible human contributor candidates",
  );

  assert.ok(
    result.records.some((record) => record.id === "github:123"),
    "Alice Developer should be discovered",
  );

  assert.ok(
    result.records.some((record) => record.id === "github:791"),
    "C43H66N12O12S2 should remain an eligible GitHub User",
  );

  assert.ok(
    !result.records.some((record) => record.id === "github:790"),
    "Known automation login github-actions should be excluded",
  );

  const candidate =
    result.records[0];

  assert.equal(
    candidate.id,
    "github:123",
    "Candidate should use the contributor GitHub identity",
  );

  assert.equal(
    candidate.name,
    "Alice Developer",
    "Candidate should use the GitHub profile name",
  );

  assert.ok(
    candidate.repositories?.some(
      (repository) =>
        repository.url ===
        "https://github.com/acme-ai/pytorch-examples",
    ),
    "Candidate should retain repository context",
  );

  const contributionEvidence =
    candidate.evidence.find(
      (evidence) =>
        evidence.id.includes(
          "github-repository-contribution",
        ),
    );

  assert.ok(
    contributionEvidence,
    "Candidate should contain repository contribution evidence",
  );
  assert.ok(
    contributionEvidence?.supports?.includes("PyTorch"),
    "Contribution evidence should normalize pytorch to PyTorch",
  );  console.log(
    JSON.stringify(
      result.evidence,
      null,
      2,
    ),
  );

  assert.equal(
    result.evidence.some(
      (evidence) =>
        evidence.source === "GitHub" &&
        evidence.externalId ===
          "acme-ai/pytorch-examples" &&
        evidence.organization ===
          "acme-ai",
    ),
    true,
    "Organization-owned repository should remain source evidence",
  );

  assert.equal(
    result.records.some(
      (record) =>
        record.id ===
        "github:900",
    ),
    false,
    "Organization identity must never become a candidate",
  );

  assert.equal(
    result.records.some(
      (record) =>
        record.id ===
        "github:456",
    ),
    false,
    "Bot contributor must never become a candidate",
  );

  console.log(
    "QUERY TARGETING: PASS",
  );

  console.log(
    "CONTRIBUTOR DISCOVERY: PASS",
  );

  console.log(
    "HUMAN IDENTITY FILTER: PASS",
  );

  console.log(
    "REPOSITORY EVIDENCE: PASS",
  );

  console.log(
    "===== ATLAS GITHUB EVIDENCE-FIRST TEST PASSED =====",
  );
  } finally {
    globalThis.fetch =
      originalFetch;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
