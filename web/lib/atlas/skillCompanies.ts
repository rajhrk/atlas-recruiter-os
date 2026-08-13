import { companyMaster } from "@/data/atlas/companyMaster";
import { atlasSkills } from "@/data/atlas/skills";

export function getCompaniesForSkill(skillName: string) {
  const skill = atlasSkills.find(
    (item) =>
      item.skill.toLowerCase() ===
      skillName.toLowerCase()
  );

  if (!skill) {
    return [];
  }

  const vendors = skill.relatedVendors
    .split(",")
    .map((vendor) => vendor.trim().toLowerCase())
    .filter(Boolean);

  return companyMaster.filter((company) => {
    const companyNames = [
      company.name,
      ...company.aliases,
    ].map((name) => name.toLowerCase());

    return vendors.some(
      (vendor) =>
        companyNames.includes(vendor) ||
        company.name.toLowerCase().includes(vendor) ||
        vendor.includes(company.name.toLowerCase())
    );
  });
}