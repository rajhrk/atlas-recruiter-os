// components/recruiter/RecruiterWorkspace.tsx

"use client";

import { useMemo, useState } from "react";

import RecruiterFilters from "./RecruiterFilters";
import IntelligenceReport from "./IntelligenceReport";

import { atlasRoles } from "@/data/atlas/roles";
import { RecruiterSearchRequest } from "@/types/recruiter";

export default function RecruiterWorkspace() {
  const [search, setSearch] =
    useState<RecruiterSearchRequest | null>(null);

  const selectedRole = useMemo(() => {
    if (!search) return null;

    return (
      atlasRoles.find(
        (role) =>
          role.role.toLowerCase() ===
          search.role.toLowerCase()
      ) ?? null
    );
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Recruiter Workspace
        </h1>

        <p className="mt-2 text-slate-500">
          Generate recruiter intelligence using the Atlas
          knowledge base.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <RecruiterFilters onGenerate={setSearch} />
      </div>

      {!search && (
        <div className="rounded-2xl border border-dashed bg-slate-50 p-16 text-center">
          <h2 className="text-2xl font-semibold">
            Recruiter Intelligence Report
          </h2>

          <p className="mt-3 text-slate-500">
            Select a role and click{" "}
            <strong>Generate Intelligence</strong>
            {" "}to view companies, skills,
            certifications, conferences, Boolean search,
            AI prompt and recruiter notes.
          </p>
        </div>
      )}

      {search && !selectedRole && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-semibold text-red-700">
            Role not found
          </h2>

          <p className="mt-2 text-red-600">
            The selected role does not exist in the
            Atlas Role database.
          </p>
        </div>
      )}

      {selectedRole && (
        <IntelligenceReport
          role={selectedRole}
          search={search}
        />
      )}
    </div>
  );
}