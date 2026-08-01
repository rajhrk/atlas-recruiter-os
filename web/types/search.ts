export type SearchType =
  | "company"
  | "role"
  | "skill"
  | "certification";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: SearchType;
  href: string;
}