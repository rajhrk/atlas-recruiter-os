"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { atlasRoles } from "@/data/atlas/roles";

import InfoCard from "@/components/atlas/InfoCard";
import CopyButton from "@/components/atlas/CopyButton";
import SearchParamsBoundary from "@/components/atlas/SearchParamsBoundary";
import AtlasHeader from "@/components/atlas/AtlasHeader";

function RoleIntelligenceContent() {
  const searchParams = useSearchParams();

  const [selectedRoleId, setSelectedRoleId] = useState(
    atlasRoles[0]?.roleId ?? ""
  );

  useEffect(() => {
    const roleName = searchParams.get("role");

    if (!roleName) return;

    const role = atlasRoles.find(
      (r) => r.role.toLowerCase() === roleName.toLowerCase()
    );

    if (role) {
      setSelectedRoleId(role.roleId);
    }
  }, [searchParams]);

  const role =
    atlasRoles.find((r) => r.roleId === selectedRoleId) ??
    atlasRoles[0];

  if (!role) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold">
          Role Intelligence
        </h1>

        <p>No roles available.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8 space-y-8">
      <AtlasHeader
        title="Role Intelligence"
        description="Recruiter intelligence for every hiring role."
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-3xl font-bold">
            {role.role}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            title="🏢 Target Companies"
            items={role.targetCompanies}
          />

          <InfoCard
            title="🛠 Core Skills"
            items={role.coreSkills}
          />

          <InfoCard
            title="🏆 Certifications"
            items={role.certifications}
          />

          <InfoCard
            title="🎤 Conferences"
            items={role.conferences}
          />
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              🔍 Boolean Search
            </h3>

            <CopyButton text={role.booleanSearch} />
          </div>

          <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-sm">
            {role.booleanSearch}
          </pre>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              🤖 AI Recruiter Prompt
            </h3>

            <CopyButton text={role.aiPrompt} />
          </div>

          <p className="rounded-lg bg-slate-50 p-4">
            {role.aiPrompt}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">
            📝 Recruiter Notes
          </h3>

          <p>{role.recruiterNotes}</p>
        </div>
      </div>
    </main>
  );
}

export default function RoleIntelligencePage() {
  return (
    <SearchParamsBoundary>
      <RoleIntelligenceContent />
    </SearchParamsBoundary>
  );
}