"use client";

import { AtlasRole } from "@/data/atlas/roles";
import { RecruiterSearchRequest } from "@/types/recruiter";

interface IntelligenceReportProps {
  role: AtlasRole;
  search: RecruiterSearchRequest;
}

export default function IntelligenceReport({
  role,
  search,
}: IntelligenceReportProps) {
  return (
    <section className="space-y-6">

      {/* Header */}

      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <div className="text-sm font-medium text-blue-600">
          ATLAS RECRUITER INTELLIGENCE
        </div>

        <h2 className="mt-2 text-3xl font-bold">
          {role.role}
        </h2>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Domain: {search.domain}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1">
            Location: {search.location}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1">
            Seniority: {search.seniority}
          </span>

          {search.company && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Company: {search.company}
            </span>
          )}
        </div>
      </div>

      {/* Target Companies */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Target Companies
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {role.targetCompanies.map((company) => (
            <span
              key={company}
              className="rounded-full border bg-slate-50 px-3 py-2 text-sm"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Core Skills */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Core Skills
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {role.coreSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border bg-blue-50 px-3 py-2 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Certifications
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {role.certifications.map((certification) => (
            <span
              key={certification}
              className="rounded-full border bg-green-50 px-3 py-2 text-sm"
            >
              {certification}
            </span>
          ))}
        </div>
      </div>

      {/* Conferences */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Conferences & Talent Sources
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {role.conferences.map((conference) => (
            <span
              key={conference}
              className="rounded-full border bg-purple-50 px-3 py-2 text-sm"
            >
              {conference}
            </span>
          ))}
        </div>
      </div>

      {/* Boolean Search */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Boolean Search
        </h3>

        <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-white">
          {role.booleanSearch}
        </pre>
      </div>

      {/* AI Prompt */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          AI Sourcing Prompt
        </h3>

        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {role.aiPrompt}
        </div>
      </div>

      {/* Recruiter Notes */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Recruiter Notes
        </h3>

        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-slate-700">
          {role.recruiterNotes}
        </div>
      </div>

    </section>
  );
}