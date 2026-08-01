export interface CompanyCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const companyCategories: CompanyCategory[] = [
  {
    id: "hyperscaler",
    name: "Hyperscalers",
    description: "Global cloud providers operating hyperscale data centres.",
    icon: "☁️",
  },
  {
    id: "colo",
    name: "Colocation Providers",
    description: "Multi-tenant data centre operators.",
    icon: "🏢",
  },
  {
    id: "oem",
    name: "OEM / Manufacturers",
    description: "Power, cooling and infrastructure equipment vendors.",
    icon: "⚡",
  },
  {
    id: "construction",
    name: "Construction / EPC",
    description: "Construction, commissioning and EPC companies.",
    icon: "🏗️",
  },
  {
    id: "telecom",
    name: "Telecommunications",
    description: "Telecom operators with data centre infrastructure.",
    icon: "📡",
  },
  {
    id: "managed-services",
    name: "Managed Services",
    description: "Managed infrastructure and operations providers.",
    icon: "🛠️",
  },
  {
    id: "edge",
    name: "Edge Data Centres",
    description: "Regional edge computing providers.",
    icon: "🌐",
  },
  {
    id: "ai-cloud",
    name: "AI Cloud Providers",
    description: "GPU cloud and AI infrastructure companies.",
    icon: "🤖",
  },
];