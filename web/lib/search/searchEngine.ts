import { SearchResult } from "@/types/search";
import { getAllKnowledgeTopics } from "@/data/recruiterKnowledge";
import { getAllCompanies } from "@/lib/atlas/companyService";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";

export function searchAtlas(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();

  if (!q) return [];

  const results: SearchResult[] = [];

  // Companies
  getAllCompanies().forEach((company) => {
    if (
      company.name.toLowerCase().includes(q) ||
      company.aliases.some((a) => a.toLowerCase().includes(q))
    ) {
      results.push({
        id: company.id,
        title: company.name,
        subtitle: company.companyType,
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