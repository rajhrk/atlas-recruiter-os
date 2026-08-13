import { companyMaster } from "@/data/atlas/companyMaster";
import { atlasRoles } from "@/data/atlas/roles";

export function getRolesForCompany(companyName: string) {
  const company = companyMaster.find(
    (item) =>
      item.name.toLowerCase() === companyName.toLowerCase() ||
      item.aliases.some(
        (alias) =>
          alias.toLowerCase() === companyName.toLowerCase()
      )
  );

  if (!company) {
    return [];
  }

  const companyNames = [
    company.name,
    ...company.aliases,
  ].map((name) => name.toLowerCase());

  return atlasRoles.filter((role) =>
    role.targetCompanies.some((target) =>
      companyNames.includes(target.toLowerCase())
    )
  );
}