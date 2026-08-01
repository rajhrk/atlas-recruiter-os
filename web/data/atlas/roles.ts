export interface AtlasRole {
  roleId: string;
  role: string;
  targetCompanies: string[];
  coreSkills: string[];
  certifications: string[];
  conferences: string[];
  booleanSearch: string;
  aiPrompt: string;
  recruiterNotes: string;
}

export const atlasRoles: AtlasRole[] = [
  {
    "roleId": "ROLE-001",
    "role": "Critical Facilities Engineer",
    "targetCompanies": [
      "AWS",
      "Microsoft",
      "Google",
      "Meta",
      "Equinix",
      "Digital Realty",
      "AirTrunk",
      "STT GDC"
    ],
    "coreSkills": [
      "UPS",
      "EPMS",
      "Switchgear",
      "Generator Systems"
    ],
    "certifications": [
      "ATD",
      "CDCS",
      "CDCP"
    ],
    "conferences": [
      "Data Centre World",
      "DCD Connect"
    ],
    "booleanSearch": "(\"critical facilities engineer\" OR \"critical environment engineer\")",
    "aiPrompt": "List the best Critical Facilities Engineers in APAC and EMEA and explain why they fit.",
    "recruiterNotes": "Start with hyperscalers, then move to colocation providers."
  },
  {
    "roleId": "ROLE-002",
    "role": "Electrical Engineer",
    "targetCompanies": [
      "Schneider Electric",
      "ABB",
      "Siemens",
      "Vertiv",
      "Eaton",
      "AWS",
      "Microsoft"
    ],
    "coreSkills": [
      "UPS",
      "MV",
      "LV",
      "EPMS",
      "Switchgear"
    ],
    "certifications": [
      "Schneider EcoXpert",
      "NFPA 70E"
    ],
    "conferences": [
      "Data Centre World"
    ],
    "booleanSearch": "(\"electrical engineer\" OR \"critical power engineer\" OR \"UPS engineer\")",
    "aiPrompt": "Generate a sourcing strategy for a Senior Electrical Engineer with UPS and EPMS experience.",
    "recruiterNotes": "Search OEMs before hyperscalers."
  },
  {
    "roleId": "ROLE-003",
    "role": "Mechanical Engineer",
    "targetCompanies": [
      "STULZ",
      "Vertiv",
      "Johnson Controls",
      "Trane",
      "Carrier",
      "Equinix",
      "AWS"
    ],
    "coreSkills": [
      "HVAC",
      "CRAH",
      "CRAC",
      "Chillers",
      "Liquid Cooling"
    ],
    "certifications": [
      "ASHRAE"
    ],
    "conferences": [
      "Data Centre World"
    ],
    "booleanSearch": "(\"mechanical engineer\" OR \"HVAC engineer\" OR \"cooling engineer\")",
    "aiPrompt": "Generate a sourcing strategy for a Mechanical Engineer with hyperscale cooling experience.",
    "recruiterNotes": "Liquid cooling experience is highly valuable."
  },
  {
    "roleId": "ROLE-004",
    "role": "Network Engineer",
    "targetCompanies": [
      "Cisco",
      "Arista",
      "Juniper",
      "AWS",
      "Google",
      "Meta"
    ],
    "coreSkills": [
      "BGP",
      "EVPN",
      "VXLAN",
      "Spine-Leaf",
      "InfiniBand"
    ],
    "certifications": [
      "CCNP",
      "CCIE"
    ],
    "conferences": [
      "Cisco Live"
    ],
    "booleanSearch": "(\"network engineer\" OR \"data center network engineer\")",
    "aiPrompt": "Generate a sourcing strategy for a Data Center Network Engineer.",
    "recruiterNotes": "Check GitHub for networking engineers."
  },
  {
    "roleId": "ROLE-005",
    "role": "Commissioning Engineer",
    "targetCompanies": [
      "Mercury",
      "Winthrop",
      "Schneider Electric",
      "Vertiv"
    ],
    "coreSkills": [
      "FAT",
      "SAT",
      "IST",
      "LOTO"
    ],
    "certifications": [
      "ATD",
      "Schneider EcoXpert"
    ],
    "conferences": [
      "Data Centre World"
    ],
    "booleanSearch": "(\"commissioning engineer\" OR \"electrical commissioning engineer\")",
    "aiPrompt": "Generate a sourcing strategy for a Commissioning Engineer.",
    "recruiterNotes": "Target EPC companies first."
  },
  {
    "roleId": "ROLE-006",
    "role": "Construction Manager",
    "targetCompanies": [
      "Mercury",
      "Winthrop",
      "Mace",
      "Turner & Townsend"
    ],
    "coreSkills": [
      "Primavera P6",
      "BIM",
      "QA/QC",
      "HSE"
    ],
    "certifications": [
      "PMP",
      "Primavera P6"
    ],
    "conferences": [
      "DCD Connect"
    ],
    "booleanSearch": "(\"construction manager\" OR \"project manager\")",
    "aiPrompt": "Generate a sourcing strategy for a Construction Manager.",
    "recruiterNotes": "Strong EPC experience is essential."
  },
  {
    "roleId": "ROLE-007",
    "role": "AI Infrastructure Engineer",
    "targetCompanies": [
      "NVIDIA",
      "Nebius",
      "CoreWeave",
      "Microsoft",
      "Google"
    ],
    "coreSkills": [
      "NVIDIA DGX",
      "HGX",
      "Kubernetes",
      "InfiniBand"
    ],
    "certifications": [
      "CKA",
      "NVIDIA Certified Professional"
    ],
    "conferences": [
      "NVIDIA GTC"
    ],
    "booleanSearch": "(\"AI infrastructure engineer\" OR \"GPU infrastructure engineer\")",
    "aiPrompt": "Generate a sourcing strategy for an AI Infrastructure Engineer.",
    "recruiterNotes": "Prioritize GPU and HPC experience."
  }
];
