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

  const valid =
    getRoleIntelligence(
      "data-center",
      "Critical Facilities Engineer",
    );

  assert(
    valid !== null,
    "Data Center Critical Facilities Engineer should be valid.",
  );

  console.log(
    "PASS: Data Center + Critical Facilities Engineer",
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
