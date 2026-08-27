import type { CompanyDomainIntelligence } from "@/types/companyDomainIntelligence";

export const META_AI_ML_INTELLIGENCE: CompanyDomainIntelligence = {
  companyId: "meta",
  domainId: "ai-ml",

  priority: "Tier 1",

  targetRoles: [
    "ML Engineer",
    "Research Scientist",
    "Research Engineer",
    "Applied Scientist",
    "Computer Vision Engineer",
    "NLP Engineer",
    "Generative AI Engineer",
    "Deep Learning Engineer",
  ],

  coreTechnologies: [
    "PyTorch",
    "Python",
    "Deep Learning",
    "Large Language Models",
    "Computer Vision",
    "Natural Language Processing",
    "Generative AI",
    "Reinforcement Learning",
    "Distributed Training",
    "GPU Computing",
  ],

  certifications: [],

  conferences: [
    "NeurIPS",
    "ICML",
    "ICLR",
    "CVPR",
    "ACL",
    "EMNLP",
    "MLSys",
  ],

  strategicVendors: [],

  recruiterNotes:
    "Strong target for AI/ML engineering and research talent across large-scale machine learning, generative AI, computer vision, NLP and distributed model training. Prioritize candidates with strong research, open-source, publication, model-building and production ML signals.",

  aiPrompt:
    "Find high-signal AI/ML talent relevant to Meta across ML engineering, research science, research engineering, applied science, computer vision, NLP, generative AI and deep learning. Prioritize candidates with strong evidence from technical publications, research labs, GitHub, major ML conferences, open-source projects, model development and large-scale production ML systems.",

  booleanSearch:
    '("ML Engineer" OR "Machine Learning Engineer" OR "Research Scientist" OR "Research Engineer" OR "Applied Scientist" OR "Computer Vision Engineer" OR "NLP Engineer" OR "Generative AI Engineer" OR "Deep Learning Engineer") AND (PyTorch OR "Deep Learning" OR "Machine Learning" OR "Large Language Models" OR LLM OR "Computer Vision" OR NLP OR "Generative AI")',

  sourcingSignals: {
    technicalSignals: [
      "PyTorch",
      "Python",
      "Deep Learning",
      "Large Language Models",
      "Computer Vision",
      "Natural Language Processing",
      "Generative AI",
      "Distributed Training",
      "GPU Computing",
    ],

    ecosystemSignals: [
      "GitHub",
      "Open Source",
      "Meta AI",
      "Machine Learning Research",
      "AI Engineering",
    ],

    researchSignals: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "CVPR",
      "ACL",
      "EMNLP",
      "MLSys",
      "Research Publications",
      "arXiv",
    ],
  },

  regions: ["Global"],
};

export default META_AI_ML_INTELLIGENCE;
