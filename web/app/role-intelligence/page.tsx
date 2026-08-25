"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { atlasRoles } from "@/data/atlas/roles";
import { TALENT_DOMAINS } from "@/lib/atlas/talentDomains";
import { useAtlas } from "@/context/AtlasContext";

import InfoCard from "@/components/atlas/InfoCard";
import CopyButton from "@/components/atlas/CopyButton";
import SearchParamsBoundary from "@/components/atlas/SearchParamsBoundary";
import AtlasHeader from "@/components/atlas/AtlasHeader";

function RoleIntelligenceContent() {
  const searchParams = useSearchParams();
  const { selectedDomain, selectedRole, setSelectedRole } = useAtlas();

  const domain = TALENT_DOMAINS.find((item) => item.id === selectedDomain)!;

  const domainAtlasRoles = useMemo(
    () => atlasRoles.filter((role) => domain.roles.includes(role.role as never)),
    [domain],
  );

  const availableRoles = useMemo(
    () => Array.from(new Set([...domain.roles, ...domainAtlasRoles.map((role) => role.role)])),
    [domain, domainAtlasRoles],
  );

  const [localRole, setLocalRole] = useState(selectedRole);

  useEffect(() => {
    const roleName = searchParams.get("role");
    const nextRole = roleName && availableRoles.includes(roleName)
      ? roleName
      : availableRoles.includes(selectedRole)
        ? selectedRole
        : domain.defaultRole;

    setLocalRole(nextRole);
    setSelectedRole(nextRole);
  }, [searchParams, availableRoles, selectedRole, domain.defaultRole, setSelectedRole]);

  const role = atlasRoles.find(
    (item) => item.role.toLowerCase() === localRole.toLowerCase(),
  );

  const isConfiguredRole = Boolean(role);
  const preview = domain.preview;

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-8">
      <AtlasHeader
        title={`${domain.label} Role Intelligence`}
        description={`Recruiter intelligence for ${domain.label.toLowerCase()} talent.`}
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-blue-600">
              {domain.icon} {domain.label}
            </div>
            <h2 className="mt-2 text-3xl font-bold">{localRole}</h2>
          </div>

          <div className="w-full md:w-80">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={localRole}
              onChange={(event) => {
                setLocalRole(event.target.value);
                setSelectedRole(event.target.value);
              }}
              className="mt-2 w-full rounded-lg border bg-white px-3 py-3 text-sm"
            >
              {availableRoles.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard title="🏢 Target Companies" items={role?.targetCompanies ?? preview.targetCompanies} />
        <InfoCard title="🛠 Core Skills" items={role?.coreSkills ?? preview.coreSkills} />
        <InfoCard title="🏆 Certifications" items={role?.certifications ?? preview.certifications} />
        <InfoCard title="🎤 Conferences" items={role?.conferences ?? preview.conferences} />
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">🔍 Boolean Search</h3>
          {role && <CopyButton text={role.booleanSearch} />}
        </div>
        <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-sm">
          {role?.booleanSearch ?? `(${availableRoles.map((item) => `"${item}"`).join(" OR ")})`}
        </pre>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">🤖 AI Recruiter Prompt</h3>
          {role && <CopyButton text={role.aiPrompt} />}
        </div>
        <p className="rounded-lg bg-slate-50 p-4">
          {role?.aiPrompt ?? `Build a sourcing strategy for ${localRole} candidates in the ${domain.label} talent domain.`}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">📝 Recruiter Notes</h3>
        <p>{role?.recruiterNotes ?? preview.notes}</p>
        {!isConfiguredRole && (
          <p className="mt-3 text-sm text-slate-500">
            This role is part of the new domain taxonomy. Detailed role intelligence will be populated as Phase 2 domain knowledge is expanded.
          </p>
        )}
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
