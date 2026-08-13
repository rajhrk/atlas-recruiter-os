// ============================================================
// Atlas Recruiter OS
// AI / ML Title Intelligence
//
// Purpose:
// - Normalize real-world ML job titles
// - Preserve title variants for sourcing
// - Support Boolean generation
// - Support recruiter search expansion
// - Support future candidate discovery
// ============================================================

export type MLTitleFamily =
  | "Machine Learning Engineering"
  | "AI Engineering"
  | "Data Science"
  | "Research"
  | "Applied Science"
  | "NLP"
  | "Speech"
  | "Computer Vision"
  | "MLOps"
  | "Algorithm Engineering"
  | "Search / Ranking"
  | "Recommendation Systems"
  | "AI Leadership";

export type MLTitleSeniority =
  | "Entry"
  | "Junior"
  | "Mid"
  | "Senior"
  | "Staff"
  | "Principal"
  | "Lead"
  | "Director"
  | "Head"
  | "Executive"
  | "Other";

export interface MLTitle {
  id: string;

  title: string;

  normalizedTitle: string;

  family: MLTitleFamily;

  seniority: MLTitleSeniority;

  aliases: string[];

  specializations?: string[];

  recruiterNotes?: string[];
}

export const mlTitles: MLTitle[] = [
  // ============================================================
  // MACHINE LEARNING ENGINEERING
  // ============================================================

  {
    id: "ml-001",
    title: "Machine Learning Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Mid",
    aliases: [
      "ML Engineer",
      "Machine Learning Engineer",
    ],
  },

  {
    id: "ml-002",
    title: "Senior Machine Learning Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Senior",
    aliases: [
      "Senior ML Engineer",
      "Sr. Machine Learning Engineer",
      "Senior Machine learning engineer",
    ],
  },

  {
    id: "ml-003",
    title: "Senior Machine Learning Engineer II",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Senior",
    aliases: [
      "Sr. Machine Learning Engineer II",
      "Senior ML Engineer II",
    ],
  },

  {
    id: "ml-004",
    title: "Senior Machine Learning Engineer III",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Senior",
    aliases: [
      "Senior ML Engineer III",
    ],
  },

  {
    id: "ml-005",
    title: "Lead ML Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Lead",
    aliases: [
      "Lead Machine Learning Engineer",
      "Machine Learning Senior Lead Engineer",
      "Machine Learning Lead Engineer",
    ],
  },

  {
    id: "ml-006",
    title: "Principal Machine Learning Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Principal",
    aliases: [
      "Sr. Principal Machine Learning Engineer",
      "Principal ML Engineer",
    ],
  },

  {
    id: "ml-007",
    title: "Staff Machine Learning Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Staff",
    aliases: [
      "Staff ML Engineer",
      "Senior Staff ML Engineer",
      "Staff Machine learning lead",
      "Staff Machine Learning Engineer Lead",
    ],
  },

  {
    id: "ml-008",
    title: "Staff ML Software Engineer",
    normalizedTitle: "Machine Learning Software Engineer",
    family: "Machine Learning Engineering",
    seniority: "Staff",
    aliases: [
      "Staff Software Engineer Machine Learning",
      "Staff Software Engineer - Machine Learning",
      "Staff ML Software Engineer",
    ],
  },

  {
    id: "ml-009",
    title: "Machine Learning Software Engineer",
    normalizedTitle: "Machine Learning Software Engineer",
    family: "Machine Learning Engineering",
    seniority: "Mid",
    aliases: [
      "ML Software Engineer",
      "Machine Learning Software Developer",
    ],
  },

  {
    id: "ml-010",
    title: "Applied Machine Learning Engineer",
    normalizedTitle: "Applied Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Mid",
    aliases: [
      "Applied ML Engineer",
      "Applied Machine Learning Engineering",
    ],
  },

  {
    id: "ml-011",
    title: "Tech Lead, Machine Learning Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Lead",
    aliases: [
      "Tech Lead Machine Learning Engineer",
      "ML Tech Lead",
    ],
  },

  {
    id: "ml-012",
    title: "Expert Machine Learning Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Other",
    aliases: [
      "Expert ML Engineer",
    ],
  },

  {
    id: "ml-013",
    title: "Founding ML Engineer",
    normalizedTitle: "Machine Learning Engineer",
    family: "Machine Learning Engineering",
    seniority: "Other",
    aliases: [
      "Founding Machine Learning Engineer",
    ],
  },

  {
    id: "ml-014",
    title: "Principal Software Engineer - Machine Learning",
    normalizedTitle: "Machine Learning Software Engineer",
    family: "Machine Learning Engineering",
    seniority: "Principal",
    aliases: [
      "Principal Software Engineer, Machine Learning",
      "Principal ML Software Engineer",
    ],
  },

  // ============================================================
  // AI ENGINEERING
  // ============================================================

  {
    id: "ml-015",
    title: "AI Engineer",
    normalizedTitle: "AI Engineer",
    family: "AI Engineering",
    seniority: "Mid",
    aliases: [
      "Artificial Intelligence Engineer",
    ],
  },

  {
    id: "ml-016",
    title: "Senior AI Engineer",
    normalizedTitle: "AI Engineer",
    family: "AI Engineering",
    seniority: "Senior",
    aliases: [
      "Senior AI Engineer",
    ],
  },

  {
    id: "ml-017",
    title: "Staff AI Engineer",
    normalizedTitle: "AI Engineer",
    family: "AI Engineering",
    seniority: "Staff",
    aliases: [
      "Staff Ai Engineer",
      "Staff AI Engineering",
    ],
  },

  {
    id: "ml-018",
    title: "Lead AI Research Engineer",
    normalizedTitle: "AI Research Engineer",
    family: "AI Engineering",
    seniority: "Lead",
    aliases: [
      "Lead AI Research Engineer",
      "AI Research Engineer Lead",
    ],
  },

  // ============================================================
  // DATA SCIENCE
  // ============================================================

  {
    id: "ml-019",
    title: "Data Scientist",
    normalizedTitle: "Data Scientist",
    family: "Data Science",
    seniority: "Mid",
    aliases: [
      "Machine Learning Data Scientist",
    ],
  },

  {
    id: "ml-020",
    title: "Senior Data Scientist",
    normalizedTitle: "Data Scientist",
    family: "Data Science",
    seniority: "Senior",
    aliases: [
      "Sr. Data Scientist",
    ],
  },

  {
    id: "ml-021",
    title: "Lead Data Scientist",
    normalizedTitle: "Data Scientist",
    family: "Data Science",
    seniority: "Lead",
    aliases: [
      "Lead Data Science",
    ],
  },

  {
    id: "ml-022",
    title: "Principal Data Scientist",
    normalizedTitle: "Data Scientist",
    family: "Data Science",
    seniority: "Principal",
    aliases: [
      "Principal Data Science",
    ],
  },

  {
    id: "ml-023",
    title: "Staff Data Scientist",
    normalizedTitle: "Data Scientist",
    family: "Data Science",
    seniority: "Staff",
    aliases: [
      "Staff Data Science",
    ],
  },

  {
    id: "ml-024",
    title: "Applied Data Scientist",
    normalizedTitle: "Applied Data Scientist",
    family: "Data Science",
    seniority: "Mid",
    aliases: [
      "Applied Data Science",
    ],
  },

  {
    id: "ml-025",
    title: "Data Science Architect",
    normalizedTitle: "Data Science Architect",
    family: "Data Science",
    seniority: "Other",
    aliases: [
      "Data Scientist Architect",
    ],
  },

  {
    id: "ml-026",
    title: "Chief Data Scientist",
    normalizedTitle: "Chief Data Scientist",
    family: "AI Leadership",
    seniority: "Executive",
    aliases: [
      "Chief Data Science Officer",
    ],
  },

  // ============================================================
  // MACHINE LEARNING SCIENCE
  // ============================================================

  {
    id: "ml-027",
    title: "Machine Learning Scientist",
    normalizedTitle: "Machine Learning Scientist",
    family: "Research",
    seniority: "Mid",
    aliases: [
      "Machine learning scientist",
    ],
  },

  {
    id: "ml-028",
    title: "Senior Machine Learning Scientist",
    normalizedTitle: "Machine Learning Scientist",
    family: "Research",
    seniority: "Senior",
    aliases: [
      "Senior Machine learning scientist",
      "Sr. Machine Learning Scientist",
    ],
  },

  {
    id: "ml-029",
    title: "Staff Machine Learning Scientist",
    normalizedTitle: "Machine Learning Scientist",
    family: "Research",
    seniority: "Staff",
    aliases: [
      "Staff ML Scientist",
    ],
  },

  {
    id: "ml-030",
    title: "Senior Machine Learning Researcher",
    normalizedTitle: "Machine Learning Researcher",
    family: "Research",
    seniority: "Senior",
    aliases: [
      "Senior Machine learning researcher",
    ],
  },

  {
    id: "ml-031",
    title: "Machine Learning Researcher",
    normalizedTitle: "Machine Learning Researcher",
    family: "Research",
    seniority: "Mid",
    aliases: [
      "Machine learning researcher",
    ],
  },

  {
    id: "ml-032",
    title: "Machine Learning Researcher (Staff)",
    normalizedTitle: "Machine Learning Researcher",
    family: "Research",
    seniority: "Staff",
    aliases: [
      "Staff ML researcher",
      "Staff Machine Learning Researcher",
    ],
  },

  {
    id: "ml-033",
    title: "Machine Learning Research Scientist",
    normalizedTitle: "Machine Learning Research Scientist",
    family: "Research",
    seniority: "Mid",
    aliases: [
      "ML Research Scientist",
      "Machine Learning Research Scientist",
    ],
  },

  {
    id: "ml-034",
    title: "Senior Machine Learning Researcher and Engineer",
    normalizedTitle: "Machine Learning Research Engineer",
    family: "Research",
    seniority: "Senior",
    aliases: [
      "Senior ML Researcher and Engineer",
    ],
  },

  // ============================================================
  // RESEARCH SCIENCE
  // ============================================================

  {
    id: "ml-035",
    title: "Research Scientist",
    normalizedTitle: "Research Scientist",
    family: "Research",
    seniority: "Mid",
    aliases: [
      "Machine Learning Research Scientist",
    ],
  },

  {
    id: "ml-036",
    title: "Staff Research Scientist",
    normalizedTitle: "Research Scientist",
    family: "Research",
    seniority: "Staff",
    aliases: [
      "Staff Research Scientist",
    ],
  },

  {
    id: "ml-037",
    title: "Senior Staff Research Scientist",
    normalizedTitle: "Research Scientist",
    family: "Research",
    seniority: "Staff",
    aliases: [
      "Senior Staff Research Scientist",
    ],
  },

  {
    id: "ml-038",
    title: "Staff Applied Research Scientist",
    normalizedTitle: "Applied Research Scientist",
    family: "Applied Science",
    seniority: "Staff",
    aliases: [
      "Staff Applied Researcher",
    ],
  },

  {
    id: "ml-039",
    title: "Senior Staff Applied Research Scientist",
    normalizedTitle: "Applied Research Scientist",
    family: "Applied Science",
    seniority: "Staff",
    aliases: [
      "Senior Staff Applied Research Scientist",
    ],
  },

  {
    id: "ml-040",
    title: "Staff Applied Researcher",
    normalizedTitle: "Applied Researcher",
    family: "Applied Science",
    seniority: "Staff",
    aliases: [
      "Staff Applied researcher",
    ],
  },

  {
    id: "ml-041",
    title: "Senior Applied Scientist",
    normalizedTitle: "Applied Scientist",
    family: "Applied Science",
    seniority: "Senior",
    aliases: [
      "Senior Applied Scientist",
    ],
  },

  {
    id: "ml-042",
    title: "Lead Researcher",
    normalizedTitle: "Researcher",
    family: "Research",
    seniority: "Lead",
    aliases: [
      "Lead Research Scientist",
    ],
  },

  {
    id: "ml-043",
    title: "Research Lead",
    normalizedTitle: "Research Lead",
    family: "Research",
    seniority: "Lead",
    aliases: [
      "Machine Learning Research Lead",
    ],
  },

  {
    id: "ml-044",
    title: "Senior Staff Research Lead",
    normalizedTitle: "Research Lead",
    family: "Research",
    seniority: "Staff",
    aliases: [
      "Senior Staff Research Lead",
    ],
  },

  {
    id: "ml-045",
    title: "Lead Quantitative Researcher",
    normalizedTitle: "Quantitative Researcher",
    family: "Research",
    seniority: "Lead",
    aliases: [
      "Lead Quant Researcher",
    ],
  },

  {
    id: "ml-046",
    title: "Senior Research Staff, Salesforce Research",
    normalizedTitle: "Research Scientist",
    family: "Research",
    seniority: "Senior",
    aliases: [
      "Senior Research Staff",
    ],
    recruiterNotes: [
      "Company-specific title preserved from the source material.",
    ],
  },

  // ============================================================
  // NLP
  // ============================================================

  {
    id: "ml-047",
    title: "NLP Engineer",
    normalizedTitle: "NLP Engineer",
    family: "NLP",
    seniority: "Mid",
    aliases: [
      "Natural Language Processing Engineer",
    ],
    specializations: [
      "Natural Language Processing",
      "Language Models",
      "Information Retrieval",
    ],
  },

  {
    id: "ml-048",
    title: "Senior NLP Research Engineer",
    normalizedTitle: "NLP Research Engineer",
    family: "NLP",
    seniority: "Senior",
    aliases: [
      "Senior NLP Research Engineer",
    ],
  },

  {
    id: "ml-049",
    title: "Staff NLP Engineer",
    normalizedTitle: "NLP Engineer",
    family: "NLP",
    seniority: "Staff",
    aliases: [
      "Staff Natural Language Processing Engineer",
    ],
  },

  // ============================================================
  // SPEECH
  // ============================================================

  {
    id: "ml-050",
    title: "Lead Speech Scientist",
    normalizedTitle: "Speech Scientist",
    family: "Speech",
    seniority: "Lead",
    aliases: [
      "Lead Speech Scientist",
    ],
  },

  {
    id: "ml-051",
    title: "Lead Speech Specialist",
    normalizedTitle: "Speech Specialist",
    family: "Speech",
    seniority: "Lead",
    aliases: [
      "Lead Speech Specialist",
    ],
  },

  {
    id: "ml-052",
    title: "Senior Speech R&D Engineer",
    normalizedTitle: "Speech R&D Engineer",
    family: "Speech",
    seniority: "Senior",
    aliases: [
      "Senior Speech R&D Engineer",
      "Senior Speech Research Engineer",
    ],
  },

  // ============================================================
  // MLOPS
  // ============================================================

  {
    id: "ml-053",
    title: "Senior MLOps Engineer",
    normalizedTitle: "MLOps Engineer",
    family: "MLOps",
    seniority: "Senior",
    aliases: [
      "Senior Machine Learning Operations Engineer",
    ],
  },

  {
    id: "ml-054",
    title: "MLOps Engineer",
    normalizedTitle: "MLOps Engineer",
    family: "MLOps",
    seniority: "Mid",
    aliases: [
      "Machine Learning Operations Engineer",
    ],
  },

  // ============================================================
  // ALGORITHM ENGINEERING
  // ============================================================

  {
    id: "ml-055",
    title: "AI Algorithm Engineer",
    normalizedTitle: "AI Algorithm Engineer",
    family: "Algorithm Engineering",
    seniority: "Mid",
    aliases: [
      "AI Algorithm Engineer",
    ],
  },

  {
    id: "ml-056",
    title: "Staff AI Algorithm Engineer",
    normalizedTitle: "AI Algorithm Engineer",
    family: "Algorithm Engineering",
    seniority: "Staff",
    aliases: [
      "Staff AI Algorithm Engineer",
    ],
  },

  {
    id: "ml-057",
    title: "Staff Algorithm Engineer II",
    normalizedTitle: "Algorithm Engineer",
    family: "Algorithm Engineering",
    seniority: "Staff",
    aliases: [
      "Staff Algorithm Engineer",
    ],
  },

  // ============================================================
  // SEARCH / RANKING
  // ============================================================

  {
    id: "ml-058",
    title: "Senior Machine Learning Engineer (Search)",
    normalizedTitle: "Machine Learning Engineer",
    family: "Search / Ranking",
    seniority: "Senior",
    aliases: [
      "Senior ML Engineer Search",
      "Machine Learning Engineer - Search",
    ],
    specializations: [
      "Search",
      "Search Ranking",
      "Information Retrieval",
    ],
  },

  {
    id: "ml-059",
    title: "Senior Search Relevance Engineer (NLP)",
    normalizedTitle: "Search Relevance Engineer",
    family: "Search / Ranking",
    seniority: "Senior",
    aliases: [
      "Senior Search Relevance Engineer",
      "Search Relevance Engineer NLP",
    ],
    specializations: [
      "Search Relevance",
      "NLP",
      "Information Retrieval",
      "Ranking",
    ],
  },

  {
    id: "ml-060",
    title: "Search Ranking Engineer",
    normalizedTitle: "Search Ranking Engineer",
    family: "Search / Ranking",
    seniority: "Mid",
    aliases: [
      "Search Ranking Engineer",
      "Search Algorithm Engineer",
      "Ranking Engineer",
    ],
    specializations: [
      "Search Ranking",
      "Learning to Rank",
      "Information Retrieval",
    ],
  },

  // ============================================================
  // AI / ML LEADERSHIP
  // ============================================================

  {
    id: "ml-061",
    title: "Head of ML Lab",
    normalizedTitle: "Head of ML Lab",
    family: "AI Leadership",
    seniority: "Head",
    aliases: [
      "Chief Data Scientist & Head of ML Lab",
      "Head of Machine Learning Lab",
    ],
  },

  {
    id: "ml-062",
    title: "Head of Data Science",
    normalizedTitle: "Head of Data Science",
    family: "AI Leadership",
    seniority: "Head",
    aliases: [
      "Head of data Science",
      "Head of Data Sciences",
    ],
  },

  // ============================================================
  // GENERAL ML / APPLIED RESEARCH
  // ============================================================

  {
    id: "ml-063",
    title: "Machine Learning Applied Researcher",
    normalizedTitle: "Applied Machine Learning Researcher",
    family: "Applied Science",
    seniority: "Mid",
    aliases: [
      "Machine learning applied researcher",
      "Applied ML Researcher",
    ],
  },

  {
    id: "ml-064",
    title: "Senior Machine Learning Applied Researcher",
    normalizedTitle: "Applied Machine Learning Researcher",
    family: "Applied Science",
    seniority: "Senior",
    aliases: [
      "Senior Applied ML Researcher",
    ],
  },

  {
    id: "ml-065",
    title: "Senior Machine Learning Research Scientist",
    normalizedTitle: "Machine Learning Research Scientist",
    family: "Research",
    seniority: "Senior",
    aliases: [
      "Senior ML Research Scientist",
    ],
  },

  {
    id: "ml-066",
    title: "Research Engineer",
    normalizedTitle: "Research Engineer",
    family: "Research",
    seniority: "Mid",
    aliases: [
      "Machine Learning Research Engineer",
      "AI Research Engineer",
      "ML Research Engineer",
    ],
  },

  // ============================================================
  // RECOMMENDATION / RANKING TITLE VARIANTS
  // ============================================================

  {
    id: "ml-067",
    title: "Recommendation Algorithm Engineer",
    normalizedTitle: "Recommendation Engineer",
    family: "Recommendation Systems",
    seniority: "Mid",
    aliases: [
      "Recommendation Engineer",
      "Recommendation Algorithm Engineer",
    ],
    specializations: [
      "Recommendation Systems",
      "Ranking",
      "Personalization",
    ],
  },

  {
    id: "ml-068",
    title: "Algorithm Engineer, Recommendation",
    normalizedTitle: "Recommendation Engineer",
    family: "Recommendation Systems",
    seniority: "Mid",
    aliases: [
      "Algorithm Engineer Recommendation",
    ],
    specializations: [
      "Recommendation Systems",
      "Ranking",
    ],
  },

  {
    id: "ml-069",
    title: "Recommendation & Search Algorithm Engineer",
    normalizedTitle: "Recommendation / Search Engineer",
    family: "Recommendation Systems",
    seniority: "Mid",
    aliases: [
      "Recommendation & Search Algorithm",
      "Search and Recommendation Algorithm Engineer",
    ],
    specializations: [
      "Recommendation",
      "Search",
      "Ranking",
    ],
  },

  {
    id: "ml-070",
    title: "Video Recommendation Engineer",
    normalizedTitle: "Video Recommendation Engineer",
    family: "Recommendation Systems",
    seniority: "Mid",
    aliases: [
      "Video Recommendation Algorithm Engineer",
      "Video Recommender Systems Engineer",
    ],
    specializations: [
      "Video Recommendation",
      "Video Ranking",
      "Video Retrieval",
    ],
  },
];

// ============================================================
// Utility helpers
// ============================================================

export function getMLTitlesByFamily(
  family: MLTitleFamily
): MLTitle[] {
  return mlTitles.filter((title) => title.family === family);
}

export function getMLTitlesBySeniority(
  seniority: MLTitleSeniority
): MLTitle[] {
  return mlTitles.filter(
    (title) => title.seniority === seniority
  );
}

export function getMLTitleAliases(): string[] {
  return Array.from(
    new Set(
      mlTitles.flatMap((title) => [
        title.title,
        ...title.aliases,
      ])
    )
  );
}

export function getMLTitlesForBoolean(): string[] {
  return getMLTitleAliases().map(
    (title) => `"${title}"`
  );
}

export function buildMLTitleBoolean(): string {
  return `(${getMLTitlesForBoolean().join(" OR ")})`;
}