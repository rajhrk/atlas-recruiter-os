import {
  POST,
} from "../app/api/technical-talent/enrichment/route";

import type {
  TechnicalTalentDiscoveryRecord,
} from "../types/technicalTalentDiscovery";

async function main() {
  console.log(
    "===== ATLAS ENRICHMENT API RUNTIME TEST =====",
  );

  const candidate =
    {
      id: "github:test-runtime",
      name: "Linus Torvalds",
      primaryDomain: "AI / ML",
      headline:
        "Technical talent runtime fixture",
      roleFamily:
        "Software Engineering",
      normalizedRole:
        "Software Engineer",
      skills: [
        {
          name: "Linux",
        },
        {
          name: "Git",
        },
      ],
      technologies: [
        {
          name: "Git",
        },
        {
          name: "Linux",
        },
      ],
      evidence: [],
      approvalStatus: "Unreviewed",
    } as TechnicalTalentDiscoveryRecord;


  const request =
    new Request(
      "http://localhost/api/technical-talent/enrichment",
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          candidate,
          sources: [
            "GitHub",
          ],
        }),
      },
    );

  const response =
    await POST(request);

  console.log(
    "STATUS:",
    response.status,
  );

  if (
    response.status !== 200
  ) {
    const body =
      await response.text();

    throw new Error(
      `Expected HTTP 200, received ${response.status}: ${body}`,
    );
  }

  const body =
    await response.json();

  if (
    !body.candidate
  ) {
    throw new Error(
      "Response does not contain candidate.",
    );
  }

  if (
    !body.enrichment
  ) {
    throw new Error(
      "Response does not contain enrichment.",
    );
  }

  if (
    body.candidate.id !==
    candidate.id
  ) {
    throw new Error(
      "Candidate identity was not preserved.",
    );
  }

  if (
    body.candidate.name !==
    candidate.name
  ) {
    throw new Error(
      "Candidate name was not preserved.",
    );
  }

  if (
    body.candidate.approvalStatus !==
    candidate.approvalStatus
  ) {
    throw new Error(
      "Candidate approvalStatus was not preserved.",
    );
  }

  if (
    !Array.isArray(
      body.enrichment.sourcesSuccessful,
    )
  ) {
    throw new Error(
      "sourcesSuccessful is not an array.",
    );
  }

  if (
    !Array.isArray(
      body.enrichment.sourcesFailed,
    )
  ) {
    throw new Error(
      "sourcesFailed is not an array.",
    );
  }

  console.log(
    "CANDIDATE ID:",
    body.candidate.id,
  );

  console.log(
    "CANDIDATE NAME:",
    body.candidate.name,
  );

  console.log(
    "EVIDENCE COUNT:",
    body.candidate.evidence?.length ?? 0,
  );

  console.log(
    "REPOSITORIES:",
    body.candidate.repositories?.length ?? 0,
  );

  console.log(
    "SOURCES SUCCESSFUL:",
    body.enrichment.sourcesSuccessful,
  );

  console.log(
    "SOURCES FAILED:",
    body.enrichment.sourcesFailed,
  );

  if (
    body.enrichment.sourcesFailed.length >
    0
  ) {
    throw new Error(
      "GitHub enrichment unexpectedly reported a source failure.",
    );
  }

  if (
    !body.enrichment.sourcesSuccessful.includes(
      "GitHub",
    )
  ) {
    throw new Error(
      "GitHub was not reported as successful.",
    );
  }

  console.log(
    "\n✅ ENRICHMENT API RUNTIME PASSED",
  );
}

main().catch(
  (error) => {
    console.error(
      "\n❌ ENRICHMENT API RUNTIME FAILED",
    );

    console.error(
      error,
    );

    process.exit(1);
  },
);
