import { AtlasRole } from "@/data/atlas/roles";
import { companyAliases } from "@/data/atlas/companyAliases";

export type SearchMode =
  | "standard"
  | "google";

export interface BooleanOptions {
  role: AtlasRole;
  searchMode?: SearchMode;
  location?: string;
  selectedCompanies?: string[];
  selectedSkills?: string[];
  selectedCertifications?: string[];
}

function quoteIfNeeded(value: string): string {
  return value.includes(" ") ? `"${value}"` : value;
}

function buildGroup(values: string[]): string {
  if (values.length === 0) return "";

  return `(${values
    .map(quoteIfNeeded)
    .join(" OR ")})`;
}

function expandCompany(company: string): string {
  const aliases = companyAliases[company];

  if (!aliases || aliases.length === 0) {
    return quoteIfNeeded(company);
  }

  return `(${aliases
    .map(quoteIfNeeded)
    .join(" OR ")})`;
}

export function generateBoolean({
  role,
  searchMode = "standard",
  location,
  selectedCompanies = [],
  selectedSkills = [],
  selectedCertifications = [],
}: BooleanOptions): string {

  const parts: string[] = [];

  // Google X-Ray
  if (searchMode === "google") {
    parts.push("site:linkedin.com/in");
  }

  // Role Boolean
  if (role.booleanSearch) {
    parts.push(role.booleanSearch);
  }

  // Companies
  if (selectedCompanies.length > 0) {
    parts.push(
      selectedCompanies
        .map(expandCompany)
        .join(" OR ")
    );
  }

  // Skills
  if (selectedSkills.length > 0) {
    parts.push(buildGroup(selectedSkills));
  }

  // Certifications
  if (selectedCertifications.length > 0) {
    parts.push(buildGroup(selectedCertifications));
  }

  // Location
  if (location?.trim()) {
    parts.push(buildGroup([location.trim()]));
  }

  return parts.join("\n\nAND\n\n");
}