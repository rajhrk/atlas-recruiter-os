// lib/atlas/relationshipService.ts

import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";
import { companyMaster } from "@/data/atlas/companyMaster";

export function getRole(roleId: string) {
  return atlasRoles.find((r) => r.roleId === roleId);
}

export function getCompany(companyId: string) {
  return companyMaster.find(
    (c) => c.id.toLowerCase() === companyId.toLowerCase()
  );
}

export function getSkill(skillName: string) {
  return atlasSkills.find(
    (s) =>
      s.skill.toLowerCase() === skillName.toLowerCase()
  );
}

export function getCertification(certification: string) {
  return atlasCertifications.find(
    (c) =>
      c.certification.toLowerCase() ===
      certification.toLowerCase()
  );
}

export function getRolesByCompany(companyName: string) {
  return atlasRoles.filter((role) =>
    role.targetCompanies.some(
      (company) =>
        company.toLowerCase() ===
        companyName.toLowerCase()
    )
  );
}

export function getCompaniesByRole(roleId: string) {
  const role = getRole(roleId);

  if (!role) return [];

  return companyMaster.filter((company) =>
    role.targetCompanies.includes(company.name)
  );
}

export function getSkillsByRole(roleId: string) {
  const role = getRole(roleId);

  if (!role) return [];

  return atlasSkills.filter((skill) =>
    role.coreSkills.some(
      (s) =>
        s.toLowerCase() ===
        skill.skill.toLowerCase()
    )
  );
}

export function getCertificationsByRole(
  roleId: string
) {
  const role = getRole(roleId);

  if (!role) return [];

  return atlasCertifications.filter((cert) =>
    role.certifications.some(
      (c) =>
        c.toLowerCase() ===
        cert.certification.toLowerCase()
    )
  );
}

export function getConferencesByRole(
  roleId: string
) {
  const role = getRole(roleId);

  if (!role) return [];

  return role.conferences;
}

export function getRolesBySkill(
  skillName: string
) {
  return atlasRoles.filter((role) =>
    role.coreSkills.some(
      (skill) =>
        skill.toLowerCase() ===
        skillName.toLowerCase()
    )
  );
}

export function getCompaniesBySkill(
  skillName: string
) {
  const roles = getRolesBySkill(skillName);

  const companies = new Map();

  roles.forEach((role) => {
    role.targetCompanies.forEach((company) => {
      const c = companyMaster.find(
        (item) => item.name === company
      );

      if (c) companies.set(c.id, c);
    });
  });

  return [...companies.values()];
}

export function getCertificationsBySkill(
  skillName: string
) {
  const roles = getRolesBySkill(skillName);

  const certs = new Map();

  roles.forEach((role) => {
    role.certifications.forEach((cert) => {
      const c = atlasCertifications.find(
        (item) =>
          item.certification === cert
      );

      if (c)
        certs.set(c.certification, c);
    });
  });

  return [...certs.values()];
}

export function getRolesByCertification(
  certification: string
) {
  return atlasRoles.filter((role) =>
    role.certifications.some(
      (cert) =>
        cert.toLowerCase() ===
        certification.toLowerCase()
    )
  );
}

export function getCompaniesByCertification(
  certification: string
) {
  const roles =
    getRolesByCertification(certification);

  const companies = new Map();

  roles.forEach((role) => {
    role.targetCompanies.forEach((company) => {
      const c = companyMaster.find(
        (item) => item.name === company
      );

      if (c) companies.set(c.id, c);
    });
  });

  return [...companies.values()];
}

export function getRolesByConference(
  conference: string
) {
  return atlasRoles.filter((role) =>
    role.conferences.some(
      (conf) =>
        conf.toLowerCase() ===
        conference.toLowerCase()
    )
  );
}

export function getCompaniesByConference(
  conference: string
) {
  const roles =
    getRolesByConference(conference);

  const companies = new Map();

  roles.forEach((role) => {
    role.targetCompanies.forEach((company) => {
      const c = companyMaster.find(
        (item) => item.name === company
      );

      if (c) companies.set(c.id, c);
    });
  });

  return [...companies.values()];
}

export function getSimilarRoles(
  roleId: string
) {
  const role = getRole(roleId);

  if (!role) return [];

  return atlasRoles
    .filter((r) => r.roleId !== roleId)
    .map((candidate) => {
      const score =
        candidate.coreSkills.filter((skill) =>
          role.coreSkills.includes(skill)
        ).length;

      return {
        role: candidate,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.role);
}