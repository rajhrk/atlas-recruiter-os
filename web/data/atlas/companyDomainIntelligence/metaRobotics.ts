import type { CompanyDomainIntelligence } from "@/types/companyDomainIntelligence";

export const META_ROBOTICS_INTELLIGENCE: CompanyDomainIntelligence = {
  companyId: "meta",
  domainId: "robotics",

  priority: "Tier 1",

  targetRoles: [
    "Robotics Engineer",
    "Robot Learning Engineer",
    "Robotics Research Scientist",
    "Perception Engineer",
    "Manipulation Engineer",
    "Autonomy Engineer",
    "Motion Planning Engineer",
    "Controls Engineer",
  ],

  coreTechnologies: [
    "Robotics",
    "Computer Vision",
    "Motion Planning",
    "ROS2",
    "PyTorch",
    "OpenCV",
    "MoveIt",
    "Reinforcement Learning",
    "Robot Learning",
    "Autonomous Systems",
  ],

  certifications: [],

  conferences: [
    "ICRA",
    "RSS",
    "CoRL",
    "IROS",
  ],

  strategicVendors: [],

  recruiterNotes:
    "Target robotics talent with strong evidence across robot learning, perception, manipulation, autonomy, motion planning and controls. Prioritize candidates demonstrating research depth, robotics software, simulation, open-source contributions, publications and hands-on work with real robotic systems.",

  aiPrompt:
    "Find high-signal robotics talent relevant to Meta across robotics engineering, robot learning, perception, manipulation, autonomy, motion planning, controls and robotics research. Prioritize candidates with evidence from robotics publications, GitHub, open-source robotics projects, ICRA, RSS, CoRL and IROS, as well as experience building or deploying robotic systems.",

  booleanSearch:
    '("Robotics Engineer" OR "Robot Learning Engineer" OR "Robotics Research Scientist" OR "Perception Engineer" OR "Manipulation Engineer" OR "Autonomy Engineer" OR "Motion Planning Engineer" OR "Controls Engineer") AND (Robotics OR "Computer Vision" OR "Motion Planning" OR ROS2 OR PyTorch OR OpenCV OR MoveIt OR "Reinforcement Learning")',

  sourcingSignals: {
    technicalSignals: [
      "Robotics",
      "Computer Vision",
      "Motion Planning",
      "ROS2",
      "PyTorch",
      "OpenCV",
      "MoveIt",
      "Reinforcement Learning",
      "Robot Learning",
    ],

    ecosystemSignals: [
      "GitHub",
      "Open Source",
      "Robotics Software",
      "Robotics Research",
      "Autonomous Systems",
    ],

    researchSignals: [
      "ICRA",
      "RSS",
      "CoRL",
      "IROS",
      "Robotics Publications",
      "arXiv",
    ],
  },

  regions: ["Global"],
};

export default META_ROBOTICS_INTELLIGENCE;
