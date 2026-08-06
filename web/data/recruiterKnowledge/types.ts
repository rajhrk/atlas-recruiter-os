export interface RecruiterKnowledgeTopic {
  id: string;
  title: string;
  category: string;
  summary: string;

  whyItMatters: string[];

  keyConcepts: string[];

  majorVendors: string[];

  majorProducts: string[];

  usedByCompanies: string[];

  relatedRoles: string[];

  relatedSkills: string[];

  relatedCertifications: string[];

  relatedConferences: string[];

  interviewQuestions: string[];

  recruiterTips: string[];

  booleanKeywords: string[];

  aiPrompt: string;

  relatedTopics: string[];
}