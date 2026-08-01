import { getAllCompanies } from "@/lib/atlas/companyService";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";

import { SearchResult } from "@/types/search";

export function buildSearchIndex(): SearchResult[] {
  const companies: SearchResult[] = getAllCompanies().map((company) => ({
    id: company.id,
    title: company.name,
    subtitle: company.companyType,
    category: "company",
    href: `/company-intelligence?company=${encodeURIComponent(
      company.name
    )}`,
  }));

  const roles: SearchResult[] = atlasRoles.map((role) => ({
    id: role.roleId,
    title: role.role,
    subtitle: "Role",
    category: "role",
    href: `/role-intelligence?role=${encodeURIComponent(
      role.role
    )}`,
  }));

  const skills: SearchResult[] = atlasSkills.map((skill) => ({
    id: skill.skillId,
    title: skill.skill,
    subtitle: `${skill.division} • ${skill.specialization}`,
    category: "skill",
    href: `/skills-intelligence?skill=${encodeURIComponent(
      skill.skill
    )}`,
  }));

  const certifications: SearchResult[] =
    atlasCertifications.map((certification) => ({
      id: certification.certification,
      title: certification.certification,
      subtitle: certification.issuingOrganization,
      category: "certification",
      href: `/certification-intelligence?cert=${encodeURIComponent(
        certification.certification
      )}`,
    }));

  return [
    ...companies,
    ...roles,
    ...skills,
    ...certifications,
  ];
}