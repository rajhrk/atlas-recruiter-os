import type { CompanyDomainIntelligence } from "@/types/companyDomainIntelligence";

export const META_HARDWARE_INTELLIGENCE: CompanyDomainIntelligence = {
  companyId: "meta",
  domainId: "hardware",

  priority: "Tier 1",

  targetRoles: [
    "Hardware Engineer",
    "Embedded Engineer",
    "Firmware Engineer",
    "ASIC Design Engineer",
    "RTL Design Engineer",
    "Verification Engineer",
    "FPGA Engineer",
    "Semiconductor Engineer",
    "VLSI Engineer",
  ],

  coreTechnologies: [
    "Digital Design",
    "Embedded Systems",
    "ASIC",
    "Semiconductor",
    "RTL",
    "Verilog",
    "SystemVerilog",
    "FPGA",
    "VLSI",
    "Computer Architecture",
    "Silicon Design",
    "Hardware Verification",
  ],

  certifications: [],

  conferences: [
    "ISSCC",
    "DAC",
    "Hot Chips",
    "DesignCon",
  ],

  strategicVendors: [],

  recruiterNotes:
    "Target hardware and silicon talent relevant to Meta across ASIC design, RTL, verification, FPGA, embedded systems, firmware and semiconductor engineering. Prioritize candidates with strong evidence of silicon development, hardware architecture, verification, tapeout, FPGA work, technical publications and hands-on hardware projects.",

  aiPrompt:
    "Find high-signal hardware and semiconductor talent relevant to Meta across hardware engineering, embedded systems, firmware, ASIC design, RTL design, verification, FPGA, semiconductor and VLSI engineering. Prioritize candidates with evidence from silicon development, chip architecture, RTL, verification, FPGA projects, tapeouts, GitHub, technical publications and hardware conferences.",

  booleanSearch:
    '("Hardware Engineer" OR "Embedded Engineer" OR "Firmware Engineer" OR "ASIC Design Engineer" OR "RTL Design Engineer" OR "Verification Engineer" OR "FPGA Engineer" OR "Semiconductor Engineer" OR "VLSI Engineer") AND ("Digital Design" OR "Embedded Systems" OR ASIC OR RTL OR Verilog OR SystemVerilog OR FPGA OR VLSI OR Semiconductor OR "Computer Architecture")',

  sourcingSignals: {
    technicalSignals: [
      "Digital Design",
      "Embedded Systems",
      "ASIC",
      "RTL",
      "Verilog",
      "SystemVerilog",
      "FPGA",
      "VLSI",
      "Computer Architecture",
      "Silicon Design",
      "Hardware Verification",
    ],

    ecosystemSignals: [
      "GitHub",
      "Open Source",
      "Silicon Engineering",
      "Hardware Engineering",
      "Semiconductor Engineering",
      "Chip Design",
    ],

    researchSignals: [
      "ISSCC",
      "DAC",
      "Hot Chips",
      "DesignCon",
      "Hardware Publications",
      "arXiv",
    ],
  },

  regions: ["Global"],
};

export default META_HARDWARE_INTELLIGENCE;
