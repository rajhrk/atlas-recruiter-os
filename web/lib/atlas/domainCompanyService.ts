import {
  getAllCompanies,
} from "@/lib/atlas/companyService";

import {
  DOMAIN_COMPANY_SEEDS,
} from "@/lib/atlas/domainCompanies";

import {
  getCompanyTalentDomains,
} from "@/lib/atlas/companyTalentDomains";

import type {
  TalentDomainId,
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
