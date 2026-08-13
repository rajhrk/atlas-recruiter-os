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
  category: company.companyType,
  type: "company",
  href: `/company-intelligence/${company.id}`,
}));

  const roles: SearchResult[] = atlasRoles.map((role) => ({
  id: role.roleId,
  title: role.role,
  subtitle: "Role",
  category: "Role",
  type: "role",
  href: `/hiring-guides/${role.roleId}`,
}));

  const skills: SearchResult[] = atlasSkills.map((skill) => ({
  id: skill.skillId,
  title: skill.skill,
  subtitle: `${skill.division} • ${skill.specialization}`,
  category: "Skill",
  type: "skill",
  href: `/skills/${skill.skillId}`,
}));

  const certifications: SearchResult[] =
  atlasCertifications.map((certification) => ({
    id: certification.certification,
    title: certification.certification,
    subtitle: "Certification",
    category: "Certification",
    type: "certification",
    href: `/certifications/${certification.certification}`,
  }));

  return [
    ...companies,
    ...roles,
    ...skills,
    ...certifications,
  ];
}