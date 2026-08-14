import type {
  SemiconductorBooleanLibrary,
  SemiconductorDomain,
  SemiconductorResearchLandscape,
  SemiconductorRole,
  SemiconductorSkill,
  SemiconductorTechnology,
} from "@/types/semiconductor";

export const semiconductorRoles: SemiconductorRole[] = [
  {
    id: "rtl-design-engineer",
    title: "RTL Design Engineer",
    normalizedTitle: "RTL Design Engineer",
    family: "RTL / Digital Design",
    aliases: [
      "RTL Engineer",
      "Digital Design Engineer",
      "ASIC Design Engineer",
      "Logic Design Engineer",
      "RTL Design Engineer",
    ],
    skills: [
      "RTL Design",
      "Digital Logic Design",
      "Microarchitecture",
      "Pipelining",
      "Clock Domain Crossing",
      "Low Power Design",
    ],
    technologies: [
      "SystemVerilog",
      "Verilog",
      "VHDL",
      "Synthesis",
      "Design Compiler",
      "PrimeTime",
    ],
    languages: [
      "SystemVerilog",
      "Verilog",
      "VHDL",
      "Python",
      "Tcl",
    ],
    methodologies: [
      "RTL Design",
      "CDC",
      "Lint",
      "Synthesis",
      "Low Power",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
      "NPU",
      "Networking ASIC",
    ],
    relatedRoles: [
      "Design Verification Engineer",
      "SoC Architect",
      "Physical Design Engineer",
      "DFT Engineer",
    ],
    sourcingSignals: [
      "RTL",
      "SystemVerilog",
      "Verilog",
      "microarchitecture",
      "CDC",
      "ASIC",
      "SoC",
      "synthesis",
    ],
    recruiterNotes: [
      "Prioritize candidates who describe ownership of blocks or subsystems rather than only verification.",
      "Look for evidence of RTL implementation, synthesis and timing closure interaction.",
    ],
  },

  {
    id: "asic-design-engineer",
    title: "ASIC Design Engineer",
    normalizedTitle: "ASIC Design Engineer",
    family: "RTL / Digital Design",
    aliases: [
      "ASIC Engineer",
      "ASIC Design Engineer",
      "Digital ASIC Engineer",
      "Logic Design Engineer",
      "RTL Engineer",
    ],
    skills: [
      "ASIC Design",
      "RTL",
      "Digital Logic",
      "Microarchitecture",
      "Synthesis",
      "Timing",
    ],
    technologies: [
      "SystemVerilog",
      "Verilog",
      "Synopsys",
      "Cadence",
      "PrimeTime",
    ],
    languages: [
      "SystemVerilog",
      "Verilog",
      "Python",
      "Tcl",
    ],
    methodologies: [
      "RTL-to-GDS",
      "Lint",
      "CDC",
      "Synthesis",
      "Timing Closure",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
      "AI Accelerator",
    ],
    relatedRoles: [
      "RTL Design Engineer",
      "Design Verification Engineer",
      "Physical Design Engineer",
      "SoC Architect",
    ],
    sourcingSignals: [
      "ASIC",
      "RTL",
      "SystemVerilog",
      "Verilog",
      "SoC",
      "synthesis",
      "timing closure",
    ],
    recruiterNotes: [
      "ASIC Engineer can be a broad title; inspect the actual design stage and ownership.",
      "Separate front-end RTL candidates from physical-design or verification specialists.",
    ],
  },

  {
    id: "design-verification-engineer",
    title: "Design Verification Engineer",
    normalizedTitle: "Design Verification Engineer",
    family: "Design Verification",
    aliases: [
      "DV Engineer",
      "ASIC Verification Engineer",
      "RTL Verification Engineer",
      "SoC Verification Engineer",
      "Design Verification Engineer",
    ],
    skills: [
      "Functional Verification",
      "Testbench Development",
      "Coverage",
      "Assertions",
      "Debugging",
      "Verification Planning",
    ],
    technologies: [
      "SystemVerilog",
      "UVM",
      "Verilog",
      "Questa",
      "VCS",
      "Xcelium",
    ],
    languages: [
      "SystemVerilog",
      "Python",
      "C++",
      "C",
    ],
    methodologies: [
      "UVM",
      "Constrained Random Verification",
      "Coverage Driven Verification",
      "Assertions",
      "Formal Verification",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
      "NPU",
    ],
    relatedRoles: [
      "RTL Design Engineer",
      "Formal Verification Engineer",
      "Silicon Validation Engineer",
      "SoC Architect",
    ],
    sourcingSignals: [
      "UVM",
      "SystemVerilog",
      "functional verification",
      "coverage",
      "assertions",
      "VCS",
      "Questa",
      "Xcelium",
    ],
    recruiterNotes: [
      "UVM plus SystemVerilog is a strong signal for front-end ASIC verification.",
      "Look for coverage ownership, testbench architecture and debug responsibility.",
    ],
  },

  {
    id: "formal-verification-engineer",
    title: "Formal Verification Engineer",
    normalizedTitle: "Formal Verification Engineer",
    family: "Design Verification",
    aliases: [
      "Formal Verification Engineer",
      "Formal Methods Engineer",
      "Formal Design Verification Engineer",
      "Property Verification Engineer",
    ],
    skills: [
      "Formal Verification",
      "Property Checking",
      "Assertions",
      "Model Checking",
      "RTL Verification",
    ],
    technologies: [
      "SystemVerilog",
      "SVA",
      "JasperGold",
      "VC Formal",
      "Questa Formal",
    ],
    languages: [
      "SystemVerilog",
      "SVA",
      "Python",
    ],
    methodologies: [
      "Formal Property Verification",
      "Model Checking",
      "Equivalence Checking",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
    ],
    relatedRoles: [
      "Design Verification Engineer",
      "RTL Design Engineer",
      "Logic Design Engineer",
    ],
    sourcingSignals: [
      "formal verification",
      "JasperGold",
      "VC Formal",
      "SVA",
      "property checking",
      "equivalence checking",
    ],
    recruiterNotes: [
      "Formal verification is a specialized niche and should not be treated as generic DV.",
      "Search both formal and equivalence-checking terminology.",
    ],
  },

  {
    id: "physical-design-engineer",
    title: "Physical Design Engineer",
    normalizedTitle: "Physical Design Engineer",
    family: "Physical Design",
    aliases: [
      "Physical Design Engineer",
      "Backend Design Engineer",
      "Place and Route Engineer",
      "PD Engineer",
      "ASIC Physical Design Engineer",
    ],
    skills: [
      "Physical Design",
      "Floorplanning",
      "Placement",
      "Clock Tree Synthesis",
      "Routing",
      "Timing Closure",
    ],
    technologies: [
      "Innovus",
      "ICC2",
      "Fusion Compiler",
      "PrimeTime",
      "Calibre",
    ],
    languages: [
      "Tcl",
      "Python",
      "Perl",
    ],
    methodologies: [
      "Place and Route",
      "CTS",
      "STA",
      "Physical Verification",
      "Timing Closure",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
      "AI Accelerator",
    ],
    relatedRoles: [
      "STA Engineer",
      "DFT Engineer",
      "RTL Design Engineer",
      "Physical Verification Engineer",
    ],
    sourcingSignals: [
      "Innovus",
      "ICC2",
      "Fusion Compiler",
      "place and route",
      "CTS",
      "timing closure",
      "physical design",
    ],
    recruiterNotes: [
      "Distinguish physical design from RTL/front-end design.",
      "Look for ownership across floorplanning, placement, CTS and routing.",
    ],
  },

  {
    id: "physical-verification-engineer",
    title: "Physical Verification Engineer",
    normalizedTitle: "Physical Verification Engineer",
    family: "Physical Design",
    aliases: [
      "Physical Verification Engineer",
      "PV Engineer",
      "DRC LVS Engineer",
      "Layout Verification Engineer",
    ],
    skills: [
      "Physical Verification",
      "DRC",
      "LVS",
      "Layout Verification",
      "Design Rule Checking",
    ],
    technologies: [
      "Calibre",
      "IC Validator",
      "Virtuoso",
      "Cadence",
      "Synopsys",
    ],
    languages: [
      "Tcl",
      "Python",
      "SKILL",
    ],
    methodologies: [
      "DRC",
      "LVS",
      "ERC",
      "Physical Verification",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "Analog IC",
      "Mixed Signal",
    ],
    relatedRoles: [
      "Physical Design Engineer",
      "Analog Layout Engineer",
      "DFT Engineer",
    ],
    sourcingSignals: [
      "DRC",
      "LVS",
      "Calibre",
      "IC Validator",
      "physical verification",
      "layout verification",
    ],
    recruiterNotes: [
      "Physical verification is distinct from general physical design.",
      "Calibre and DRC/LVS terminology are strong sourcing signals.",
    ],
  },

  {
    id: "sta-engineer",
    title: "Static Timing Analysis Engineer",
    normalizedTitle: "Static Timing Analysis Engineer",
    family: "Static Timing Analysis",
    aliases: [
      "STA Engineer",
      "Timing Engineer",
      "Static Timing Engineer",
      "Timing Closure Engineer",
    ],
    skills: [
      "Static Timing Analysis",
      "Timing Closure",
      "Constraint Development",
      "Clock Analysis",
      "Signal Integrity",
    ],
    technologies: [
      "PrimeTime",
      "Tempus",
      "Design Compiler",
      "Innovus",
      "ICC2",
    ],
    languages: [
      "Tcl",
      "Python",
    ],
    methodologies: [
      "STA",
      "Timing Closure",
      "OCV",
      "MCMM",
      "Clock Analysis",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
    ],
    relatedRoles: [
      "Physical Design Engineer",
      "RTL Design Engineer",
      "Signoff Engineer",
    ],
    sourcingSignals: [
      "STA",
      "PrimeTime",
      "Tempus",
      "timing closure",
      "MCMM",
      "OCV",
    ],
    recruiterNotes: [
      "STA specialists can be difficult to identify from generic ASIC titles.",
      "PrimeTime, Tempus, MCMM and timing closure are useful precision signals.",
    ],
  },

  {
    id: "dft-engineer",
    title: "DFT Engineer",
    normalizedTitle: "DFT Engineer",
    family: "DFT / Test",
    aliases: [
      "Design for Test Engineer",
      "DFT Engineer",
      "DFT Design Engineer",
      "Test Architecture Engineer",
    ],
    skills: [
      "Design for Test",
      "Scan Insertion",
      "ATPG",
      "MBIST",
      "LBIST",
      "Test Compression",
    ],
    technologies: [
      "Tessent",
      "Synopsys DFTMAX",
      "Modus",
      "TestMAX",
    ],
    languages: [
      "Verilog",
      "SystemVerilog",
      "Tcl",
      "Python",
    ],
    methodologies: [
      "Scan",
      "ATPG",
      "MBIST",
      "LBIST",
      "Compression",
      "Fault Coverage",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
      "Memory",
    ],
    relatedRoles: [
      "DFT Architect",
      "Silicon Validation Engineer",
      "Physical Design Engineer",
      "Test Engineer",
    ],
    sourcingSignals: [
      "DFT",
      "ATPG",
      "scan insertion",
      "MBIST",
      "LBIST",
      "Tessent",
      "fault coverage",
    ],
    recruiterNotes: [
      "DFT is a specialized discipline; don't merge it with generic hardware test.",
      "Search both DFT and Design-for-Test terminology.",
    ],
  },

  {
    id: "analog-mixed-signal-engineer",
    title: "Analog / Mixed-Signal Design Engineer",
    normalizedTitle: "Analog / Mixed-Signal Design Engineer",
    family: "Analog / Mixed Signal",
    aliases: [
      "Analog Design Engineer",
      "Mixed Signal Design Engineer",
      "Analog IC Design Engineer",
      "AMS Design Engineer",
    ],
    skills: [
      "Analog Circuit Design",
      "Mixed-Signal Design",
      "Transistor-Level Design",
      "PLL",
      "ADC",
      "DAC",
    ],
    technologies: [
      "Cadence Virtuoso",
      "Spectre",
      "HSPICE",
      "Calibre",
    ],
    languages: [
      "Verilog-A",
      "Verilog-AMS",
      "SKILL",
    ],
    methodologies: [
      "Circuit Simulation",
      "Corner Analysis",
      "Monte Carlo",
      "Layout-aware Simulation",
    ],
    platforms: [
      "Analog IC",
      "Mixed Signal",
      "SoC",
      "SerDes",
      "Power Management IC",
    ],
    relatedRoles: [
      "Analog Layout Engineer",
      "Physical Verification Engineer",
      "Silicon Validation Engineer",
    ],
    sourcingSignals: [
      "analog IC",
      "mixed signal",
      "Cadence Virtuoso",
      "Spectre",
      "PLL",
      "ADC",
      "DAC",
      "transistor-level",
    ],
    recruiterNotes: [
      "Look for circuit-level ownership rather than board-level analog hardware experience.",
      "PLL, ADC, DAC, SerDes and transistor-level design are strong specialization signals.",
    ],
  },

  {
    id: "fpga-engineer",
    title: "FPGA Engineer",
    normalizedTitle: "FPGA Engineer",
    family: "FPGA",
    aliases: [
      "FPGA Design Engineer",
      "FPGA Developer",
      "FPGA Hardware Engineer",
      "FPGA RTL Engineer",
    ],
    skills: [
      "FPGA Design",
      "RTL",
      "Digital Logic",
      "High-Speed Interfaces",
      "Timing Closure",
      "Hardware Debugging",
    ],
    technologies: [
      "Vivado",
      "Vitis",
      "Quartus",
      "ModelSim",
      "SystemVerilog",
      "Verilog",
    ],
    languages: [
      "SystemVerilog",
      "Verilog",
      "VHDL",
      "C++",
      "Python",
    ],
    methodologies: [
      "RTL Design",
      "Synthesis",
      "Place and Route",
      "Timing Closure",
      "Hardware-in-the-Loop",
    ],
    platforms: [
      "AMD/Xilinx FPGA",
      "Intel FPGA",
      "Versal",
      "Altera",
      "Zynq",
    ],
    relatedRoles: [
      "RTL Design Engineer",
      "ASIC Design Engineer",
      "FPGA Verification Engineer",
      "Embedded Engineer",
    ],
    sourcingSignals: [
      "FPGA",
      "Vivado",
      "Vitis",
      "Quartus",
      "SystemVerilog",
      "Verilog",
      "timing closure",
    ],
    recruiterNotes: [
      "FPGA candidates can be relevant for ASIC roles when they have strong RTL ownership.",
      "Check whether the candidate's work is primarily FPGA integration or reusable RTL architecture.",
    ],
  },

  {
    id: "soc-architect",
    title: "SoC Architect",
    normalizedTitle: "SoC Architect",
    family: "SoC / Architecture",
    aliases: [
      "SoC Architect",
      "System-on-Chip Architect",
      "Silicon Architect",
      "Chip Architect",
      "Platform Architect",
    ],
    skills: [
      "SoC Architecture",
      "Microarchitecture",
      "CPU Architecture",
      "Memory Systems",
      "Interconnect Architecture",
      "Performance Modeling",
    ],
    technologies: [
      "AMBA",
      "AXI",
      "ACE",
      "CHI",
      "SystemVerilog",
    ],
    languages: [
      "SystemVerilog",
      "C++",
      "Python",
    ],
    methodologies: [
      "Architecture Modeling",
      "Performance Modeling",
      "Power Modeling",
      "Microarchitecture",
    ],
    platforms: [
      "CPU",
      "GPU",
      "NPU",
      "AI Accelerator",
      "Networking SoC",
    ],
    relatedRoles: [
      "RTL Design Engineer",
      "CPU Architect",
      "Silicon Engineer",
      "Performance Architect",
    ],
    sourcingSignals: [
      "SoC architecture",
      "microarchitecture",
      "AMBA",
      "AXI",
      "CHI",
      "interconnect",
      "performance modeling",
    ],
    recruiterNotes: [
      "Architecture candidates often have broad cross-functional exposure rather than one narrow implementation skill.",
      "Look for evidence of architecture ownership and technical trade-off decisions.",
    ],
  },

  {
    id: "silicon-validation-engineer",
    title: "Silicon Validation Engineer",
    normalizedTitle: "Silicon Validation Engineer",
    family: "Silicon Validation",
    aliases: [
      "Silicon Validation Engineer",
      "Silicon Validation",
      "Post-Silicon Validation Engineer",
      "Silicon Debug Engineer",
    ],
    skills: [
      "Silicon Validation",
      "Post-Silicon Debug",
      "Board Bring-up",
      "Failure Analysis",
      "Performance Validation",
      "System Debugging",
    ],
    technologies: [
      "JTAG",
      "Python",
      "C",
      "C++",
      "Oscilloscope",
      "Logic Analyzer",
    ],
    languages: [
      "Python",
      "C",
      "C++",
    ],
    methodologies: [
      "Post-Silicon Validation",
      "Board Bring-up",
      "Failure Analysis",
      "Performance Characterization",
    ],
    platforms: [
      "CPU",
      "GPU",
      "SoC",
      "ASIC",
      "AI Accelerator",
    ],
    relatedRoles: [
      "Post-Silicon Engineer",
      "Hardware Validation Engineer",
      "Firmware Engineer",
      "DFT Engineer",
    ],
    sourcingSignals: [
      "silicon validation",
      "post-silicon",
      "silicon debug",
      "JTAG",
      "board bring-up",
      "failure analysis",
    ],
    recruiterNotes: [
      "Post-silicon candidates often bridge silicon, firmware and system teams.",
      "Look for actual chip bring-up and silicon debug rather than generic hardware validation.",
    ],
  },

  {
    id: "post-silicon-engineer",
    title: "Post-Silicon Engineer",
    normalizedTitle: "Post-Silicon Engineer",
    family: "Post-Silicon",
    aliases: [
      "Post-Silicon Validation Engineer",
      "Post Silicon Engineer",
      "Silicon Debug Engineer",
      "Silicon Bring-up Engineer",
    ],
    skills: [
      "Post-Silicon Debug",
      "Silicon Bring-up",
      "Failure Analysis",
      "Hardware Debugging",
      "Firmware Debugging",
    ],
    technologies: [
      "JTAG",
      "Oscilloscope",
      "Logic Analyzer",
      "Python",
      "C",
      "C++",
    ],
    languages: [
      "Python",
      "C",
      "C++",
    ],
    methodologies: [
      "Silicon Bring-up",
      "Root Cause Analysis",
      "Failure Analysis",
      "Characterization",
    ],
    platforms: [
      "ASIC",
      "SoC",
      "CPU",
      "GPU",
      "AI Accelerator",
    ],
    relatedRoles: [
      "Silicon Validation Engineer",
      "Hardware Validation Engineer",
      "Firmware Engineer",
      "DFT Engineer",
    ],
    sourcingSignals: [
      "post-silicon",
      "silicon bring-up",
      "silicon debug",
      "JTAG",
      "failure analysis",
    ],
    recruiterNotes: [
      "Post-silicon is particularly valuable for candidates who have supported first silicon.",
      "Look for evidence of lab debugging and root-cause ownership.",
    ],
  },

  {
    id: "eda-engineer",
    title: "EDA / CAD Engineer",
    normalizedTitle: "EDA / CAD Engineer",
    family: "EDA / CAD",
    aliases: [
      "EDA Engineer",
      "CAD Engineer",
      "EDA Software Engineer",
      "Design Automation Engineer",
    ],
    skills: [
      "EDA Development",
      "Design Automation",
      "Algorithms",
      "CAD Infrastructure",
      "Physical Design Automation",
    ],
    technologies: [
      "C++",
      "Python",
      "Tcl",
      "Cadence",
      "Synopsys",
      "Siemens EDA",
    ],
    languages: [
      "C++",
      "Python",
      "Tcl",
      "Perl",
    ],
    methodologies: [
      "Design Automation",
      "Optimization",
      "Physical Design",
      "Logic Synthesis",
    ],
    platforms: [
      "EDA",
      "ASIC",
      "SoC",
      "FPGA",
    ],
    relatedRoles: [
      "Physical Design Engineer",
      "CAD Engineer",
      "RTL Design Engineer",
      "Design Automation Engineer",
    ],
    sourcingSignals: [
      "EDA",
      "CAD",
      "design automation",
      "C++",
      "Python",
      "physical design",
      "synthesis",
    ],
    recruiterNotes: [
      "EDA engineers may come from algorithms, compilers or systems backgrounds.",
      "Don't limit sourcing to candidates whose title contains EDA.",
    ],
  },
];

export const semiconductorSkills: SemiconductorSkill[] = [
  {
    id: "rtl-design",
    name: "RTL Design",
    category: "Digital Design",
    relatedRoles: [
      "RTL Design Engineer",
      "ASIC Design Engineer",
      "FPGA Engineer",
    ],
    relatedTechnologies: [
      "SystemVerilog",
      "Verilog",
      "VHDL",
      "Synthesis",
    ],
    description:
      "Register-transfer-level design used to describe digital hardware behavior and structure.",
  },
  {
    id: "microarchitecture",
    name: "Microarchitecture",
    category: "Architecture",
    relatedRoles: [
      "RTL Design Engineer",
      "ASIC Design Engineer",
      "SoC Architect",
    ],
    relatedTechnologies: [
      "SystemVerilog",
      "AMBA",
      "AXI",
      "CHI",
    ],
    description:
      "Design of the internal organization and behavior of processors, accelerators and SoCs.",
  },
  {
    id: "functional-verification",
    name: "Functional Verification",
    category: "Verification",
    relatedRoles: [
      "Design Verification Engineer",
      "Formal Verification Engineer",
    ],
    relatedTechnologies: [
      "SystemVerilog",
      "UVM",
      "VCS",
      "Questa",
      "Xcelium",
    ],
    description:
      "Verification of RTL functionality against specifications before silicon fabrication.",
  },
  {
    id: "formal-verification",
    name: "Formal Verification",
    category: "Verification",
    relatedRoles: [
      "Formal Verification Engineer",
      "Design Verification Engineer",
    ],
    relatedTechnologies: [
      "SVA",
      "JasperGold",
      "VC Formal",
      "Questa Formal",
    ],
    description:
      "Mathematical and property-based verification techniques for proving hardware behavior.",
  },
  {
    id: "physical-design",
    name: "Physical Design",
    category: "Physical Design",
    relatedRoles: [
      "Physical Design Engineer",
      "STA Engineer",
      "Physical Verification Engineer",
    ],
    relatedTechnologies: [
      "Innovus",
      "ICC2",
      "Fusion Compiler",
      "PrimeTime",
    ],
    description:
      "Transformation of synthesized logic into a physical chip implementation.",
  },
  {
    id: "timing-closure",
    name: "Timing Closure",
    category: "Timing",
    relatedRoles: [
      "STA Engineer",
      "Physical Design Engineer",
      "RTL Design Engineer",
    ],
    relatedTechnologies: [
      "PrimeTime",
      "Tempus",
      "Innovus",
      "ICC2",
    ],
    description:
      "Achieving required setup, hold and performance timing targets before signoff.",
  },
  {
    id: "dft",
    name: "Design for Test",
    category: "DFT",
    relatedRoles: [
      "DFT Engineer",
      "Silicon Validation Engineer",
    ],
    relatedTechnologies: [
      "Tessent",
      "DFTMAX",
      "Modus",
      "TestMAX",
    ],
    description:
      "Design techniques that improve manufacturing testability and fault coverage.",
  },
  {
    id: "analog-design",
    name: "Analog IC Design",
    category: "Analog",
    relatedRoles: [
      "Analog / Mixed-Signal Design Engineer",
      "Physical Verification Engineer",
    ],
    relatedTechnologies: [
      "Cadence Virtuoso",
      "Spectre",
      "HSPICE",
    ],
    description:
      "Transistor-level design of analog circuits and mixed-signal blocks.",
  },
  {
    id: "fpga-design",
    name: "FPGA Design",
    category: "FPGA",
    relatedRoles: [
      "FPGA Engineer",
      "RTL Design Engineer",
    ],
    relatedTechnologies: [
      "Vivado",
      "Quartus",
      "SystemVerilog",
      "Verilog",
    ],
    description:
      "Digital hardware design implemented on programmable logic devices.",
  },
  {
    id: "silicon-validation",
    name: "Silicon Validation",
    category: "Validation",
    relatedRoles: [
      "Silicon Validation Engineer",
      "Post-Silicon Engineer",
    ],
    relatedTechnologies: [
      "JTAG",
      "Python",
      "C",
      "C++",
    ],
    description:
      "Validation and debugging of fabricated silicon in laboratory and system environments.",
  },
  {
    id: "power-performance",
    name: "Power / Performance Optimization",
    category: "Power",
    relatedRoles: [
      "SoC Architect",
      "RTL Design Engineer",
      "Physical Design Engineer",
    ],
    relatedTechnologies: [
      "Power Analysis",
      "PrimeTime",
      "UPF",
    ],
    description:
      "Optimization of power consumption and performance across the chip design lifecycle.",
  },
];

export const semiconductorTechnologies: SemiconductorTechnology[] = [
  {
    id: "systemverilog",
    name: "SystemVerilog",
    category: "HDL",
    relatedSkills: [
      "RTL Design",
      "Functional Verification",
      "Formal Verification",
    ],
    relatedRoles: [
      "RTL Design Engineer",
      "Design Verification Engineer",
      "ASIC Design Engineer",
    ],
    description:
      "Hardware description and verification language widely used in modern ASIC and SoC development.",
  },
  {
    id: "verilog",
    name: "Verilog",
    category: "HDL",
    relatedSkills: [
      "RTL Design",
      "FPGA Design",
    ],
    relatedRoles: [
      "RTL Design Engineer",
      "FPGA Engineer",
    ],
    description:
      "Hardware description language used for digital design and verification.",
  },
  {
    id: "uvm",
    name: "UVM",
    category: "Verification",
    relatedSkills: [
      "Functional Verification",
    ],
    relatedRoles: [
      "Design Verification Engineer",
    ],
    description:
      "Standardized SystemVerilog verification methodology used for reusable verification environments.",
  },
  {
    id: "vcs",
    name: "Synopsys VCS",
    category: "Simulation",
    relatedSkills: [
      "Functional Verification",
    ],
    relatedRoles: [
      "Design Verification Engineer",
    ],
    description:
      "Simulation and verification platform used extensively in ASIC development.",
  },
  {
    id: "questa",
    name: "Questa",
    category: "Simulation",
    relatedSkills: [
      "Functional Verification",
      "Formal Verification",
    ],
    relatedRoles: [
      "Design Verification Engineer",
      "Formal Verification Engineer",
    ],
    description:
      "Simulation and verification environment used for digital hardware development.",
  },
  {
    id: "innovus",
    name: "Cadence Innovus",
    category: "Physical Design",
    relatedSkills: [
      "Physical Design",
      "Timing Closure",
    ],
    relatedRoles: [
      "Physical Design Engineer",
    ],
    description:
      "Digital implementation platform for placement, optimization and routing.",
  },
  {
    id: "icc2",
    name: "Synopsys ICC2",
    category: "Physical Design",
    relatedSkills: [
      "Physical Design",
    ],
    relatedRoles: [
      "Physical Design Engineer",
    ],
    description:
      "Digital implementation platform used for physical design workflows.",
  },
  {
    id: "primetime",
    name: "Synopsys PrimeTime",
    category: "Timing",
    relatedSkills: [
      "Static Timing Analysis",
      "Timing Closure",
    ],
    relatedRoles: [
      "STA Engineer",
      "Physical Design Engineer",
    ],
    description:
      "Static timing analysis platform used for signoff timing analysis.",
  },
  {
    id: "tempus",
    name: "Cadence Tempus",
    category: "Timing",
    relatedSkills: [
      "Static Timing Analysis",
      "Timing Closure",
    ],
    relatedRoles: [
      "STA Engineer",
      "Physical Design Engineer",
    ],
    description:
      "Timing signoff technology used for static timing analysis.",
  },
  {
    id: "tessent",
    name: "Siemens Tessent",
    category: "DFT",
    relatedSkills: [
      "Design for Test",
    ],
    relatedRoles: [
      "DFT Engineer",
    ],
    description:
      "DFT and manufacturing-test platform used for scan, ATPG and related workflows.",
  },
  {
    id: "cadence-virtuoso",
    name: "Cadence Virtuoso",
    category: "EDA",
    relatedSkills: [
      "Analog IC Design",
    ],
    relatedRoles: [
      "Analog / Mixed-Signal Design Engineer",
    ],
    description:
      "Analog and custom IC design environment.",
  },
  {
    id: "spectre",
    name: "Cadence Spectre",
    category: "Simulation",
    relatedSkills: [
      "Analog IC Design",
    ],
    relatedRoles: [
      "Analog / Mixed-Signal Design Engineer",
    ],
    description:
      "Circuit simulation technology used for analog and mixed-signal design.",
  },
  {
    id: "vivado",
    name: "AMD Vivado",
    category: "FPGA",
    relatedSkills: [
      "FPGA Design",
    ],
    relatedRoles: [
      "FPGA Engineer",
    ],
    description:
      "FPGA development environment used for synthesis, implementation and hardware debugging.",
  },
  {
    id: "quartus",
    name: "Intel Quartus",
    category: "FPGA",
    relatedSkills: [
      "FPGA Design",
    ],
    relatedRoles: [
      "FPGA Engineer",
    ],
    description:
      "FPGA development environment for Intel FPGA platforms.",
  },
  {
    id: "amba",
    name: "AMBA",
    category: "Interconnect",
    relatedSkills: [
      "SoC Architecture",
      "Microarchitecture",
    ],
    relatedRoles: [
      "SoC Architect",
      "RTL Design Engineer",
    ],
    description:
      "Interconnect and interface architecture family widely used in SoC design.",
  },
];

export const semiconductorResearchLandscape: SemiconductorResearchLandscape = {
  conferences: [
    "ISSCC",
    "IEDM",
    "DAC",
    "ICCAD",
    "DATE",
    "ISCA",
    "MICRO",
    "HPCA",
    "Hot Chips",
    "VLSI Symposium",
    "FPGA",
  ],

  journals: [
    "IEEE Journal of Solid-State Circuits",
    "IEEE Transactions on VLSI Systems",
    "IEEE Transactions on Computer-Aided Design",
    "ACM Transactions on Design Automation of Electronic Systems",
    "IEEE Transactions on Computers",
  ],

  researchSources: [
    "IEEE Xplore",
    "ACM Digital Library",
    "Google Scholar",
    "arXiv",
    "DBLP",
    "Google Patents",
    "Semantic Scholar",
  ],

  researchLabs: [
    "MIT CSAIL",
    "Stanford",
    "UC Berkeley",
    "Carnegie Mellon",
    "University of Michigan",
    "Georgia Tech",
    "ETH Zurich",
  ],

  researchAreas: [
    "Computer Architecture",
    "VLSI Design",
    "ASIC Design",
    "Hardware Accelerators",
    "AI Accelerators",
    "Chiplet Architecture",
    "Advanced Packaging",
    "Low-Power Design",
    "Design Automation",
    "Formal Verification",
    "Hardware Security",
    "High-Speed Interconnects",
  ],

  publicationSignals: [
    "ISSCC publications",
    "IEDM publications",
    "DAC papers",
    "ICCAD papers",
    "ISCA papers",
    "MICRO papers",
    "HPCA papers",
    "VLSI Symposium papers",
  ],

  patentSignals: [
    "ASIC architecture patents",
    "CPU architecture patents",
    "GPU architecture patents",
    "AI accelerator patents",
    "Chiplet patents",
    "Interconnect patents",
    "Low-power semiconductor patents",
  ],

  openSourceSignals: [
    "RISC-V contributions",
    "OpenTitan contributions",
    "Chisel projects",
    "Cocotb projects",
    "Verilator projects",
    "Yosys contributions",
    "OpenROAD contributions",
  ],
};

export const semiconductorBooleanLibrary: SemiconductorBooleanLibrary[] = [
  {
    id: "rtl-design",
    name: "RTL / ASIC Design",
    category: "Role",
    useCase:
      "Find front-end ASIC and RTL engineers with SystemVerilog or Verilog experience.",
    query:
      '("RTL Engineer" OR "RTL Design Engineer" OR "ASIC Design Engineer" OR "Digital Design Engineer") AND (SystemVerilog OR Verilog) AND (ASIC OR SoC) AND (synthesis OR microarchitecture)',
  },
  {
    id: "design-verification",
    name: "Design Verification",
    category: "Role",
    useCase:
      "Find ASIC and SoC verification engineers with UVM and SystemVerilog.",
    query:
      '("Design Verification Engineer" OR "DV Engineer" OR "ASIC Verification Engineer" OR "SoC Verification Engineer") AND (SystemVerilog OR UVM) AND (coverage OR assertions OR testbench)',
  },
  {
    id: "physical-design",
    name: "Physical Design",
    category: "Role",
    useCase:
      "Find backend ASIC engineers with place-and-route and timing closure experience.",
    query:
      '("Physical Design Engineer" OR "Backend Design Engineer" OR "Place and Route Engineer") AND (Innovus OR ICC2 OR "Fusion Compiler") AND ("timing closure" OR CTS OR routing)',
  },
  {
    id: "sta",
    name: "Static Timing Analysis",
    category: "Role",
    useCase:
      "Find dedicated STA and timing-closure specialists.",
    query:
      '("STA Engineer" OR "Static Timing Engineer" OR "Timing Engineer" OR "Timing Closure Engineer") AND (PrimeTime OR Tempus) AND ("static timing analysis" OR "timing closure")',
  },
  {
    id: "dft",
    name: "DFT",
    category: "Role",
    useCase:
      "Find Design-for-Test specialists with ATPG, scan or memory-test experience.",
    query:
      '("DFT Engineer" OR "Design for Test Engineer" OR "DFT Design Engineer") AND (ATPG OR "scan insertion" OR MBIST OR LBIST) AND (Tessent OR Modus OR DFTMAX OR TestMAX)',
  },
  {
    id: "analog",
    name: "Analog / Mixed Signal",
    category: "Role",
    useCase:
      "Find analog and mixed-signal IC designers.",
    query:
      '("Analog Design Engineer" OR "Analog IC Design Engineer" OR "Mixed Signal Design Engineer" OR "AMS Design Engineer") AND ("Cadence Virtuoso" OR Spectre OR HSPICE) AND (PLL OR ADC OR DAC OR "mixed signal")',
  },
  {
    id: "fpga",
    name: "FPGA",
    category: "Role",
    useCase:
      "Find FPGA engineers with RTL and timing-closure experience.",
    query:
      '("FPGA Engineer" OR "FPGA Design Engineer" OR "FPGA Developer" OR "FPGA RTL Engineer") AND (Vivado OR Quartus) AND (SystemVerilog OR Verilog OR VHDL) AND ("timing closure" OR synthesis)',
  },
  {
    id: "silicon-validation",
    name: "Silicon Validation",
    category: "Role",
    useCase:
      "Find engineers who have validated and debugged fabricated silicon.",
    query:
      '("Silicon Validation Engineer" OR "Post-Silicon Engineer" OR "Silicon Debug Engineer") AND ("silicon validation" OR "post-silicon" OR "silicon bring-up") AND (JTAG OR Python OR C OR C++)',
  },
  {
    id: "soc-architecture",
    name: "SoC Architecture",
    category: "Role",
    useCase:
      "Find SoC and chip architects with microarchitecture and interconnect experience.",
    query:
      '("SoC Architect" OR "Silicon Architect" OR "Chip Architect" OR "Platform Architect") AND (microarchitecture OR "SoC architecture") AND (AMBA OR AXI OR CHI OR interconnect)',
  },
];

export const semiconductorDomain: SemiconductorDomain = {
  domain: "Semiconductor",

  roles: semiconductorRoles,

  skills: semiconductorSkills,

  technologies: semiconductorTechnologies,

  researchLandscape: semiconductorResearchLandscape,

  booleanLibrary: semiconductorBooleanLibrary,

  conferences: semiconductorResearchLandscape.conferences,

  researchSources: semiconductorResearchLandscape.researchSources,
};