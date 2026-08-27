import type { TalentDomainId } from "@/lib/atlas/talentDomains";

export interface TalentDomainCompanySeed {
  name: string;
  aliases?: string[];
  domains: TalentDomainId[];
}

/**
 * Curated companies that expand Atlas beyond its original
 * Data Center-focused company universe.
 *
 * A company may intentionally belong to multiple talent domains.
 */
export const DOMAIN_COMPANY_SEEDS: TalentDomainCompanySeed[] = [
  /*
   * ============================================================
   * AI / ML
   * ============================================================
   */
  {
    name: "OpenAI",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Anthropic",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Google DeepMind",
    domains: ["ai-ml", "software", "robotics"],
  },
  {
    name: "Mistral AI",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Cohere",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Hugging Face",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Scale AI",
    domains: ["ai-ml", "software"],
  },
  {
    name: "xAI",
    domains: ["ai-ml", "software"],
  },
  {
    name: "NVIDIA",
    domains: [
      "ai-ml",
      "hardware",
      "robotics",
      "software",
    ],
  },
  {
    name: "AMD",
    domains: [
      "ai-ml",
      "hardware",
      "software",
    ],
  },
  {
    name: "CoreWeave",
    domains: ["ai-ml", "data-center", "software"],
  },
  {
    name: "Crusoe",
    domains: ["ai-ml", "data-center", "software"],
  },
  {
    name: "Run:ai",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Lambda",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Together AI",
    domains: ["ai-ml", "software"],
  },
  {
    name: "Perplexity",
    domains: ["ai-ml", "software"],
  },

  /*
   * ============================================================
   * SOFTWARE
   * ============================================================
   */
  {
    name: "Microsoft",
    domains: ["software", "ai-ml", "data-center"],
  },
  {
    name: "Google",
    domains: ["software", "ai-ml", "data-center"],
  },
  {
    name: "Amazon",
    aliases: ["Amazon.com"],
    domains: ["software", "ai-ml", "data-center"],
  },
  {
    name: "Apple",
    domains: ["software", "hardware", "ai-ml"],
  },
  {
    name: "Meta",
    domains: [
      "software",
      "ai-ml",
      "robotics",
      "hardware",
      "data-center",
    ],
  },
  {
    name: "Salesforce",
    domains: ["software", "ai-ml"],
  },
  {
    name: "Oracle",
    domains: ["software", "ai-ml", "data-center"],
  },
  {
    name: "Adobe",
    domains: ["software", "ai-ml"],
  },
  {
    name: "Cloudflare",
    domains: ["software"],
  },
  {
    name: "Datadog",
    domains: ["software"],
  },
  {
    name: "Snowflake",
    domains: ["software", "ai-ml"],
  },
  {
    name: "Databricks",
    domains: ["software", "ai-ml"],
  },
  {
    name: "Stripe",
    domains: ["software"],
  },
  {
    name: "Atlassian",
    domains: ["software"],
  },
  {
    name: "GitLab",
    domains: ["software"],
  },
  {
    name: "MongoDB",
    domains: ["software"],
  },
  {
    name: "Palantir",
    domains: ["software", "ai-ml"],
  },
  {
    name: "ServiceNow",
    domains: ["software", "ai-ml"],
  },

  /*
   * ============================================================
   * ROBOTICS
   * ============================================================
   */
  {
    name: "Boston Dynamics",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Figure AI",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Agility Robotics",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Apptronik",
    domains: ["robotics", "ai-ml", "hardware"],
  },
  {
    name: "Sanctuary AI",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Covariant",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Physical Intelligence",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Skild AI",
    domains: ["robotics", "ai-ml"],
  },
  {
    name: "Waymo",
    domains: ["robotics", "ai-ml", "software"],
  },
  {
    name: "Tesla",
    domains: ["robotics", "ai-ml", "hardware", "software"],
  },
  {
    name: "Anduril",
    domains: ["robotics", "ai-ml", "hardware", "software"],
  },
  {
    name: "DJI",
    domains: ["robotics", "hardware", "ai-ml"],
  },
  {
    name: "ABB",
    domains: ["robotics", "hardware"],
  },
  {
    name: "FANUC",
    domains: ["robotics", "hardware"],
  },
  {
    name: "KUKA",
    domains: ["robotics", "hardware"],
  },
  {
    name: "Universal Robots",
    domains: ["robotics", "hardware"],
  },
  {
    name: "Intuitive Surgical",
    domains: ["robotics", "hardware", "ai-ml"],
  },

  /*
   * ============================================================
   * HARDWARE / SEMICONDUCTOR
   * ============================================================
   */
  {
    name: "Intel",
    domains: ["hardware", "ai-ml", "software"],
  },
  {
    name: "Qualcomm",
    domains: ["hardware", "ai-ml"],
  },
  {
    name: "Broadcom",
    domains: ["hardware", "software"],
  },
  {
    name: "Marvell",
    domains: ["hardware", "software"],
  },
  {
    name: "Arm",
    domains: ["hardware", "software", "ai-ml"],
  },
  {
    name: "MediaTek",
    domains: ["hardware", "ai-ml"],
  },
  {
    name: "Synopsys",
    domains: ["hardware", "software"],
  },
  {
    name: "Cadence Design Systems",
    aliases: ["Cadence"],
    domains: ["hardware", "software"],
  },
  {
    name: "Micron",
    domains: ["hardware", "ai-ml"],
  },
  {
    name: "Samsung Semiconductor",
    domains: ["hardware", "ai-ml"],
  },
  {
    name: "TSMC",
    domains: ["hardware"],
  },
  {
    name: "ASML",
    domains: ["hardware"],
  },
  {
    name: "Texas Instruments",
    domains: ["hardware"],
  },
  {
    name: "Infineon",
    domains: ["hardware"],
  },
  {
    name: "NXP Semiconductors",
    domains: ["hardware"],
  },
  {
    name: "Analog Devices",
    domains: ["hardware"],
  },
  {
    name: "Siemens EDA",
    domains: ["hardware", "software"],
  },
];
