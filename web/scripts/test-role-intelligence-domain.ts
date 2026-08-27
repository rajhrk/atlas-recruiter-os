import {
  getRoleIntelligence,
} from "@/lib/intelligence/roleIntelligence";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function main(): void {
  console.log(
    "===== ATLAS ROLE INTELLIGENCE DOMAIN TEST =====",
  );

  /*
   * Existing Data Center regression test.
   */
  const dataCenterRole =
    getRoleIntelligence(
      "data-center",
      "Critical Facilities Engineer",
    );

  assert(
    dataCenterRole !== null,
    "Data Center Critical Facilities Engineer should be valid.",
  );

  console.log(
    "PASS: Data Center + Critical Facilities Engineer",
  );

  /*
   * AI/ML role universe must match TALENT_DOMAINS.
   */
  const aiMlRoles = [
    "ML Engineer",
    "Research Scientist",
    "Research Engineer",
    "Applied Scientist",
    "Computer Vision Engineer",
    "NLP Engineer",
    "Generative AI Engineer",
    "Deep Learning Engineer",
  ];

  console.log(
    "\n===== AI/ML ROLES =====",
  );

  for (const role of aiMlRoles) {
    const intelligence =
      getRoleIntelligence(
        "ai-ml",
        role,
      );

    assert(
      intelligence !== null,
      `AI/ML role "${role}" should resolve.`,
    );

    assert(
      intelligence.role === role,
      `AI/ML role "${role}" resolved to "${intelligence.role}".`,
    );

    console.log(
      `PASS: ai-ml + ${role}`,
    );
  }

  /*
   * AI/ML roles must never resolve as Data Center intelligence.
   */
  console.log(
    "\n===== AI/ML → DATA CENTER REJECTION =====",
  );

  for (const role of aiMlRoles) {
    const result =
      getRoleIntelligence(
        "data-center",
        role,
      );

    assert(
      result === null,
      `Data Center must reject AI/ML role "${role}".`,
    );

    console.log(
      `PASS: data-center rejects ${role}`,
    );
  }

  /*
   * Existing Data Center role must remain rejected
   * by every non-Data-Center domain.
   */
  console.log(
    "\n===== DATA CENTER → OTHER DOMAIN REJECTION =====",
  );

  const invalidDomains = [
    "ai-ml",
    "software",
    "robotics",
    "hardware",
  ] as const;

  for (const domain of invalidDomains) {
    const result =
      getRoleIntelligence(
        domain,
        "Critical Facilities Engineer",
      );

    assert(
      result === null,
      `${domain} must reject Critical Facilities Engineer.`,
    );

    console.log(
      `PASS: ${domain} rejects Critical Facilities Engineer`,
    );
  }

  console.log(
    "\nPASS: Role intelligence is domain-scoped.",
  );
}

main();
