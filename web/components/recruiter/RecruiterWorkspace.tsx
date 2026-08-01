"use client";

import { useState } from "react";

import RecruiterFilters from "./RecruiterFilters";
import WorkspaceTabs from "./WorkspaceTabs";

import { RecruiterSearchRequest } from "@/types/recruiter";
import { getRoleIntelligence } from "@/lib/intelligence/roleIntelligence";

export default function RecruiterWorkspace() {
  const [search, setSearch] =
    useState<RecruiterSearchRequest | null>(null);

  const intelligence = search
    ? getRoleIntelligence(search.role)
    : null;

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="text-4xl font-bold">
        Recruiter Workspace
      </h1>

      <p className="mt-2 text-slate-500">
        AI-powered talent intelligence for recruiters.
      </p>

      <div className="mt-8">
        <RecruiterFilters onGenerate={setSearch} />
      </div>

      <WorkspaceTabs />

      {!intelligence && (
        <div className="mt-8 rounded-xl border border-dashed bg-slate-50 p-12 text-center">
          <h2 className="text-2xl font-semibold">
            Ready to Generate Intelligence
          </h2>

          <p className="mt-3 text-slate-500">
            Select a role above and click
            <strong> Generate Intelligence</strong>.
          </p>
        </div>
      )}

      {intelligence && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StatCard
              title="Companies"
              value={intelligence.companies.length}
            />

            <StatCard
              title="Skills"
              value={intelligence.skills.length}
            />

            <StatCard
              title="Certifications"
              value={intelligence.certifications.length}
            />

            <StatCard
              title="Conferences"
              value={intelligence.conferences.length}
            />
          </div>

          <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">
              {intelligence.role}
            </h2>

            <p className="mt-3 text-slate-600">
              {intelligence.overview}
            </p>

            <Section
              title="🏢 Companies"
              items={intelligence.companies}
              color="bg-blue-100"
            />

            <Section
              title="🧠 Skills"
              items={intelligence.skills}
              color="bg-green-100"
            />

            <Section
              title="🎓 Certifications"
              items={intelligence.certifications}
              color="bg-purple-100"
            />

            <Section
              title="🎤 Conferences"
              items={intelligence.conferences}
              color="bg-orange-100"
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
      <div className="text-3xl font-bold">{value}</div>

      <div className="mt-2 text-sm text-slate-500">
        {title}
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-sm ${color}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}