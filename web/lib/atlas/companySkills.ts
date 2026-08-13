import { atlasSkills } from "@/data/atlas/skills";

export function getSkillsForCompany(companyName: string) {
  const search = companyName.toLowerCase().trim();

  return atlasSkills.filter((skill) => {
    const vendors = skill.relatedVendors
      .split(",")
      .map((vendor) => vendor.trim().toLowerCase())
      .filter(Boolean);

    return vendors.some(
      (vendor) =>
        vendor === search ||
        vendor.includes(search) ||
        search.includes(vendor)
    );
  });
}