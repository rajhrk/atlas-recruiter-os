"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CompanyStats from "@/components/company/CompanyStats";
import CompanyTypeBreakdown from "@/components/company/CompanyTypeBreakdown";
import DomainLandscape from "@/components/company/DomainLandscape";
import CompanyRegionBreakdown from "@/components/company/CompanyRegionBreakdown";
import CompanyPriorityBreakdown from "@/components/company/CompanyPriorityBreakdown";
import TechnologyBreakdown from "@/components/company/TechnologyBreakdown";
import VendorBreakdown from "@/components/company/VendorBreakdown";
import CertificationBreakdown from "@/components/company/CertificationBreakdown";
import RoleBreakdown from "@/components/company/RoleBreakdown";

import CompanyCard from "@/components/company/CompanyCard";
import CompanyFilters from "@/components/company/CompanyFilters";
import CompanySearch from "@/components/company/CompanySearch";
import RegionFilter from "@/components/company/RegionFilter";
import PriorityFilter from "@/components/company/PriorityFilter";
import DataCenterTypeFilter from "@/components/company/DataCenterTypeFilter";

import {
  getUnifiedCompaniesForTalentDomain,
} from "@/lib/atlas/domainCompanyService";
import { TALENT_DOMAINS } from "@/lib/atlas/talentDomains";
import { useAtlas } from "@/context/AtlasContext";

export default function CompanyDirectoryPage() {
  const {
    selectedDomain,
  } = useAtlas();

  const companies =
    getUnifiedCompaniesForTalentDomain(
      selectedDomain,
    ).map(
      (entry) => entry.company,
    );

  const domain =
    TALENT_DOMAINS.find(
      (item) => item.id === selectedDomain,
    )!;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [region, setRegion] = useState("All");
  const [priority, setPriority] = useState("All");
  const [dataCenterType, setDataCenterType] = useState("All");

  useEffect(() => {
    if (selectedDomain !== "data-center") {
      setDataCenterType("All");
    }
  }, [selectedDomain]);

  const companyTypes = useMemo(() => {
    return Array.from(
      new Set(
        companies
          .map((company) => company.companyType)
          .filter(Boolean)
      )
    ).sort();
  }, [companies]);

  const priorities = useMemo(() => {
    return Array.from(
      new Set(
        companies
          .map((company) => company.priority)
          .filter(Boolean)
      )
    ).sort();
  }, [companies]);

  const dataCenterTypes = useMemo(() => {
    return Array.from(
      new Set(
        companies.flatMap(
          (company) => company.dataCenterTypes
        )
      )
    ).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        !normalizedSearch ||
        company.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        company.aliases.some((alias) =>
          alias
            .toLowerCase()
            .includes(normalizedSearch)
        );

      const matchesFilter =
        filter === "All" ||
        company.companyType === filter;

      /*
       * Region is maintained as a string because the
       * RegionFilter component currently returns a string.
       *
       * Cast only at the boundary where the strongly typed
       * company region arrays are checked.
       */
      const matchesRegion =
        region === "All" ||
        company.regions.includes(
          region as (typeof company.regions)[number]
        ) ||
        company.dataCenterPresence.includes(
          region as (typeof company.dataCenterPresence)[number]
        );

      const matchesPriority =
        priority === "All" ||
        company.priority === priority;

      const matchesDataCenterType =
        dataCenterType === "All" ||
        company.dataCenterTypes.includes(
          dataCenterType as (typeof company.dataCenterTypes)[number]
        );

      return (
        matchesSearch &&
        matchesFilter &&
        matchesRegion &&
        matchesPriority &&
        matchesDataCenterType
      );
    });
  }, [
    companies,
    search,
    filter,
    region,
    priority,
    dataCenterType,
  ]);

  return (
    <main className="space-y-10">

      {/* Header */}

      <div>
        <div className="text-sm font-medium text-blue-600">
          ATLAS INTELLIGENCE
        </div>

        <h1 className="mt-2 text-4xl font-bold">
          {domain.icon} {domain.label} Company Intelligence
        </h1>

        <p className="mt-2 max-w-3xl text-lg text-slate-600">
          {domain.preview.notes}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {domain.preview.targetCompanies.map((company) => (
            <span
              key={company}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Search */}

      <CompanySearch
        value={search}
        onChange={setSearch}
      />

      {/* Filters */}

      <div className="space-y-4">

        <CompanyFilters
          selected={filter}
          onSelect={setFilter}
          options={companyTypes}
        />

        {selectedDomain === "data-center" && (
          <DataCenterTypeFilter
            selected={dataCenterType}
            onSelect={setDataCenterType}
            options={dataCenterTypes}
          />
        )}

        <RegionFilter
          selected={region}
          onSelect={setRegion}
        />

        <PriorityFilter
          selected={priority}
          onSelect={setPriority}
          options={priorities}
        />

      </div>

      {/* Core Statistics */}

      <CompanyStats
        companies={companies}
        filtered={filteredCompanies.length}
      />

      {/* Company Landscape */}

      <CompanyTypeBreakdown
        companies={companies}
      />

      {/* Domain Landscape */}

      <DomainLandscape
        companies={companies}
        domainLabel={domain.label}
        signalLabel={
          selectedDomain === "data-center"
            ? "Data center infrastructure types"
            : "Core technologies"
        }
        useDataCenterTypes={
          selectedDomain === "data-center"
        }
      />

      {/* Regional Coverage */}

      <CompanyRegionBreakdown
        companies={companies}
      />

      {/* Recruiter Priority */}

      <CompanyPriorityBreakdown
        companies={companies}
      />

      {/* Technology Intelligence */}

      <TechnologyBreakdown
        companies={companies}
      />

      {/* Vendor Intelligence */}

      <VendorBreakdown
        companies={companies}
      />

      {/* Certification Intelligence */}

      <CertificationBreakdown
        companies={companies}
      />

      {/* Role Intelligence */}

      <RoleBreakdown
        companies={companies}
      />

      {/* Company Directory */}

      <section>

        <div className="mb-6 flex items-end justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              {domain.label} Company Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredCompanies.length} of{" "}
              {companies.length} companies
            </p>
          </div>

          {(search ||
            filter !== "All" ||
            region !== "All" ||
            priority !== "All" ||
            dataCenterType !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("All");
                setRegion("All");
                setPriority("All");
                setDataCenterType("All");
              }}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Clear Filters
            </button>
          )}

        </div>

        {filteredCompanies.length === 0 ? (

          <div className="rounded-xl border bg-white p-12 text-center">

            <h3 className="text-xl font-semibold">
              No companies found
            </h3>

            <p className="mt-2 text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
              />
            ))}

          </div>

        )}

      </section>

    </main>
  );
}