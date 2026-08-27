import { SearchResult } from "@/types/search";
import { getAllKnowledgeTopics } from "@/data/recruiterKnowledge";
import { getAllCompanies } from "@/lib/atlas/companyService";
import {
  getUnifiedCompaniesForTalentDomain,
} from "@/lib/atlas/domainCompanyService";
import type { TalentDomainId } from "@/lib/atlas/talentDomains";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";

export function searchAtlas(
  query: string,
  domainId?: TalentDomainId,
): SearchResult[] {
  const q = query.trim().toLowerCase();

  if (!q) return [];

  const results: SearchResult[] = [];

  // Companies
  //
  // Recruiter Search is domain-scoped. The homepage remains
  // global when no domainId is supplied.
  const companies = domainId
    ? getUnifiedCompaniesForTalentDomain(domainId)
    : getAllCompanies().map((company) => ({
        company,
        talentDomains: [],
        curated: false,
      }));

  companies.forEach((entry) => {
    const company = entry.company;

    if (
      company.name.toLowerCase().includes(q) ||
      company.aliases.some((a) => a.toLowerCase().includes(q))
    ) {
      results.push({
        id: company.id,
        title: company.name,
        subtitle: domainId
          ? domainId === "data-center"
            ? company.companyType
            : domainId === "ai-ml"
              ? "AI/ML"
              : domainId === "software"
                ? "Software"
                : domainId === "robotics"
                  ? "Robotics"
                  : "Hardware"
          : company.companyType,
        type: "company",
        href: `/company/${company.id}`,
      });
    }
  });

  // Roles
  atlasRoles.forEach((role) => {
    if (role.role.toLowerCase().includes(q)) {
      results.push({
        id: role.roleId,
        title: role.role,
        subtitle: "Role",
        type: "role",
        href: `/role/${role.roleId}`,
      });
    }
  });

  // Skills
  atlasSkills.forEach((skill) => {
    if (skill.skill.toLowerCase().includes(q)) {
      results.push({
        id: skill.skillId,
        title: skill.skill,
        subtitle: "Skill",
        type: "skill",
       href: `/skills/${encodeURIComponent(skill.skill)}`,
      });
    }
  });

  // Certifications
  atlasCertifications.forEach((cert) => {
    if (cert.certification.toLowerCase().includes(q)) {
      results.push({
  id: cert.certification,
  title: cert.certification,
  subtitle: cert.issuingOrganization,
  type: "certification",
 href: `/certifications/${encodeURIComponent(
  cert.certification
)}`,
});
    }
  });
// Recruiter Knowledge
getAllKnowledgeTopics().forEach((topic) => {
  if (
    topic.title.toLowerCase().includes(q) ||
    topic.id.toLowerCase().includes(q)
  ) {
    results.push({
      id: topic.id,
      title: topic.title,
      subtitle: topic.category,
      type: "knowledge",
      href: `/recruiter-knowledge/${topic.id}`,
    });
  }
});
  return results.sort((a, b) => a.title.localeCompare(b.title));
}