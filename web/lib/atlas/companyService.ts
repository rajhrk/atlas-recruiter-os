import { companyMaster } from "@/data/atlas/companyMaster";
import { AtlasCompany } from "@/types/company";

export function getAllCompanies(): AtlasCompany[] {
  return companyMaster;
}

export function getCompanyById(id: string): AtlasCompany | undefined {
  return companyMaster.find(
    (company) => company.id.toLowerCase() === id.toLowerCase()
  );
}

export function getCompanyByName(name: string): AtlasCompany | undefined {
  const search = name.toLowerCase();

  return companyMaster.find(
    (company) =>
      company.name.toLowerCase() === search ||
      company.aliases.some((alias) => alias.toLowerCase() === search)
  );
}

export function searchCompanies(query: string): AtlasCompany[] {
  const search = query.trim().toLowerCase();

  if (!search) {
    return companyMaster;
  }

  return companyMaster.filter(
    (company) =>
      company.name.toLowerCase().includes(search) ||
      company.aliases.some((alias) => alias.toLowerCase().includes(search))
  );
}

export function getCompaniesByType(
  companyType: AtlasCompany["companyType"]
): AtlasCompany[] {
  return companyMaster.filter(
    (company) => company.companyType === companyType
  );
}