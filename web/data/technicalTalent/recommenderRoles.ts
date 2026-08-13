// ============================================================
// Atlas Recruiter OS
// Recommender Systems Intelligence
//
// Dedicated intelligence layer for:
// Search, Ranking, Feed, Ads, Video, E-commerce,
// Personalization, Retrieval, Re-ranking and LTR.
// ============================================================

export type RecommenderDomain =
  | "Core Recommendation"
  | "Search"
  | "Ranking"
  | "Feed"
  | "Ads"
  | "Video"
  | "E-commerce"
  | "Personalization"
  | "Retrieval"
  | "Re-ranking"
  | "Learning to Rank";

export interface RecommenderRole {
  id: string;
  title: string;
  normalizedTitle: string;
  domain: RecommenderDomain;
  aliases: string[];
  keywords: string[];
  technologies?: string[];
  relatedRoles?: string[];
  recruiterNotes?: string[];
}

export const recommenderRoles: RecommenderRole[] = [
  // ============================================================
  // CORE RECOMMENDATION
  // ============================================================

  {
    id: "rec-001",
    title: "Recommendation Algorithm Engineer",
    normalizedTitle: "Recommendation Engineer",
    domain: "Core Recommendation",
    aliases: [
      "Recommendation Engineer",
      "Recommendation Algorithm Engineer",
    ],
    keywords: [
      "recommendation",
      "recommender systems",
      "recommendation models",
      "personalization",
      "ranking",
      "retrieval",
    ],
    technologies: [
      "Machine Learning",
      "Deep Learning",
      "Collaborative Filtering",
    ],
    relatedRoles: [
      "Algorithm Engineer, Recommendation",
      "Ranking Engineer",
      "Personalization Engineer",
    ],
    recruiterNotes: [
      "Core recommender-system talent pool.",
    ],
  },

  {
    id: "rec-002",
    title: "Algorithm Engineer, Recommendation",
    normalizedTitle: "Recommendation Engineer",
    domain: "Core Recommendation",
    aliases: [
      "Algorithm Engineer Recommendation",
      "Recommendation Algorithm Engineer",
    ],
    keywords: [
      "recommendation algorithm",
      "recommendation models",
      "ranking",
      "personalization",
    ],
    relatedRoles: [
      "Recommendation Engineer",
      "Algorithm Engineer",
    ],
  },

  {
    id: "rec-003",
    title: "Recommender Systems Engineer",
    normalizedTitle: "Recommender Systems Engineer",
    domain: "Core Recommendation",
    aliases: [
      "Recommender Engineer",
      "Recommender Systems",
      "RecSys Engineer",
    ],
    keywords: [
      "RecSys",
      "recommender systems",
      "recommendation models",
      "personalization",
    ],
  },

  {
    id: "rec-004",
    title: "Personalization Engineer",
    normalizedTitle: "Personalization Engineer",
    domain: "Personalization",
    aliases: [
      "Personalized Recommendation Engineer",
      "Personalisation Engineer",
    ],
    keywords: [
      "personalization",
      "personalized recommendation",
      "personalised recommendation",
      "user modeling",
      "recommendation",
    ],
  },

  // ============================================================
  // SEARCH
  // ============================================================

  {
    id: "rec-005",
    title: "Search Algorithm Engineer",
    normalizedTitle: "Search Algorithm Engineer",
    domain: "Search",
    aliases: [
      "Search Engineer",
      "Search Algorithm",
      "Search Algorithms Engineer",
    ],
    keywords: [
      "search algorithm",
      "information retrieval",
      "search ranking",
      "search relevance",
      "query understanding",
    ],
    technologies: [
      "Information Retrieval",
      "Machine Learning",
      "NLP",
    ],
  },

  {
    id: "rec-006",
    title: "Search Relevance Engineer",
    normalizedTitle: "Search Relevance Engineer",
    domain: "Search",
    aliases: [
      "Senior Search Relevance Engineer",
      "Search Relevance",
      "Search Relevance Engineer (NLP)",
    ],
    keywords: [
      "search relevance",
      "relevance",
      "information retrieval",
      "NLP",
      "ranking",
      "query understanding",
    ],
    technologies: [
      "NLP",
      "Information Retrieval",
      "Learning to Rank",
    ],
  },

  {
    id: "rec-007",
    title: "Search Ranking Engineer",
    normalizedTitle: "Search Ranking Engineer",
    domain: "Search",
    aliases: [
      "Search Ranking",
      "Ranking Search Engineer",
      "Search Ranking Algorithm Engineer",
    ],
    keywords: [
      "search ranking",
      "ranking algorithm",
      "ranking models",
      "search relevance",
      "LTR",
    ],
    technologies: [
      "Learning to Rank",
      "Machine Learning",
      "Information Retrieval",
    ],
  },

  {
    id: "rec-008",
    title: "Search and Recommendation Algorithm Engineer",
    normalizedTitle: "Search / Recommendation Engineer",
    domain: "Search",
    aliases: [
      "Recommendation & Search Algorithm",
      "Search and recommendation algorithms",
      "Recommendation & Search Engineer",
    ],
    keywords: [
      "search",
      "recommendation",
      "ranking",
      "personalization",
      "retrieval",
    ],
  },

  {
    id: "rec-009",
    title: "Search Personalization Engineer",
    normalizedTitle: "Search Personalization Engineer",
    domain: "Search",
    aliases: [
      "Personalized Search Engineer",
      "Personalised Search Engineer",
    ],
    keywords: [
      "personalized search",
      "search personalization",
      "search ranking",
      "user modeling",
    ],
  },

  // ============================================================
  // RANKING
  // ============================================================

  {
    id: "rec-010",
    title: "Ranking Algorithm Engineer",
    normalizedTitle: "Ranking Engineer",
    domain: "Ranking",
    aliases: [
      "Ranking Engineer",
      "Ranking Algorithm",
      "Ranking Algorithms Engineer",
    ],
    keywords: [
      "ranking algorithm",
      "ranking models",
      "learning to rank",
      "re-ranking",
      "relevance",
    ],
  },

  {
    id: "rec-011",
    title: "Recommendation Ranking Engineer",
    normalizedTitle: "Recommendation Ranking Engineer",
    domain: "Ranking",
    aliases: [
      "Recommendation Ranking",
      "Recommendation Ranking Engineer",
      "Ranking & Recommendation Engineer",
    ],
    keywords: [
      "recommendation ranking",
      "ranking models",
      "recommendation",
      "re-ranking",
    ],
  },

  {
    id: "rec-012",
    title: "Ranking and Relevance Engineer",
    normalizedTitle: "Ranking / Relevance Engineer",
    domain: "Ranking",
    aliases: [
      "Ranking Relevance Engineer",
      "Relevance Ranking Engineer",
    ],
    keywords: [
      "ranking",
      "relevance",
      "search",
      "recommendation",
      "LTR",
    ],
  },

  // ============================================================
  // FEED
  // ============================================================

  {
    id: "rec-013",
    title: "Feed Ranking Engineer",
    normalizedTitle: "Feed Ranking Engineer",
    domain: "Feed",
    aliases: [
      "Feed Ranking",
      "Feed Algorithm Engineer",
      "Feed Recommendation Engineer",
    ],
    keywords: [
      "feed ranking",
      "feed recommendation",
      "content recommendation",
      "personalized feed",
      "ranking",
    ],
  },

  {
    id: "rec-014",
    title: "Feed Recommendation Engineer",
    normalizedTitle: "Feed Recommendation Engineer",
    domain: "Feed",
    aliases: [
      "Feed Recommendation",
      "Feed Recommender Engineer",
    ],
    keywords: [
      "feed recommendation",
      "feed ranking",
      "recommendation",
      "personalization",
      "content recommendation",
    ],
  },

  {
    id: "rec-015",
    title: "Content Recommendation Engineer",
    normalizedTitle: "Content Recommendation Engineer",
    domain: "Feed",
    aliases: [
      "Content Recommendation Engine",
      "Content Recommendation System",
      "Content Recommendation",
    ],
    keywords: [
      "content recommendation",
      "content ranking",
      "recommendation engine",
      "personalization",
    ],
  },

  {
    id: "rec-016",
    title: "Social Recommendation Engineer",
    normalizedTitle: "Social Recommendation Engineer",
    domain: "Feed",
    aliases: [
      "Social Recommendation",
      "Social Recommender Systems",
    ],
    keywords: [
      "social recommendation",
      "feed recommendation",
      "social graph",
      "personalization",
    ],
  },

  // ============================================================
  // ADS
  // ============================================================

  {
    id: "rec-017",
    title: "Ads Recommendation Engineer",
    normalizedTitle: "Ads Recommendation Engineer",
    domain: "Ads",
    aliases: [
      "Ad Recommendation Engineer",
      "Ads Recommendation System",
      "Ad Recommendation System",
    ],
    keywords: [
      "ads recommendation",
      "ad recommendation",
      "ads ranking",
      "recommendation",
      "CTR prediction",
      "ads targeting",
    ],
  },

  {
    id: "rec-018",
    title: "Ads Ranking Engineer",
    normalizedTitle: "Ads Ranking Engineer",
    domain: "Ads",
    aliases: [
      "Ad Ranking Engineer",
      "Ads Ranking",
      "Ad Ranking",
    ],
    keywords: [
      "ads ranking",
      "ad ranking",
      "ranking",
      "CTR prediction",
      "click prediction",
      "ads relevance",
    ],
  },

  {
    id: "rec-019",
    title: "Computational Advertising Engineer",
    normalizedTitle: "Computational Advertising Engineer",
    domain: "Ads",
    aliases: [
      "Computational Advertising",
      "Ads Algorithm Engineer",
    ],
    keywords: [
      "computational advertising",
      "ads ranking",
      "ads targeting",
      "CTR",
      "click prediction",
      "auction",
    ],
  },

  {
    id: "rec-020",
    title: "Ads Machine Learning Engineer",
    normalizedTitle: "Ads ML Engineer",
    domain: "Ads",
    aliases: [
      "Ads ML Engineer",
      "Machine Learning Engineer Ads",
    ],
    keywords: [
      "ads",
      "machine learning",
      "ads ranking",
      "ads targeting",
      "CTR prediction",
    ],
  },

  // ============================================================
  // VIDEO
  // ============================================================

  {
    id: "rec-021",
    title: "Video Recommendation Engineer",
    normalizedTitle: "Video Recommendation Engineer",
    domain: "Video",
    aliases: [
      "Video Recommendation Algorithm Engineer",
      "Video Recommender Systems Engineer",
      "Video Recommendation System",
    ],
    keywords: [
      "video recommendation",
      "video recommender",
      "video ranking",
      "video retrieval",
      "short video",
    ],
  },

  {
    id: "rec-022",
    title: "Video Ranking Engineer",
    normalizedTitle: "Video Ranking Engineer",
    domain: "Video",
    aliases: [
      "Video Ranking",
      "Video Recommendation Ranking",
    ],
    keywords: [
      "video ranking",
      "video recommendation",
      "ranking algorithm",
      "short video",
    ],
  },

  {
    id: "rec-023",
    title: "Video Retrieval Engineer",
    normalizedTitle: "Video Retrieval Engineer",
    domain: "Video",
    aliases: [
      "Video Retrieval",
      "Video Search Engineer",
    ],
    keywords: [
      "video retrieval",
      "video search",
      "multimodal retrieval",
      "video understanding",
    ],
  },

  {
    id: "rec-024",
    title: "Video Search Algorithm Engineer",
    normalizedTitle: "Video Search Engineer",
    domain: "Video",
    aliases: [
      "Search Algorithm for Video",
      "Video Search Algorithm",
      "Video Search Engineer",
    ],
    keywords: [
      "video search",
      "video retrieval",
      "search ranking",
      "video understanding",
    ],
  },

  {
    id: "rec-025",
    title: "Livestream Recommendation Engineer",
    normalizedTitle: "Livestream Recommendation Engineer",
    domain: "Video",
    aliases: [
      "Livestream Recommendation System",
      "Livestream Recommender Engineer",
    ],
    keywords: [
      "livestream recommendation",
      "livestream search",
      "video recommendation",
      "real-time recommendation",
    ],
  },

  {
    id: "rec-026",
    title: "Livestream Search Engineer",
    normalizedTitle: "Livestream Search Engineer",
    domain: "Video",
    aliases: [
      "Livestream Search Team",
      "Livestream Search Stack",
    ],
    keywords: [
      "livestream search",
      "video search",
      "search ranking",
      "retrieval",
    ],
  },

  {
    id: "rec-027",
    title: "Short Video Recommendation Engineer",
    normalizedTitle: "Short Video Recommendation Engineer",
    domain: "Video",
    aliases: [
      "Short Video Recommendation",
      "ShortVideo Recommendation",
      "Short Video Recommender",
    ],
    keywords: [
      "short video recommendation",
      "short video",
      "video ranking",
      "feed recommendation",
    ],
  },

  {
    id: "rec-028",
    title: "Video Recommender Systems Engineer",
    normalizedTitle: "Video Recommender Systems Engineer",
    domain: "Video",
    aliases: [
      "videorecsys",
      "Large-scale Video Recommender Systems",
      "Video Recommender Systems",
    ],
    keywords: [
      "videorecsys",
      "video recommender systems",
      "large-scale recommender systems",
      "video ranking",
    ],
  },

  // ============================================================
  // E-COMMERCE
  // ============================================================

  {
    id: "rec-029",
    title: "E-commerce Recommendation Engineer",
    normalizedTitle: "E-commerce Recommendation Engineer",
    domain: "E-commerce",
    aliases: [
      "Ecom Recommendation Engineer",
      "E-commerce Recommendation System",
      "Ecom Recommendation System",
    ],
    keywords: [
      "e-commerce recommendation",
      "ecommerce recommendation",
      "product recommendation",
      "personalization",
      "ranking",
    ],
  },

  {
    id: "rec-030",
    title: "E-commerce Ranking Engineer",
    normalizedTitle: "E-commerce Ranking Engineer",
    domain: "E-commerce",
    aliases: [
      "Ecommerce Ranking",
      "Product Ranking Engineer",
    ],
    keywords: [
      "e-commerce ranking",
      "product ranking",
      "search ranking",
      "recommendation",
    ],
  },

  // ============================================================
  // RETRIEVAL
  // ============================================================

  {
    id: "rec-031",
    title: "Recommendation Retrieval Engineer",
    normalizedTitle: "Recommendation Retrieval Engineer",
    domain: "Retrieval",
    aliases: [
      "Retrieval Engineer Recommendation",
      "Recommendation Retrieval",
    ],
    keywords: [
      "retrieval",
      "candidate generation",
      "recommendation",
      "embedding retrieval",
      "vector search",
    ],
  },

  {
    id: "rec-032",
    title: "Candidate Generation Engineer",
    normalizedTitle: "Candidate Generation Engineer",
    domain: "Retrieval",
    aliases: [
      "Candidate Generation",
      "Recommendation Candidate Generation",
    ],
    keywords: [
      "candidate generation",
      "retrieval",
      "recommendation",
      "two-tower",
      "embedding",
    ],
  },

  {
    id: "rec-033",
    title: "Information Retrieval Engineer",
    normalizedTitle: "Information Retrieval Engineer",
    domain: "Retrieval",
    aliases: [
      "IR Engineer",
      "Information Retrieval",
    ],
    keywords: [
      "information retrieval",
      "retrieval",
      "search",
      "ranking",
      "query understanding",
    ],
  },

  // ============================================================
  // RE-RANKING
  // ============================================================

  {
    id: "rec-034",
    title: "Re-ranking Engineer",
    normalizedTitle: "Re-ranking Engineer",
    domain: "Re-ranking",
    aliases: [
      "Reranking Engineer",
      "Re-Ranking Engineer",
      "Recommendation Re-ranking Engineer",
    ],
    keywords: [
      "re-ranking",
      "reranking",
      "ranking",
      "recommendation",
      "search relevance",
    ],
  },

  {
    id: "rec-035",
    title: "Recommendation Re-ranking Engineer",
    normalizedTitle: "Recommendation Re-ranking Engineer",
    domain: "Re-ranking",
    aliases: [
      "Recommendation Reranking",
      "Recommendation Re-Ranking",
    ],
    keywords: [
      "recommendation",
      "re-ranking",
      "reranking",
      "ranking models",
    ],
  },

  // ============================================================
  // LEARNING TO RANK
  // ============================================================

  {
    id: "rec-036",
    title: "Learning to Rank Engineer",
    normalizedTitle: "Learning to Rank Engineer",
    domain: "Learning to Rank",
    aliases: [
      "LTR Engineer",
      "Learning to Rank",
      "LTR Model Engineer",
    ],
    keywords: [
      "Learning to Rank",
      "LTR",
      "ranking model",
      "ranking",
      "relevance",
    ],
    technologies: [
      "Machine Learning",
      "Gradient Boosting",
      "Neural Ranking",
    ],
  },

  {
    id: "rec-037",
    title: "Ranking Model Engineer",
    normalizedTitle: "Ranking Model Engineer",
    domain: "Learning to Rank",
    aliases: [
      "Ranking Models",
      "Ranking Model",
      "Recommendation Ranking Model Engineer",
    ],
    keywords: [
      "ranking models",
      "LTR",
      "ranking",
      "recommendation",
      "relevance",
    ],
  },
];

// ============================================================
// Utility functions
// ============================================================

export function getRecommenderRolesByDomain(
  domain: RecommenderDomain
): RecommenderRole[] {
  return recommenderRoles.filter(
    (role) => role.domain === domain
  );
}

export function getAllRecommenderKeywords(): string[] {
  return Array.from(
    new Set(
      recommenderRoles.flatMap((role) => [
        role.title,
        ...role.aliases,
        ...role.keywords,
      ])
    )
  );
}

export function getRecommenderTitleAliases(): string[] {
  return Array.from(
    new Set(
      recommenderRoles.flatMap((role) => [
        role.title,
        ...role.aliases,
      ])
    )
  );
}

export function buildRecommenderBoolean(
  domain?: RecommenderDomain
): string {
  const roles = domain
    ? getRecommenderRolesByDomain(domain)
    : recommenderRoles;

  const titles = Array.from(
    new Set(
      roles.flatMap((role) => [
        role.title,
        ...role.aliases,
      ])
    )
  );

  return `(${titles.map((title) => `"${title}"`).join(" OR ")})`;
}

export function buildRecommenderKeywordBoolean(
  domain?: RecommenderDomain
): string {
  const roles = domain
    ? getRecommenderRolesByDomain(domain)
    : recommenderRoles;

  const keywords = Array.from(
    new Set(
      roles.flatMap((role) => role.keywords)
    )
  );

  return `(${keywords.map((keyword) => `"${keyword}"`).join(" OR ")})`;
}