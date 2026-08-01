import { companyMaster } from "@/data/atlas/companyMaster";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";
import { atlasRoleSkillMap } from "@/data/atlas/roleSkillMap";

export const AtlasService = {
  // ==========================================
  // Companies
  // ==========================================

  getCompanies() {
    return companyMaster;
  },

  getCompany(name: string) {
    return companyMaster.find(
      (company) => company.name.toLowerCase() === name.toLowerCase()
    );
  },

  // ==========================================
  // Roles
  // ==========================================

  getRoles() {
    return atlasRoles;
  },

  getRole(name: string) {
    return atlasRoles.find(
      (role) => role.role.toLowerCase() === name.toLowerCase()
    );
  },

  getRoleByName(name: string) {
    return this.getRole(name);
  },

  // ==========================================
  // Skills
  // ==========================================

  getSkills() {
    return atlasSkills;
  },

  getSkill(name: string) {
    return atlasSkills.find(
      (skill) => skill.skill.toLowerCase() === name.toLowerCase()
    );
  },

  getSkillsForRole(roleName: string) {
    return atlasRoleSkillMap.filter(
      (item) => item.role.toLowerCase() === roleName.toLowerCase()
    );
  },

  // ==========================================
  // Certifications
  // ==========================================

  getCertifications() {
    return atlasCertifications;
  },

  getCertification(name: string) {
    return atlasCertifications.find(
      (certification) =>
        certification.certification.toLowerCase() === name.toLowerCase()
    );
  },

  // ==========================================
  // Dashboard
  // ==========================================

  getCounts() {
    return {
      companies: companyMaster.length,
      roles: atlasRoles.length,
      skills: atlasSkills.length,
      certifications: atlasCertifications.length,
    };
  },

  // ==========================================
  // Universal Search
  // ==========================================

  search(query: string) {
    const q = query.trim().toLowerCase();

    if (!q) {
      return {
        companies: [],
        roles: [],
        skills: [],
        certifications: [],
      };
    }

    return {
      companies: companyMaster.filter((company) =>
        company.name.toLowerCase().includes(q)
      ),

      roles: atlasRoles.filter((role) =>
        role.role.toLowerCase().includes(q)
      ),

      skills: atlasSkills.filter((skill) =>
        skill.skill.toLowerCase().includes(q)
      ),

      certifications: atlasCertifications.filter((certification) =>
        certification.certification.toLowerCase().includes(q)
      ),
    };
  },

  searchAtlas(query: string) {
    return this.search(query);
  },

  // ==========================================
  // Quick Lists
  // ==========================================

  getCompanyNames() {
    return companyMaster.map((company) => company.name);
  },

  getRoleNames() {
    return atlasRoles.map((role) => role.role);
  },

  getSkillNames() {
    return atlasSkills.map((skill) => skill.skill);
  },

  getCertificationNames() {
    return atlasCertifications.map(
      (certification) => certification.certification
    );
  },
};

// ==========================================
// Compatibility Exports
// ==========================================

export const getAllCompanies = () => AtlasService.getCompanies();

export const getCompany = (name: string) =>
  AtlasService.getCompany(name);

export const getAllRoles = () => AtlasService.getRoles();

export const getRole = (name: string) =>
  AtlasService.getRole(name);

export const getRoleByName = (name: string) =>
  AtlasService.getRoleByName(name);

export const getAllSkills = () => AtlasService.getSkills();

export const getSkill = (name: string) =>
  AtlasService.getSkill(name);

export const getSkillsForRole = (role: string) =>
  AtlasService.getSkillsForRole(role);

export const getAllCertifications = () =>
  AtlasService.getCertifications();

export const getCertification = (name: string) =>
  AtlasService.getCertification(name);

export const universalSearch = (query: string) =>
  AtlasService.search(query);

export const searchAtlas = (query: string) =>
  AtlasService.searchAtlas(query);

export const getDashboardCounts = () =>
  AtlasService.getCounts();