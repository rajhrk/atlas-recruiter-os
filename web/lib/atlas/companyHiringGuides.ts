import { companyMaster } from "@/data/atlas/companyMaster";
import { getAllHiringGuides } from "@/data/hiringGuides";

export function getHiringGuidesForCompany(
  companyName: string
) {
  const company = companyMaster.find(
    (item) =>
      item.name.toLowerCase() ===
        companyName.toLowerCase() ||
      item.aliases.some(
        (alias) =>
          alias.toLowerCase() ===
          companyName.toLowerCase()
      )
  );

  if (!company) {
    return [];
  }

  const guides = getAllHiringGuides();

  const companyNames = [
    company.name,
    ...company.aliases,
  ].map((name) => name.toLowerCase());

  return guides.filter((guide) =>
    (guide.targetCompanies ?? []).some((target) =>
      companyNames.includes(target.toLowerCase())
    )
  );
}