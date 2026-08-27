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
  "ml engineer": {
    role: "ML Engineer",
    overview:
      "Builds, trains, evaluates, deploys and improves machine learning systems, typically working across model development, data pipelines, experimentation and production ML infrastructure.",
    companies: [
      "OpenAI",
      "Anthropic",
      "Google DeepMind",
      "Meta AI",
      "NVIDIA",
      "Microsoft AI",
    ],
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Python",
      "Model Training",
      "Model Evaluation",
      "Feature Engineering",
      "MLOps",
      "Experimentation",
    ],
    certifications: [],
    conferences: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "MLSys",
    ],
  },

  "research scientist": {
    role: "Research Scientist",
    overview:
      "Conducts advanced research in machine learning and artificial intelligence, developing new algorithms, architectures and methods and validating them through experiments and publications.",
    companies: [
      "OpenAI",
      "Anthropic",
      "Google DeepMind",
      "Meta AI",
      "Microsoft Research",
      "NVIDIA Research",
    ],
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Research",
      "Experimental Design",
      "Statistical Modeling",
      "Python",
      "PyTorch",
      "Scientific Writing",
    ],
    certifications: [],
    conferences: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "AAAI",
      "CVPR",
      "ACL",
    ],
  },

  "research engineer": {
    role: "Research Engineer",
    overview:
      "Bridges AI research and engineering by implementing research ideas, building experimental systems, running large-scale evaluations and turning research prototypes into reliable technical systems.",
    companies: [
      "OpenAI",
      "Anthropic",
      "Google DeepMind",
      "Meta AI",
      "NVIDIA",
      "Microsoft Research",
    ],
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Python",
      "PyTorch",
      "Research Engineering",
      "Experimentation",
      "Distributed Training",
      "Model Evaluation",
    ],
    certifications: [],
    conferences: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "MLSys",
      "CVPR",
      "ACL",
    ],
  },

  "applied scientist": {
    role: "Applied Scientist",
    overview:
      "Applies machine learning and statistical research to practical product and business problems, combining experimentation, modeling and research to improve real-world systems.",
    companies: [
      "Amazon",
      "Microsoft",
      "Google",
      "Meta",
      "NVIDIA",
      "Apple",
    ],
    skills: [
      "Machine Learning",
      "Applied Machine Learning",
      "Deep Learning",
      "Python",
      "Statistics",
      "Experimentation",
      "Model Evaluation",
      "Optimization",
    ],
    certifications: [],
    conferences: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "KDD",
      "AAAI",
    ],
  },

  "computer vision engineer": {
    role: "Computer Vision Engineer",
    overview:
      "Develops computer vision systems for image, video and visual perception problems using deep learning, classical vision techniques and multimodal models.",
    companies: [
      "NVIDIA",
      "Google",
      "Meta",
      "Apple",
      "Tesla",
      "Qualcomm",
    ],
    skills: [
      "Computer Vision",
      "Deep Learning",
      "Image Processing",
      "Object Detection",
      "Image Segmentation",
      "3D Vision",
      "OpenCV",
      "PyTorch",
    ],
    certifications: [],
    conferences: [
      "CVPR",
      "ICCV",
      "ECCV",
      "NeurIPS",
      "ICLR",
    ],
  },

  "nlp engineer": {
    role: "NLP Engineer",
    overview:
      "Builds natural language processing systems for understanding, generating and transforming human language using modern machine learning and language-model techniques.",
    companies: [
      "OpenAI",
      "Anthropic",
      "Google",
      "Meta",
      "Microsoft",
      "Cohere",
    ],
    skills: [
      "Natural Language Processing",
      "Deep Learning",
      "Python",
      "Transformers",
      "Large Language Models",
      "Text Classification",
      "Information Retrieval",
      "PyTorch",
    ],
    certifications: [],
    conferences: [
      "ACL",
      "EMNLP",
      "NAACL",
      "NeurIPS",
      "ICLR",
    ],
  },

  "generative ai engineer": {
    role: "Generative AI Engineer",
    overview:
      "Builds production systems powered by generative models, including large language models, retrieval-augmented generation, fine-tuning, evaluation, inference and AI agents.",
    companies: [
      "OpenAI",
      "Anthropic",
      "Google",
      "Meta",
      "Microsoft",
      "Cohere",
    ],
    skills: [
      "Generative AI",
      "Large Language Models",
      "Transformers",
      "RAG",
      "Fine-Tuning",
      "Model Evaluation",
      "AI Agents",
      "Inference Optimization",
    ],
    certifications: [],
    conferences: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "ACL",
      "EMNLP",
    ],
  },

  "deep learning engineer": {
    role: "Deep Learning Engineer",
    overview:
      "Designs, trains and optimizes deep neural networks for production and research applications, often working with large-scale training, model architectures, inference and GPU acceleration.",
    companies: [
      "NVIDIA",
      "OpenAI",
      "Google DeepMind",
      "Meta AI",
      "Anthropic",
      "Microsoft AI",
    ],
    skills: [
      "Deep Learning",
      "Neural Networks",
      "Python",
      "PyTorch",
      "TensorFlow",
      "CUDA",
      "Distributed Training",
      "Model Optimization",
    ],
    certifications: [],
    conferences: [
      "NeurIPS",
      "ICML",
      "ICLR",
      "MLSys",
      "CVPR",
    ],
  },

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
