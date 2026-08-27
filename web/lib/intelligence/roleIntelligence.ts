import {
  TALENT_DOMAINS,
  type TalentDomainId,
} from "@/lib/atlas/talentDomains";

export interface RoleIntelligence {
  role: string;
  overview: string;
  companies: string[];
  skills: string[];
  certifications: string[];
  conferences: string[];
}

const roleDatabase: Record<string, RoleIntelligence> = {
  "critical facilities engineer": {
    role: "Critical Facilities Engineer",

    overview:
      "Responsible for operating, maintaining and troubleshooting critical electrical, mechanical and cooling infrastructure within hyperscale and colocation data centres.",

    companies: [
      "AWS",
      "Microsoft",
      "Google",
      "Meta",
      "Equinix",
      "Digital Realty",
      "AirTrunk",
      "NTT GDC",
      "STT GDC",
    ],

    skills: [
      "UPS",
      "Generators",
      "EPMS",
      "BMS",
      "Switchgear",
      "HVAC",
      "CRAC",
      "Chillers",
    ],

    certifications: [
      "CDCS",
      "CDCP",
      "ATD",
    ],

    conferences: [
      "Data Centre World",
      "DCD Connect",
      "7x24 Exchange",
      "OCP Summit",
    ],
  },
};

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

function isRoleAllowedForDomain(
  domainId: TalentDomainId,
  role: string,
): boolean {
  const domain = TALENT_DOMAINS.find(
    (item) => item.id === domainId,
  );

  if (!domain) {
    return false;
  }

  return domain.roles.some(
    (domainRole) =>
      normalizeRole(domainRole) ===
      normalizeRole(role),
  );
}

export function getRoleIntelligence(
  domainId: TalentDomainId,
  role: string,
): RoleIntelligence | null {
  if (
    !isRoleAllowedForDomain(
      domainId,
      role,
    )
  ) {
    return null;
  }

  return (
    roleDatabase[
      normalizeRole(role)
    ] ?? null
  );
}
