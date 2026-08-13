import { TalentProfile } from "@/types/technicalTalent";
import { talentProfiles } from "@/data/technicalTalent/talentProfiles";

export interface TalentSearchFilters {
  query?: string;
  domain?: string;
  role?: string;
  company?: string;
  location?: string;
  skill?: string;
  technology?: string;
  researchArea?: string;
  source?: string;
}

function matches(value: string | undefined, query: string): boolean {
  return Boolean(value && value.toLowerCase().includes(query));
}

function matchesArray(values: string[] | undefined, query: string): boolean {
  return Boolean(
    values?.some((value) => value.toLowerCase().includes(query))
  );
}

export function searchTalent(
  filters: TalentSearchFilters
): TalentProfile[] {
  const query = filters.query?.trim().toLowerCase();

  return talentProfiles.filter((talent) => {
    if (
      query &&
      ![
        talent.name,
        talent.currentCompany,
        talent.currentRole,
        ...(talent.previousCompanies ?? []),
        ...(talent.skills ?? []),
        ...(talent.technologies ?? []),
        ...(talent.researchAreas ?? []),
        ...(talent.universities ?? []),
        ...(talent.researchLabs ?? []),
        ...(talent.communities ?? []),
      ].some((value) => value?.toLowerCase().includes(query))
    ) {
      return false;
    }

    if (
      filters.domain &&
      !talent.domains.some(
        (domain) => domain.toLowerCase() === filters.domain!.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      filters.role &&
      !matches(talent.currentRole, filters.role.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.company &&
      ![
        talent.currentCompany,
        ...(talent.previousCompanies ?? []),
      ].some((company) =>
        company?.toLowerCase().includes(filters.company!.toLowerCase())
      )
    ) {
      return false;
    }

    if (
      filters.location &&
      !matchesArray(talent.locations, filters.location.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.skill &&
      !matchesArray(talent.skills, filters.skill.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.technology &&
      !matchesArray(talent.technologies, filters.technology.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.researchArea &&
      !matchesArray(
        talent.researchAreas,
        filters.researchArea.toLowerCase()
      )
    ) {
      return false;
    }

    if (
      filters.source &&
      !talent.externalProfiles?.some(
        (profile) =>
          profile.source.toLowerCase() === filters.source!.toLowerCase()
      )
    ) {
      return false;
    }

    return true;
  });
}
