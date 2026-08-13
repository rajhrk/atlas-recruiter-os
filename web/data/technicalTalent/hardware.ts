import type {
  HardwareBooleanLibrary,
  HardwareDomain,
  HardwareResearchLandscape,
  HardwareRole,
  HardwareSkill,
  HardwareTechnology,
} from "@/types/hardware";

export const hardwareRoles: HardwareRole[] = [
  {
    id: "embedded-engineer",
    title: "Embedded Engineer",
    normalizedTitle: "Embedded Engineer",
    family: "Embedded Systems",
    aliases: [
      "Embedded Software Engineer",
      "Embedded Systems Engineer",
      "Embedded Developer",
      "Embedded Software Developer",
    ],
    skills: [
      "Embedded C/C++",
      "Embedded Systems",
      "Microcontrollers",
      "RTOS",
      "Hardware Debugging",
      "Board Bring-up",
    ],
    technologies: [
      "C",
      "C++",
      "FreeRTOS",
      "Zephyr",
      "ARM",
      "JTAG",
      "GDB",
    ],
    protocols: [
      "I2C",
      "SPI",
      "UART",
      "CAN",
      "USB",
    ],
    platforms: [
      "ARM Cortex-M",
      "STM32",
      "NXP",
      "TI",
    ],
    relatedRoles: [
      "Firmware Engineer",
      "BSP Engineer",
      "Device Driver Engineer",
      "Embedded Linux Engineer",
    ],
    sourcingSignals: [
      "Embedded C/C++",
      "RTOS",
      "ARM Cortex-M",
      "STM32",
      "FreeRTOS",
      "Zephyr",
      "JTAG",
      "GDB",
    ],
    recruiterNotes: [
      "Look beyond the exact title Embedded Engineer; many candidates use Embedded Software Engineer or Firmware Engineer.",
      "Strong candidates often show board bring-up, debugging, RTOS and hardware-interface experience.",
    ],
  },

  {
    id: "firmware-engineer",
    title: "Firmware Engineer",
    normalizedTitle: "Firmware Engineer",
    family: "Firmware",
    aliases: [
      "Firmware Developer",
      "Embedded Firmware Engineer",
      "Firmware Software Engineer",
      "Senior Firmware Engineer",
    ],
    skills: [
      "Firmware Development",
      "Embedded C/C++",
      "RTOS",
      "Low-level Programming",
      "Hardware Debugging",
      "Board Bring-up",
    ],
    technologies: [
      "C",
      "C++",
      "FreeRTOS",
      "Zephyr",
      "ARM",
      "JTAG",
      "GDB",
    ],
    protocols: [
      "I2C",
      "SPI",
      "UART",
      "CAN",
      "USB",
      "Ethernet",
    ],
    platforms: [
      "ARM Cortex-M",
      "STM32",
      "NXP",
      "TI",
      "ESP32",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "BSP Engineer",
      "Device Driver Engineer",
      "Embedded Linux Engineer",
    ],
    sourcingSignals: [
      "Firmware",
      "Embedded C",
      "RTOS",
      "ARM",
      "FreeRTOS",
      "Zephyr",
      "JTAG",
      "BSP",
    ],
    recruiterNotes: [
      "Firmware candidates frequently overlap with embedded software and BSP engineering.",
      "Prioritize evidence of direct hardware interaction rather than application-level C++ alone.",
    ],
  },

  {
    id: "embedded-linux-engineer",
    title: "Embedded Linux Engineer",
    normalizedTitle: "Embedded Linux Engineer",
    family: "Embedded Linux",
    aliases: [
      "Embedded Linux Developer",
      "Linux Embedded Engineer",
      "Embedded Systems Linux Engineer",
      "Linux Firmware Engineer",
    ],
    skills: [
      "Embedded Linux",
      "Linux Kernel",
      "Device Drivers",
      "BSP",
      "Bootloaders",
      "System Programming",
    ],
    technologies: [
      "Linux",
      "Yocto",
      "Buildroot",
      "U-Boot",
      "C",
      "C++",
      "Git",
    ],
    protocols: [
      "I2C",
      "SPI",
      "UART",
      "CAN",
      "Ethernet",
    ],
    platforms: [
      "ARM",
      "NVIDIA Jetson",
      "NXP",
      "TI",
    ],
    relatedRoles: [
      "BSP Engineer",
      "Device Driver Engineer",
      "Firmware Engineer",
      "Embedded Engineer",
    ],
    sourcingSignals: [
      "Embedded Linux",
      "Yocto",
      "Buildroot",
      "U-Boot",
      "Linux Kernel",
      "BSP",
      "Device Drivers",
    ],
    recruiterNotes: [
      "Yocto and BSP experience are strong signals for production embedded Linux work.",
      "Distinguish embedded Linux candidates from general Linux application engineers.",
    ],
  },

  {
    id: "bsp-engineer",
    title: "BSP Engineer",
    normalizedTitle: "BSP Engineer",
    family: "BSP / Device Drivers",
    aliases: [
      "Board Support Package Engineer",
      "BSP Software Engineer",
      "Embedded BSP Engineer",
      "Platform Software Engineer",
    ],
    skills: [
      "BSP Development",
      "Bootloaders",
      "Device Drivers",
      "Embedded Linux",
      "Kernel Development",
      "Board Bring-up",
    ],
    technologies: [
      "Linux",
      "Yocto",
      "U-Boot",
      "C",
      "C++",
      "Git",
    ],
    protocols: [
      "I2C",
      "SPI",
      "UART",
      "CAN",
      "PCIe",
      "Ethernet",
    ],
    platforms: [
      "ARM",
      "NXP",
      "TI",
      "Qualcomm",
      "NVIDIA",
    ],
    relatedRoles: [
      "Embedded Linux Engineer",
      "Device Driver Engineer",
      "Firmware Engineer",
      "Embedded Engineer",
    ],
    sourcingSignals: [
      "BSP",
      "Board Bring-up",
      "U-Boot",
      "Yocto",
      "Device Drivers",
      "Linux Kernel",
    ],
    recruiterNotes: [
      "BSP experience is particularly valuable for new hardware platform launches.",
      "Search for platform software, board support and bootloader terminology in addition to BSP.",
    ],
  },

  {
    id: "device-driver-engineer",
    title: "Device Driver Engineer",
    normalizedTitle: "Device Driver Engineer",
    family: "BSP / Device Drivers",
    aliases: [
      "Linux Device Driver Engineer",
      "Kernel Driver Engineer",
      "Device Driver Developer",
      "Kernel Engineer",
    ],
    skills: [
      "Device Drivers",
      "Linux Kernel",
      "Kernel Programming",
      "System Programming",
      "Hardware Interfaces",
      "Debugging",
    ],
    technologies: [
      "C",
      "Linux",
      "Linux Kernel",
      "Git",
      "GDB",
    ],
    protocols: [
      "I2C",
      "SPI",
      "USB",
      "PCIe",
      "UART",
      "CAN",
    ],
    platforms: [
      "ARM",
      "x86",
      "NVIDIA",
      "Qualcomm",
      "NXP",
    ],
    relatedRoles: [
      "BSP Engineer",
      "Embedded Linux Engineer",
      "Firmware Engineer",
      "Embedded Engineer",
    ],
    sourcingSignals: [
      "Linux Kernel",
      "Device Drivers",
      "Kernel Programming",
      "I2C",
      "SPI",
      "PCIe",
      "USB",
    ],
    recruiterNotes: [
      "Look for actual kernel or driver ownership rather than generic Linux administration.",
      "Driver engineers often have strong C and hardware-interface experience.",
    ],
  },

  {
    id: "hardware-engineer",
    title: "Hardware Engineer",
    normalizedTitle: "Hardware Engineer",
    family: "Hardware Engineering",
    aliases: [
      "Hardware Design Engineer",
      "Electrical Hardware Engineer",
      "Hardware Development Engineer",
      "Electronics Engineer",
    ],
    skills: [
      "Digital Electronics",
      "Analog Electronics",
      "Circuit Design",
      "PCB Design",
      "Hardware Debugging",
      "Signal Integrity",
    ],
    technologies: [
      "Altium",
      "Cadence",
      "OrCAD",
      "LTspice",
      "Oscilloscope",
      "Logic Analyzer",
    ],
    protocols: [
      "I2C",
      "SPI",
      "UART",
      "CAN",
      "USB",
      "Ethernet",
    ],
    platforms: [
      "ARM",
      "MCU",
      "SoC",
      "FPGA",
    ],
    relatedRoles: [
      "Hardware Systems Engineer",
      "Board Design Engineer",
      "Hardware Validation Engineer",
      "Embedded Engineer",
    ],
    sourcingSignals: [
      "PCB",
      "Circuit Design",
      "Altium",
      "Cadence",
      "Signal Integrity",
      "Hardware Debugging",
      "Oscilloscope",
    ],
    recruiterNotes: [
      "Separate board-level hardware design from semiconductor IC design.",
      "Look for schematic capture, PCB layout, lab debugging and hardware bring-up.",
    ],
  },

  {
    id: "hardware-systems-engineer",
    title: "Hardware Systems Engineer",
    normalizedTitle: "Hardware Systems Engineer",
    family: "Hardware Systems",
    aliases: [
      "Hardware Systems Engineer",
      "Systems Hardware Engineer",
      "Platform Hardware Engineer",
      "Hardware Platform Engineer",
    ],
    skills: [
      "Hardware Architecture",
      "System Integration",
      "Hardware Validation",
      "Interface Design",
      "Power Management",
      "Debugging",
    ],
    technologies: [
      "ARM",
      "SoC",
      "FPGA",
      "PCIe",
      "Ethernet",
      "Oscilloscope",
      "Logic Analyzer",
    ],
    protocols: [
      "PCIe",
      "USB",
      "Ethernet",
      "I2C",
      "SPI",
      "CAN",
    ],
    platforms: [
      "ARM",
      "x86",
      "SoC",
      "FPGA",
    ],
    relatedRoles: [
      "Hardware Engineer",
      "Hardware Validation Engineer",
      "Systems Engineer",
      "Embedded Engineer",
    ],
    sourcingSignals: [
      "Hardware Architecture",
      "System Integration",
      "Platform Hardware",
      "SoC",
      "PCIe",
      "Ethernet",
      "Hardware Validation",
    ],
    recruiterNotes: [
      "Useful target for complex compute, networking, robotics and edge hardware platforms.",
      "Look for candidates who bridge board-level hardware and system-level architecture.",
    ],
  },

  {
    id: "hardware-validation-engineer",
    title: "Hardware Validation Engineer",
    normalizedTitle: "Hardware Validation Engineer",
    family: "Hardware Validation",
    aliases: [
      "Hardware Validation Engineer",
      "Hardware Test Engineer",
      "Platform Validation Engineer",
      "System Validation Engineer",
    ],
    skills: [
      "Hardware Validation",
      "System Validation",
      "Test Automation",
      "Debugging",
      "Failure Analysis",
      "Hardware Bring-up",
    ],
    technologies: [
      "Python",
      "C",
      "C++",
      "Oscilloscope",
      "Logic Analyzer",
      "JTAG",
    ],
    protocols: [
      "PCIe",
      "USB",
      "Ethernet",
      "I2C",
      "SPI",
      "UART",
    ],
    platforms: [
      "ARM",
      "x86",
      "SoC",
      "FPGA",
    ],
    relatedRoles: [
      "Hardware Engineer",
      "Hardware Systems Engineer",
      "Firmware Engineer",
      "Systems Engineer",
    ],
    sourcingSignals: [
      "Hardware Validation",
      "Platform Validation",
      "Hardware Bring-up",
      "Failure Analysis",
      "Test Automation",
      "JTAG",
    ],
    recruiterNotes: [
      "Validation candidates may sit between hardware, firmware and systems organizations.",
      "Python-based test automation combined with lab debugging is a strong signal.",
    ],
  },
];

export const hardwareSkills: HardwareSkill[] = [
  {
    id: "embedded-systems",
    name: "Embedded Systems",
    category: "Embedded",
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
      "Embedded Linux Engineer",
    ],
    relatedTechnologies: [
      "C",
      "C++",
      "ARM",
      "FreeRTOS",
      "Zephyr",
    ],
    description:
      "Development of software and firmware that directly interacts with embedded hardware.",
  },

  {
    id: "firmware-development",
    name: "Firmware Development",
    category: "Firmware",
    relatedRoles: [
      "Firmware Engineer",
      "Embedded Engineer",
      "BSP Engineer",
    ],
    relatedTechnologies: [
      "C",
      "C++",
      "FreeRTOS",
      "Zephyr",
      "ARM",
    ],
    description:
      "Low-level software development responsible for controlling and initializing hardware devices.",
  },

  {
    id: "embedded-linux",
    name: "Embedded Linux",
    category: "Linux",
    relatedRoles: [
      "Embedded Linux Engineer",
      "BSP Engineer",
      "Device Driver Engineer",
    ],
    relatedTechnologies: [
      "Linux",
      "Yocto",
      "Buildroot",
      "U-Boot",
    ],
    description:
      "Linux-based software development for constrained or purpose-built hardware platforms.",
  },

  {
    id: "device-drivers",
    name: "Device Drivers",
    category: "Drivers",
    relatedRoles: [
      "Device Driver Engineer",
      "BSP Engineer",
      "Embedded Linux Engineer",
    ],
    relatedTechnologies: [
      "Linux Kernel",
      "C",
      "I2C",
      "SPI",
      "PCIe",
    ],
    description:
      "Low-level software that enables operating systems and firmware to communicate with hardware devices.",
  },

  {
    id: "board-bring-up",
    name: "Board Bring-up",
    category: "Hardware",
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
      "BSP Engineer",
      "Hardware Engineer",
    ],
    relatedTechnologies: [
      "JTAG",
      "GDB",
      "Oscilloscope",
      "Logic Analyzer",
    ],
    description:
      "Initial hardware and software integration required to bring a new board or platform to life.",
  },

  {
    id: "hardware-debugging",
    name: "Hardware Debugging",
    category: "Validation",
    relatedRoles: [
      "Hardware Engineer",
      "Firmware Engineer",
      "Hardware Validation Engineer",
    ],
    relatedTechnologies: [
      "JTAG",
      "GDB",
      "Oscilloscope",
      "Logic Analyzer",
    ],
    description:
      "Diagnosing hardware, firmware and system-level failures using laboratory and debugging tools.",
  },

  {
    id: "rtos",
    name: "Real-Time Operating Systems",
    category: "Embedded",
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
    ],
    relatedTechnologies: [
      "FreeRTOS",
      "Zephyr",
    ],
    description:
      "Operating-system environments designed for deterministic execution on embedded systems.",
  },

  {
    id: "hardware-system-integration",
    name: "Hardware System Integration",
    category: "Systems",
    relatedRoles: [
      "Hardware Systems Engineer",
      "Hardware Validation Engineer",
    ],
    relatedTechnologies: [
      "ARM",
      "SoC",
      "FPGA",
      "PCIe",
      "Ethernet",
    ],
    description:
      "Integration and validation of hardware components into complete compute or device platforms.",
  },
];

export const hardwareTechnologies: HardwareTechnology[] = [
  {
    id: "c",
    name: "C",
    category: "Language",
    relatedSkills: [
      "Embedded Systems",
      "Firmware Development",
      "Device Drivers",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
      "Device Driver Engineer",
    ],
    description:
      "Core systems programming language used extensively in embedded firmware and low-level software.",
  },

  {
    id: "cpp",
    name: "C++",
    category: "Language",
    relatedSkills: [
      "Embedded Systems",
      "Firmware Development",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
    ],
    description:
      "Systems programming language used for embedded applications and performance-sensitive device software.",
  },

  {
    id: "linux",
    name: "Linux",
    category: "Operating System",
    relatedSkills: [
      "Embedded Linux",
      "Device Drivers",
    ],
    relatedRoles: [
      "Embedded Linux Engineer",
      "BSP Engineer",
      "Device Driver Engineer",
    ],
    description:
      "Operating system platform widely used in embedded compute and edge devices.",
  },

  {
    id: "freertos",
    name: "FreeRTOS",
    category: "RTOS",
    relatedSkills: [
      "Embedded Systems",
      "Firmware Development",
      "RTOS",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
    ],
    description:
      "Real-time operating system commonly used on microcontrollers and embedded devices.",
  },

  {
    id: "zephyr",
    name: "Zephyr",
    category: "RTOS",
    relatedSkills: [
      "Embedded Systems",
      "Firmware Development",
      "RTOS",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
    ],
    description:
      "Open-source RTOS designed for resource-constrained embedded and connected devices.",
  },

  {
    id: "arm",
    name: "ARM",
    category: "Processor",
    relatedSkills: [
      "Embedded Systems",
      "Firmware Development",
      "Board Bring-up",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
      "BSP Engineer",
    ],
    description:
      "Processor architecture widely used across embedded, mobile, automotive and edge computing platforms.",
  },

  {
    id: "yocto",
    name: "Yocto Project",
    category: "Tool",
    relatedSkills: [
      "Embedded Linux",
      "BSP Development",
    ],
    relatedRoles: [
      "Embedded Linux Engineer",
      "BSP Engineer",
    ],
    description:
      "Build framework used to create customized Linux distributions for embedded systems.",
  },

  {
    id: "u-boot",
    name: "U-Boot",
    category: "Tool",
    relatedSkills: [
      "BSP Development",
      "Embedded Linux",
      "Board Bring-up",
    ],
    relatedRoles: [
      "BSP Engineer",
      "Embedded Linux Engineer",
    ],
    description:
      "Bootloader commonly used to initialize embedded platforms before launching an operating system.",
  },

  {
    id: "jtag",
    name: "JTAG",
    category: "Debugging",
    relatedSkills: [
      "Hardware Debugging",
      "Board Bring-up",
    ],
    relatedRoles: [
      "Embedded Engineer",
      "Firmware Engineer",
      "Hardware Validation Engineer",
    ],
    description:
      "Hardware interface used for testing, programming and low-level debugging.",
  },

  {
    id: "gdb",
    name: "GDB",
    category: "Debugging",
    relatedSkills: [
      "Hardware Debugging",
      "Firmware Development",
    ],
    relatedRoles: [
      "Firmware Engineer",
      "Embedded Engineer",
    ],
    description:
      "Debugger commonly used for low-level C and C++ development.",
  },

  {
    id: "altium",
    name: "Altium Designer",
    category: "EDA",
    relatedSkills: [
      "Hardware Design",
      "PCB Design",
    ],
    relatedRoles: [
      "Hardware Engineer",
      "Board Design Engineer",
    ],
    description:
      "EDA platform used for schematic capture and PCB design.",
  },

  {
    id: "cadence",
    name: "Cadence",
    category: "EDA",
    relatedSkills: [
      "Hardware Design",
      "Circuit Design",
    ],
    relatedRoles: [
      "Hardware Engineer",
      "Hardware Systems Engineer",
    ],
    description:
      "Electronic design automation tooling used across hardware and semiconductor engineering workflows.",
  },
];

export const hardwareResearchLandscape: HardwareResearchLandscape = {
  conferences: [
    "Embedded Systems Conference",
    "Embedded World",
    "Design Automation Conference",
    "IEEE ICCAD",
    "IEEE DATE",
    "DAC",
  ],

  journals: [
    "IEEE Embedded Systems Letters",
    "IEEE Transactions on Computer-Aided Design",
    "IEEE Transactions on Computers",
    "ACM Transactions on Embedded Computing Systems",
  ],

  researchSources: [
    "IEEE Xplore",
    "ACM Digital Library",
    "arXiv",
    "Google Scholar",
    "USENIX",
  ],

  researchLabs: [
    "MIT CSAIL",
    "UC Berkeley",
    "Stanford",
    "Carnegie Mellon",
    "ETH Zurich",
  ],

  researchAreas: [
    "Embedded Systems",
    "Computer Architecture",
    "Real-Time Systems",
    "Edge Computing",
    "Embedded AI",
    "Hardware-Software Co-Design",
    "Low-Power Computing",
    "Computer Systems",
  ],

  publicationSignals: [
    "Embedded systems publications",
    "Computer architecture papers",
    "RTOS research",
    "Hardware-software co-design papers",
    "Edge AI publications",
  ],

  patentSignals: [
    "Embedded device patents",
    "Hardware architecture patents",
    "Low-power computing patents",
    "System integration patents",
  ],

  openSourceSignals: [
    "Zephyr contributions",
    "Linux kernel contributions",
    "U-Boot contributions",
    "FreeRTOS projects",
    "Embedded GitHub repositories",
  ],
};

export const hardwareBooleanLibrary: HardwareBooleanLibrary[] = [
  {
    id: "embedded-engineer",
    name: "Embedded Engineer",
    category: "Role",
    useCase:
      "Find embedded engineers working on firmware, microcontrollers and RTOS platforms.",
    query:
      '("Embedded Engineer" OR "Embedded Software Engineer" OR "Embedded Systems Engineer") AND (C OR C++) AND (RTOS OR FreeRTOS OR Zephyr) AND (ARM OR STM32 OR NXP)',
  },

  {
    id: "firmware-engineer",
    name: "Firmware Engineer",
    category: "Role",
    useCase:
      "Find firmware engineers with direct low-level hardware experience.",
    query:
      '("Firmware Engineer" OR "Firmware Developer" OR "Embedded Firmware Engineer") AND ("Embedded C" OR C OR C++) AND (firmware OR RTOS) AND (ARM OR MCU OR microcontroller)',
  },

  {
    id: "embedded-linux",
    name: "Embedded Linux",
    category: "Role",
    useCase:
      "Find embedded Linux engineers with BSP, Yocto or kernel experience.",
    query:
      '("Embedded Linux" OR "Embedded Linux Engineer" OR "Linux Embedded Engineer") AND (Yocto OR Buildroot OR U-Boot OR "Linux Kernel") AND (BSP OR "device driver" OR "board bring-up")',
  },

  {
    id: "bsp-engineer",
    name: "BSP / Platform Software",
    category: "Role",
    useCase:
      "Find engineers working on board support packages and platform software.",
    query:
      '("BSP Engineer" OR "Board Support Package" OR "Platform Software Engineer") AND (Yocto OR U-Boot OR "Linux Kernel") AND (ARM OR NXP OR Qualcomm OR NVIDIA)',
  },

  {
    id: "device-driver",
    name: "Device Driver Engineer",
    category: "Role",
    useCase:
      "Find Linux kernel and hardware device driver specialists.",
    query:
      '("Device Driver Engineer" OR "Linux Device Driver" OR "Kernel Engineer") AND ("Linux Kernel" OR "kernel programming") AND (C OR C++) AND (I2C OR SPI OR PCIe OR USB)',
  },

  {
    id: "hardware-engineer",
    name: "Hardware Engineer",
    category: "Role",
    useCase:
      "Find board-level hardware engineers with schematic, PCB and lab experience.",
    query:
      '("Hardware Engineer" OR "Hardware Design Engineer" OR "Electrical Hardware Engineer") AND ("PCB" OR "circuit design" OR schematic) AND (Altium OR Cadence OR OrCAD)',
  },

  {
    id: "hardware-validation",
    name: "Hardware Validation",
    category: "Role",
    useCase:
      "Find engineers responsible for hardware bring-up, validation and failure analysis.",
    query:
      '("Hardware Validation Engineer" OR "Hardware Test Engineer" OR "Platform Validation Engineer") AND ("hardware validation" OR "hardware bring-up") AND (Python OR C OR C++) AND (JTAG OR oscilloscope OR "logic analyzer")',
  },
];

export const hardwareDomain: HardwareDomain = {
  domain: "Hardware / Embedded",

  roles: hardwareRoles,

  skills: hardwareSkills,

  technologies: hardwareTechnologies,

  researchLandscape: hardwareResearchLandscape,

  booleanLibrary: hardwareBooleanLibrary,

  conferences: hardwareResearchLandscape.conferences,

  researchSources: hardwareResearchLandscape.researchSources,
};