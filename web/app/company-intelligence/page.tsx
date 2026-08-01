"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getAllCompanies } from "@/lib/atlas/companyService";

import AtlasHeader from "@/components/atlas/AtlasHeader";
import AtlasSection from "@/components/atlas/AtlasSection";
import SearchParamsBoundary from "@/components/atlas/SearchParamsBoundary";

import DetailCard from "@/components/atlas/DetailCard";
import InfoCard from "@/components/atlas/InfoCard";
import CopyButton from "@/components/atlas/CopyButton";

const atlasCompanies = getAllCompanies();

function CompanyIntelligenceContent() {
  const searchParams = useSearchParams();

  const [selectedId, setSelectedId] = useState(
    atlasCompanies[0]?.id ?? ""
  );

  useEffect(() => {
    const companyName = searchParams.get("company");

    if (!companyName) return;

    const company = atlasCompanies.find(
      (c) => c.name.toLowerCase() === companyName.toLowerCase()
    );

    if (company) {
      setSelectedId(company.id);
    }
  }, [searchParams]);

  const company =
    atlasCompanies.find((c) => c.id === selectedId) ??
    atlasCompanies[0];

  if (!company) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold">
          Company Intelligence
        </h1>

        <p>No companies available.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8 space-y-8">
      <AtlasHeader
        title="Company Intelligence"
        description="Recruiter intelligence for target companies."
      />

      <AtlasSection className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Select Company
          </label>

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full max-w-lg rounded-lg border p-3"
          >
            {atlasCompanies.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            {company.name}
          </h2>

          <p className="text-gray-600">
            {company.companyType}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <DetailCard
            title="HQ"
            value={company.headquarters}
          />

          <DetailCard
            title="Regions"
            value={company.regions.join(", ")}
          />

          <DetailCard
            title="Data Center Presence"
            value={company.dataCenterPresence.join(", ")}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            title="⚙️ Core Technologies"
            items={company.coreTechnologies}
          />

          <InfoCard
            title="🤝 Strategic Vendors"
            items={company.strategicVendors}
          />

          <InfoCard
            title="💼 Typical Roles"
            items={company.roles}
          />

          <InfoCard
            title="🏆 Certifications"
            items={company.certifications}
          />
        </div>

        <AtlasSection>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              🤖 AI Recruiter Prompt
            </h3>

            <CopyButton text={company.aiPrompt} />
          </div>

          <p className="rounded-lg bg-slate-50 p-4">
            {company.aiPrompt}
          </p>
        </AtlasSection>

        <AtlasSection>
          <h3 className="mb-3 text-lg font-semibold">
            📝 Recruiter Notes
          </h3>

          <p>{company.recruiterNotes}</p>
        </AtlasSection>
      </AtlasSection>
    </main>
  );
}

export default function CompanyIntelligencePage() {
  return (
    <SearchParamsBoundary>
      <CompanyIntelligenceContent />
    </SearchParamsBoundary>
  );
}