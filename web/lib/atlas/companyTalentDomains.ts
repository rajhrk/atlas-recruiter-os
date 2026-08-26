import { AtlasCompany } from "@/types/company";
import {
  TALENT_DOMAINS,
  TalentDomainId,
} from "@/lib/atlas/talentDomains";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsSignal(
  values: string[],
  signals: string[],
): boolean {
  const text = values.map(normalize).join(" ");

  return signals.some((signal) =>
    text.includes(normalize(signal)),
  );
}

/**
 * Classify an Atlas company into one or more talent domains.
 *
 * Domain membership is intentionally based on strong company,
 * technology, infrastructure and role signals rather than broad
 * words such as "cloud", "AI" or "infrastructure".
 */
export function getCompanyTalentDomains(
  company: AtlasCompany,
): TalentDomainId[] {
  const domains = new Set<TalentDomainId>();

  const technologies = company.coreTechnologies ?? [];
  const roles = company.roles ?? [];
  const categories = company.categoryIds ?? [];
  const dataCenterTypes = company.dataCenterTypes ?? [];

  /*
   * ============================================================
   * DATA CENTER
   * ============================================================
   */

  const strongDataCenterCompanyTypes = [
    "Hyperscaler",
    "AI Cloud Provider",
    "Cloud Provider",
    "Colocation Provider",
    "Construction",
    "Managed Services",
  ];

  const strongDataCenterSignals = [
    "data center",
    "data centre",
    "critical facilities",
    "critical infrastructure",
    "power infrastructure",
    "electrical infrastructure",
    "mechanical infrastructure",
    "epms",
    "bms",
    "cooling",
    "ups",
    "generator",
    "substation",
    "switchgear",
    "medium voltage",
    "high voltage",
    "mission critical",
    "colocation",
    "hyperscale",
  ];

  if (
    strongDataCenterCompanyTypes.includes(
      company.companyType,
    ) ||
    dataCenterTypes.length > 0 ||
    company.dataCenterPresence.length > 0 ||
    containsSignal(
      [...technologies, ...roles, ...categories],
      strongDataCenterSignals,
    )
  ) {
    domains.add("data-center");
  }

  /*
   * ============================================================
   * AI / ML
   * ============================================================
   */

  const strongAISignals = [
    "machine learning",
    "deep learning",
    "generative ai",
    "large language model",
    "llm",
    "foundation model",
    "computer vision",
    "natural language processing",
    "reinforcement learning",
    "neural network",
    "gpu computing",
    "ai accelerator",
    "ai inference",
    "model training",
    "ml platform",
    "mlops",
    "cuda",
    "tensorflow",
    "pytorch",
    "transformer",
  ];

  if (
    containsSignal(
      [...technologies, ...roles, ...categories],
      strongAISignals,
    )
  ) {
    domains.add("ai-ml");
  }

  /*
   * ============================================================
   * SOFTWARE
   * ============================================================
   */

  const strongSoftwareSignals = [
    "software engineer",
    "software development",
    "backend",
    "backend engineer",
    "frontend",
    "frontend engineer",
    "full stack",
    "fullstack",
    "platform engineer",
    "distributed systems",
    "site reliability",
    "sre",
    "devops",
    "developer tools",
    "api",
    "saas",
    "web application",
    "mobile application",
    "database",
    "kubernetes",
    "container orchestration",
  ];

  if (
    containsSignal(
      [...technologies, ...roles, ...categories],
      strongSoftwareSignals,
    )
  ) {
    domains.add("software");
  }

  /*
   * ============================================================
   * ROBOTICS
   * ============================================================
   */

  const strongRoboticsSignals = [
    "robotics",
    "robot",
    "autonomous robot",
    "autonomous systems",
    "robot perception",
    "robot manipulation",
    "motion planning",
    "robot learning",
    "embodied ai",
    "ros",
    "ros2",
    "simultaneous localization",
    "slam",
    "robot control",
    "robotics engineer",
    "robotics research",
    "humanoid",
    "industrial robot",
    "mobile robot",
    "warehouse robot",
    "drone",
    "uav",
  ];

  if (
    containsSignal(
      [...technologies, ...roles, ...categories],
      strongRoboticsSignals,
    )
  ) {
    domains.add("robotics");
  }

  /*
   * ============================================================
   * HARDWARE
   * ============================================================
   */

  const strongHardwareSignals = [
    "semiconductor",
    "semiconductors",
    "asic",
    "fpga",
    "vlsi",
    "rtl",
    "silicon",
    "chip design",
    "chip architecture",
    "processor design",
    "cpu architecture",
    "gpu architecture",
    "hardware engineer",
    "hardware design",
    "embedded systems",
    "embedded engineer",
    "firmware",
    "embedded software",
    "electrical engineer",
    "electronics engineer",
    "pcb",
    "board design",
    "microcontroller",
    "soc",
    "system on chip",
    "verification engineer",
    "physical design",
    "digital design",
    "analog design",
  ];

  if (
    company.companyType === "OEM" ||
    containsSignal(
      [...technologies, ...roles, ...categories],
      strongHardwareSignals,
    )
  ) {
    domains.add("hardware");
  }

  /*
   * Keep output aligned with the canonical Atlas domain order.
   */
  return TALENT_DOMAINS
    .map((domain) => domain.id)
    .filter((domainId) =>
      domains.has(domainId),
    );
}

export function companyMatchesTalentDomain(
  company: AtlasCompany,
  domainId: TalentDomainId,
): boolean {
  return getCompanyTalentDomains(
    company,
  ).includes(domainId);
}

export function getCompaniesForTalentDomain(
  companies: AtlasCompany[],
  domainId: TalentDomainId,
): AtlasCompany[] {
  return companies.filter((company) =>
    companyMatchesTalentDomain(
      company,
      domainId,
    ),
  );
}
