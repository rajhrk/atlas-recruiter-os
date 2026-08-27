import {
  getCompanyDomainIntelligence,
} from "@/lib/atlas/companyDomainIntelligenceService";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

function main(): void {
  console.log(
    "===== META DOMAIN ISOLATION TEST =====",
  );

  const dataCenter =
    getCompanyDomainIntelligence(
      "meta",
      "data-center",
    );

  const aiMl =
    getCompanyDomainIntelligence(
      "meta",
      "ai-ml",
    );

  const robotics =
    getCompanyDomainIntelligence(
      "meta",
      "robotics",
    );

  const hardware =
    getCompanyDomainIntelligence(
      "meta",
      "hardware",
    );

  assert(
    dataCenter !== null,
    "Meta → Data Center exists",
  );

  assert(
    dataCenter?.companyType === "Hyperscaler",
    "Meta → Data Center remains Hyperscaler",
  );

  assert(
    dataCenter !== null &&
      dataCenter.targetRoles.includes(
        "Critical Facilities Engineer",
      ),
    "Meta → Data Center contains Critical Facilities Engineer",
  );

  assert(
    aiMl !== null,
    "Meta → AI/ML exists",
  );

  assert(
    !aiMl?.targetRoles.includes(
      "Critical Facilities Engineer",
    ),
    "Meta → AI/ML excludes Data Center roles",
  );

  assert(
    !aiMl?.coreTechnologies.includes(
      "Critical Facilities",
    ),
    "Meta → AI/ML excludes Data Center technologies",
  );

  assert(
    !aiMl?.companyType,
    "Meta → AI/ML has no Company Type",
  );

  assert(
    robotics !== null,
    "Meta → Robotics exists",
  );

  assert(
    robotics !== null &&
      robotics.targetRoles.includes(
        "Robotics Engineer",
      ),
    "Meta → Robotics contains Robotics Engineer",
  );

  assert(
    robotics !== null &&
      robotics.coreTechnologies.includes(
        "ROS2",
      ),
    "Meta → Robotics contains ROS2",
  );

  assert(
    !robotics?.targetRoles.includes(
      "Critical Facilities Engineer",
    ),
    "Meta → Robotics excludes Data Center roles",
  );

  assert(
    !robotics?.coreTechnologies.includes(
      "Critical Facilities",
    ),
    "Meta → Robotics excludes Data Center technologies",
  );

  assert(
    !robotics?.dataCenterTypes,
    "Meta → Robotics has no Data Center Types",
  );

  assert(
    !robotics?.dataCenterPresence,
    "Meta → Robotics has no Data Center Presence",
  );

  assert(
    !robotics?.companyType,
    "Meta → Robotics has no Company Type",
  );

  assert(
    hardware !== null,
    "Meta → Hardware exists",
  );

  assert(
    hardware !== null &&
      hardware.targetRoles.includes(
        "Hardware Engineer",
      ),
    "Meta → Hardware contains Hardware Engineer",
  );

  assert(
    hardware !== null &&
      hardware.coreTechnologies.includes(
        "ASIC",
      ),
    "Meta → Hardware contains ASIC",
  );

  assert(
    !hardware?.targetRoles.includes(
      "Critical Facilities Engineer",
    ),
    "Meta → Hardware excludes Data Center roles",
  );

  assert(
    !hardware?.coreTechnologies.includes(
      "Critical Facilities",
    ),
    "Meta → Hardware excludes Data Center technologies",
  );

  assert(
    !hardware?.dataCenterTypes,
    "Meta → Hardware has no Data Center Types",
  );

  assert(
    !hardware?.dataCenterPresence,
    "Meta → Hardware has no Data Center Presence",
  );

  assert(
    !hardware?.companyType,
    "Meta → Hardware has no Company Type",
  );

  console.log(
    "\nPASS: Meta domain intelligence is isolated.",
  );
}

main();
