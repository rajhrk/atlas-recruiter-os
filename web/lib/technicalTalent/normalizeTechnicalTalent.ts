// ============================================================
// Atlas Recruiter OS
// Cross-Domain Technical Talent Normalization
//
// Converts domain-specific role intelligence into the shared
// discovery representation.
//
// This layer does NOT discover candidates.
// It normalizes existing Atlas technical talent intelligence.
// ============================================================

import type {
  AIMLDomain,
  AIMLRole,
} from "@/types/aiMl";

import type {
  RoboticsDomain,
  RoboticsRole,
} from "@/types/robotics";

import type {
  HardwareDomain,
  HardwareRole,
} from "@/types/hardware";

import type {
  SemiconductorDomain,
  SemiconductorRole,
} from "@/types/semiconductor";

import type {
  DiscoverySkill,
  DiscoveryTechnicalDomain,
  DiscoveryTechnology,
  DiscoveryTalentType,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

/**
 * Convert a technical role title into the closest normalized
 * discovery talent type.
 *
 * This is intentionally conservative.
 */
export function normalizeTalentType(
  title: string,
): DiscoveryTalentType {
  const value = title.toLowerCase();

  if (value.includes("research scientist")) {
    return "Research Scientist";
  }

  if (value.includes("applied scientist")) {
    return "Applied Scientist";
  }

  if (value.includes("research engineer")) {
    return "Research Engineer";
  }

  if (value.includes("ml engineer")) {
    return "ML Engineer";
  }

  if (
    value.includes("ai engineer") ||
    value.includes("artificial intelligence")
  ) {
    return "AI Engineer";
  }

  if (value.includes("robotics")) {
    return "Robotics Engineer";
  }

  if (value.includes("firmware")) {
    return "Firmware Engineer";
  }

  if (value.includes("embedded")) {
    return "Embedded Engineer";
  }

  if (value.includes("asic")) {
    return "ASIC Engineer";
  }

  if (value.includes("fpga")) {
    return "FPGA Engineer";
  }

  if (
    value.includes("silicon") ||
    value.includes("soc")
  ) {
    return "Silicon Engineer";
  }

  if (value.includes("verification")) {
    return "Verification Engineer";
  }

  if (
    value.includes("physical design") ||
    value.includes("physical-design")
  ) {
    return "Physical Design Engineer";
  }

  if (value.includes("dft")) {
    return "DFT Engineer";
  }

  if (value.includes("analog")) {
    return "Analog Engineer";
  }

  if (value.includes("architecture")) {
    return "Computer Architect";
  }

  if (value.includes("system")) {
    return "Systems Engineer";
  }

  if (value.includes("hardware")) {
    return "Hardware Engineer";
  }

  if (value.includes("software")) {
    return "Software Engineer";
  }

  return "Other";
}

/**
 * Normalize a list of strings into discovery skills.
 */
export function normalizeSkills(
  skills: string[] = [],
  domain?: DiscoveryTechnicalDomain,
): DiscoverySkill[] {
  return skills.map((name) => ({
    name,
    normalizedName: name.toLowerCase().trim(),
    domain,
  }));
}

/**
 * Normalize a list of strings into discovery technologies.
 */
export function normalizeTechnologies(
  technologies: string[] = [],
  domain?: DiscoveryTechnicalDomain,
): DiscoveryTechnology[] {
  return technologies.map((name) => ({
    name,
    normalizedName: name.toLowerCase().trim(),
    domain,
  }));
}

/**
 * Build a stable internal ID for a role-derived discovery record.
 */
function buildRoleId(
  domain: DiscoveryTechnicalDomain,
  roleId: string,
): string {
  return `role:${domain.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:${roleId}`;
}

/**
 * Normalize a generic role into a discovery record.
 */
function normalizeBaseRole(
  role: {
    id: string;
    title: string;
    normalizedTitle: string;
    family: string;
    seniority?: string;
    aliases: string[];
    skills: string[];
    technologies: string[];
    relatedRoles?: string[];
    sourcingSignals?: string[];
    recruiterNotes?: string[];
  },
  domain: DiscoveryTechnicalDomain,
): TechnicalTalentDiscoveryRecord {
  const discoveryId = buildRoleId(domain, role.id);

  return {
    id: discoveryId,

    name: role.title,

    headline: `${role.title} — ${domain}`,

    primaryDomain: domain,

    talentType: normalizeTalentType(role.title),

    roleFamily: role.family,

    normalizedRole: role.normalizedTitle,

    seniority: role.seniority,

    skills: normalizeSkills(role.skills, domain),

    technologies: normalizeTechnologies(
      role.technologies,
      domain,
    ),

    sourcingSignals: role.sourcingSignals?.map(
      (signal) => ({
        type: "Technical Depth",
        signal,
        strength: "Medium",
        explanation:
          "Signal inherited from the domain role intelligence model.",
      }),
    ),

    confidence: "High",

    approvalStatus: "Unreviewed",

    recruiterNotes: role.recruiterNotes,

    sourceRecordIds: [role.id],

    firstDiscoveredAt: undefined,

    lastVerifiedAt: undefined,

    evidence: [],
  };
}

/**
 * Normalize an AI / ML role.
 */
export function normalizeAIMLRole(
  role: AIMLRole,
): TechnicalTalentDiscoveryRecord {
  const base = normalizeBaseRole(
    role,
    "AI / ML",
  );

  return {
    ...base,

    researchAreas: role.researchAreas,

    sourcingSignals: [
      ...(base.sourcingSignals ?? []),

      ...(role.targetCompanies ?? []).map(
        (company) => ({
          type: "Company Affiliation" as const,
          signal: company,
          strength: "Medium" as const,
          explanation:
            "Target company signal inherited from AI / ML role intelligence.",
        }),
      ),
    ],
  };
}

/**
 * Normalize a Robotics role.
 */
export function normalizeRoboticsRole(
  role: RoboticsRole,
): TechnicalTalentDiscoveryRecord {
  const base = normalizeBaseRole(
    role,
    "Robotics",
  );

  return {
    ...base,

    researchAreas: role.researchAreas,

    sourcingSignals: [
      ...(base.sourcingSignals ?? []),
      ...(role.sourcingSignals ?? []).map(
        (signal) => ({
          type: "Technical Depth" as const,
          signal,
          strength: "Medium" as const,
          explanation:
            "Signal inherited from Robotics role intelligence.",
        }),
      ),
    ],
  };
}

/**
 * Normalize a Hardware / Embedded role.
 */
export function normalizeHardwareRole(
  role: HardwareRole,
): TechnicalTalentDiscoveryRecord {
  const base = normalizeBaseRole(
    role,
    "Hardware / Embedded",
  );

  return {
    ...base,

    technologies: normalizeTechnologies(
      role.technologies,
      "Hardware / Embedded",
    ),

    sourcingSignals: [
      ...(base.sourcingSignals ?? []),
      ...(role.sourcingSignals ?? []).map(
        (signal) => ({
          type: "Technical Depth" as const,
          signal,
          strength: "Medium" as const,
          explanation:
            "Signal inherited from Hardware / Embedded role intelligence.",
        }),
      ),
    ],

    recruiterNotes: [
      ...(role.recruiterNotes ?? []),

      ...(role.protocols ?? []).map(
        (protocol) =>
          `Protocol / interface: ${protocol}`,
      ),

      ...(role.platforms ?? []).map(
        (platform) =>
          `Platform: ${platform}`,
      ),
    ],
  };
}

/**
 * Normalize a Semiconductor role.
 */
export function normalizeSemiconductorRole(
  role: SemiconductorRole,
): TechnicalTalentDiscoveryRecord {
  const base = normalizeBaseRole(
    role,
    "Semiconductor",
  );

  return {
    ...base,

    technologies: normalizeTechnologies(
      role.technologies,
      "Semiconductor",
    ),

    sourcingSignals: [
      ...(base.sourcingSignals ?? []),
      ...(role.sourcingSignals ?? []).map(
        (signal) => ({
          type: "Technical Depth" as const,
          signal,
          strength: "Medium" as const,
          explanation:
            "Signal inherited from Semiconductor role intelligence.",
        }),
      ),
    ],

    recruiterNotes: [
      ...(role.recruiterNotes ?? []),

      ...(role.languages ?? []).map(
        (language) =>
          `Language: ${language}`,
      ),

      ...(role.methodologies ?? []).map(
        (methodology) =>
          `Methodology: ${methodology}`,
      ),

      ...(role.platforms ?? []).map(
        (platform) =>
          `Platform: ${platform}`,
      ),
    ],
  };
}

/**
 * Normalize every role from every supported domain.
 *
 * This is the main entry point for the future discovery layer.
 */
export function normalizeTechnicalTalentRoles({
  aiMl,
  robotics,
  hardware,
  semiconductor,
}: {
  aiMl?: AIMLDomain;
  robotics?: RoboticsDomain;
  hardware?: HardwareDomain;
  semiconductor?: SemiconductorDomain;
}): TechnicalTalentDiscoveryRecord[] {
  const records: TechnicalTalentDiscoveryRecord[] = [];

  if (aiMl) {
    records.push(
      ...aiMl.roles.map(normalizeAIMLRole),
    );
  }

  if (robotics) {
    records.push(
      ...robotics.roles.map(normalizeRoboticsRole),
    );
  }

  if (hardware) {
    records.push(
      ...hardware.roles.map(normalizeHardwareRole),
    );
  }

  if (semiconductor) {
    records.push(
      ...semiconductor.roles.map(
        normalizeSemiconductorRole,
      ),
    );
  }

  return records;
}