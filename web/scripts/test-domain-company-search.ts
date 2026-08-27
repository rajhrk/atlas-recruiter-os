import {
  searchAtlas,
} from "@/lib/search/searchEngine";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function findCompany(
  results: ReturnType<typeof searchAtlas>,
  name: string,
) {
  return results.find(
    (result) =>
      result.type === "company" &&
      result.title.toLowerCase() ===
        name.toLowerCase(),
  );
}

function main(): void {
  console.log(
    "===== ATLAS DOMAIN COMPANY SEARCH TEST =====",
  );

  /*
   * ============================================================
   * DATA CENTER
   * ============================================================
   */

  console.log(
    "\n===== DATA CENTER =====",
  );

  const dataCenterMeta =
    findCompany(
      searchAtlas(
        "meta",
        "data-center",
      ),
      "Meta",
    );

  assert(
    dataCenterMeta !== undefined,
    "Meta should be available in Data Center search.",
  );

  assert(
    dataCenterMeta?.subtitle ===
      "Hyperscaler",
    `Data Center Meta should show Hyperscaler, received ${dataCenterMeta?.subtitle}.`,
  );

  console.log(
    "PASS: Data Center → Meta",
  );

  console.log(
    `PASS: Data Center → Meta classification = ${dataCenterMeta?.subtitle}`,
  );

  /*
   * ============================================================
   * AI / ML
   * ============================================================
   */

  console.log(
    "\n===== AI/ML =====",
  );

  const aiMeta =
    findCompany(
      searchAtlas(
        "meta",
        "ai-ml",
      ),
      "Meta",
    );

  assert(
    aiMeta !== undefined,
    "Meta should be available in AI/ML search.",
  );

  assert(
    aiMeta?.subtitle ===
      "AI/ML",
    `AI/ML Meta should show AI/ML, received ${aiMeta?.subtitle}.`,
  );

  console.log(
    "PASS: AI/ML → Meta",
  );

  console.log(
    `PASS: AI/ML → Meta classification = ${aiMeta?.subtitle}`,
  );

  /*
   * ============================================================
   * SOFTWARE
   * ============================================================
   */

  console.log(
    "\n===== SOFTWARE =====",
  );

  const softwareMeta =
    findCompany(
      searchAtlas(
        "meta",
        "software",
      ),
      "Meta",
    );

  assert(
    softwareMeta !== undefined,
    "Meta should be available in Software search.",
  );

  assert(
    softwareMeta?.subtitle ===
      "Software",
    `Software Meta should show Software, received ${softwareMeta?.subtitle}.`,
  );

  console.log(
    "PASS: Software → Meta",
  );

  console.log(
    `PASS: Software → Meta classification = ${softwareMeta?.subtitle}`,
  );

  /*
   * ============================================================
   * ROBOTICS
   * ============================================================
   */

  console.log(
    "\n===== ROBOTICS =====",
  );

  const roboticsMeta =
    findCompany(
      searchAtlas(
        "meta",
        "robotics",
      ),
      "Meta",
    );

  assert(
    roboticsMeta === undefined,
    "Meta must NOT appear in Robotics search.",
  );

  console.log(
    "PASS: Robotics → Meta rejected",
  );

  /*
   * ============================================================
   * HARDWARE
   * ============================================================
   */

  console.log(
    "\n===== HARDWARE =====",
  );

  const hardwareMeta =
    findCompany(
      searchAtlas(
        "meta",
        "hardware",
      ),
      "Meta",
    );

  assert(
    hardwareMeta === undefined,
    "Meta must NOT appear in Hardware search.",
  );

  console.log(
    "PASS: Hardware → Meta rejected",
  );

  /*
   * ============================================================
   * GLOBAL SEARCH REGRESSION
   * ============================================================
   */

  console.log(
    "\n===== GLOBAL SEARCH =====",
  );

  const globalMeta =
    findCompany(
      searchAtlas("meta"),
      "Meta",
    );

  assert(
    globalMeta !== undefined,
    "Global search must still find Meta.",
  );

  assert(
    globalMeta?.subtitle ===
      "Hyperscaler",
    `Global search should retain company type, received ${globalMeta?.subtitle}.`,
  );

  console.log(
    "PASS: Global search → Meta remains available",
  );

  console.log(
    "\nPASS: Domain-scoped company search works correctly.",
  );
}

main();
