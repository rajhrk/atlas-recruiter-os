import {
  getAllCompanies,
} from "@/lib/atlas/companyService";

import {
  DOMAIN_COMPANY_SEEDS,
} from "@/lib/atlas/domainCompanies";

import {
  getCompanyTalentDomains,
} from "@/lib/atlas/companyTalentDomains";

import {
  TALENT_DOMAINS,
  type TalentDomainId,
} from "@/lib/atlas/talentDomains";

import type {
  AtlasCompany,
} from "@/types/company";

export interface AtlasDomainCompany {
  company: AtlasCompany;
  talentDomains: TalentDomainId[];
  curated: boolean;
}

function normalizeCompanyName(
  value: string,
): string {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      "",
    );
}

/**
 * Create a minimal Atlas company record for a curated
 * domain company that does not yet exist in companyMaster.
 *
 * These records are intentionally lightweight. They can later
 * be enriched by Company Intelligence.
 */
function createCuratedCompany(
  seed: (typeof DOMAIN_COMPANY_SEEDS)[number],
): AtlasCompany {
  const id =
    `domain:${normalizeCompanyName(seed.name)}`;

  return {
    id,
    name: seed.name,
    aliases: seed.aliases ?? [],
    companyType: "Enterprise",
    priority: "Tier 2",
    categoryIds: [],
    headquarters: "",
    regions: ["Global"],
    dataCenterPresence: [],
    dataCenterTypes: [],
    website: "",
    coreTechnologies: [],
    strategicVendors: [],
    roles: [],
    certifications: [],
    aiPrompt: "",
    recruiterNotes:
      "Curated talent-domain company. Enrich through Company Intelligence.",
  };
}

/**
 * Find a company-master record matching a domain seed.
 */
function findExistingCompany(
  companies: AtlasCompany[],
  seed: (typeof DOMAIN_COMPANY_SEEDS)[number],
): AtlasCompany | undefined {
  const names = [
    seed.name,
    ...(seed.aliases ?? []),
  ];

  return companies.find(
    (company) => {
      const companyNames = [
        company.name,
        ...company.aliases,
      ];

      return companyNames.some(
        (companyName) =>
          names.some(
            (seedName) =>
              normalizeCompanyName(
                companyName,
              ) ===
              normalizeCompanyName(
                seedName,
              ),
          ),
      );
    },
  );
}

/**
 * Build the unified Atlas company universe.
 *
 * Existing company-master records remain authoritative.
 * Curated domain seeds enrich existing companies and create
 * lightweight records for companies not yet present.
 */
export function getUnifiedDomainCompanies(): AtlasDomainCompany[] {
  const existingCompanies =
    getAllCompanies();

  const results: AtlasDomainCompany[] =
    existingCompanies.map(
      (company) => {
        const seed =
          DOMAIN_COMPANY_SEEDS.find(
            (candidate) =>
              findExistingCompany(
                [company],
                candidate,
              ) !== undefined,
          );

        const inferredDomains =
          getCompanyTalentDomains(
            company,
          );

        const curatedDomains =
          seed?.domains ?? [];

        return {
          company,
          talentDomains:
            Array.from(
              new Set([
                ...inferredDomains,
                ...curatedDomains,
              ]),
            ),
          curated:
            Boolean(seed),
        };
      },
    );

  /*
   * Add curated companies that are not already
   * represented in companyMaster.
   */
  for (
    const seed of DOMAIN_COMPANY_SEEDS
  ) {
    const existing =
      findExistingCompany(
        existingCompanies,
        seed,
      );

    if (existing) {
      continue;
    }

    results.push({
      company:
        createCuratedCompany(seed),

      talentDomains:
        Array.from(
          new Set(
            seed.domains,
          ),
        ),

      curated: true,
    });
  }

  return results;
}

/**
 * Return companies relevant to a selected Atlas talent domain.
 */
export function getUnifiedCompaniesForTalentDomain(
  domainId: TalentDomainId,
): AtlasDomainCompany[] {
  return getUnifiedDomainCompanies().filter(
    (entry) =>
      entry.talentDomains.includes(
        domainId,
      ),
  );
}

/**
 * Return the recruiter-facing company classification for a
 * selected talent domain.
 *
 * The global companyType remains authoritative for the company
 * itself. This function determines how the company should be
 * presented inside a domain-scoped recruiter workflow.
 *
 * Data Center intentionally preserves the existing companyType
 * because classifications such as Hyperscaler and Colocation
 * Provider are meaningful specifically in that domain.
 *
 * Other domains use their canonical talent-domain label rather
 * than leaking Data Center classifications such as Hyperscaler.
 */
export function getCompanyTalentClassification(
  company: AtlasCompany,
  domainId: TalentDomainId,
): string {
  if (domainId === "data-center") {
    return company.companyType;
  }

  const domain = TALENT_DOMAINS.find(
    (item) => item.id === domainId,
  );

  return domain?.label ?? "Company";
}

/**
 * Find a company in the unified Atlas company universe.
 */
export function getUnifiedCompanyByName(
  name: string,
): AtlasDomainCompany | undefined {
  const normalized =
    normalizeCompanyName(name);

  return getUnifiedDomainCompanies().find(
    (entry) => {
      const company =
        entry.company;

      return [
        company.name,
        ...company.aliases,
      ].some(
        (candidate) =>
          normalizeCompanyName(
            candidate,
          ) === normalized,
      );
    },
  );
}
