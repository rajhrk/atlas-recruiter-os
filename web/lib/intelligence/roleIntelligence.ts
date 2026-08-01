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

export function getRoleIntelligence(role: string): RoleIntelligence | null {
  return roleDatabase[role.trim().toLowerCase()] ?? null;
}