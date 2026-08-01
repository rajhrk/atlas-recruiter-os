// components/recruiter/IntelligenceReport.tsx

"use client";

import { AtlasRole } from "@/data/atlas/roles";
import { RecruiterSearchRequest } from "@/types/recruiter";

import Section from "./Section";
import BadgeLink from "./BadgeLink";
import CopyButton from "./CopyButton";

import { getCompanyByName } from "@/lib/atlas/companyService";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";

interface IntelligenceReportProps {
  role: AtlasRole;
  search: RecruiterSearchRequest;
}

export default function IntelligenceReport({
  role,
  search,
}: IntelligenceReportProps) {
  return (
    <div className="space-y-8">
      <Section title="Overview">
        <div className="grid gap-6 md:grid-cols-2">
          <Info
            label="Role"
            value={role.role}
          />

          <Info
            label="Domain"
            value={search.domain}
          />

          <Info
            label="Location"
            value={search.location}
          />

          <Info
            label="Seniority"
            value={search.seniority}
          />

          <Info
            label="Company Filter"
            value={search.company || "All"}
          />
        </div>
      </Section>

      <Section title="Target Companies">
        <div className="flex flex-wrap gap-3">
          {role.targetCompanies.map((companyName) => {
            const company = getCompanyByName(companyName);

            return (
              <BadgeLink
                key={companyName}
                label={companyName}
                href={
                  company
                    ? `/company/${company.id}`
                    : "#"
                }
              />
            );
          })}
        </div>
      </Section>

      <Section title="Core Skills">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {role.coreSkills.map((skillName) => {
            const skill = atlasSkills.find(
              (s) =>
                s.skill.toLowerCase() ===
                skillName.toLowerCase()
            );

            return (
              <div
                key={skillName}
                className="rounded-xl border bg-white p-4"
              >
                <BadgeLink
                  label={skillName}
                  href={`/skills/${encodeURIComponent(
                    skillName
                  )}`}
                />

                {skill && (
                  <>
                    <p className="mt-3 text-sm text-slate-600">
                      <strong>Category:</strong>{" "}
                      {skill.category}
                    </p>

                    <p className="text-sm text-slate-600">
                      <strong>Vendor:</strong>{" "}
                      {skill.relatedVendors}
                    </p>

                    <p className="text-sm text-slate-600">
                      <strong>Priority:</strong>{" "}
                      {skill.priority}/5
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Certifications">
        <div className="grid gap-4 md:grid-cols-2">
          {role.certifications.map((certName) => {
            const cert = atlasCertifications.find(
              (c) =>
                c.certification.toLowerCase() ===
                certName.toLowerCase()
            );

            return (
              <div
                key={certName}
                className="rounded-xl border bg-white p-4"
              >
                <BadgeLink
                  label={certName}
                  href={`/certifications/${encodeURIComponent(
                    certName
                  )}`}
                />

                {cert && (
                  <>
                    <p className="mt-3 text-sm text-slate-600">
                      <strong>Organisation:</strong>{" "}
                      {cert.issuingOrganization}
                    </p>

                    <p className="text-sm text-slate-600">
                      <strong>Level:</strong>{" "}
                      {cert.level}
                    </p>

                    <p className="text-sm text-slate-600">
                      <strong>Priority:</strong>{" "}
                      {cert.priority}/5
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Conferences">
        <div className="flex flex-wrap gap-3">
          {role.conferences.map((conference) => (
            <span
              key={conference}
              className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              {conference}
            </span>
          ))}
        </div>
      </Section>

      <Section
        title="Boolean Search"
        action={
          <CopyButton text={role.booleanSearch} />
        }
      >
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-sm text-green-300">
          {role.booleanSearch}
        </pre>
      </Section>

      <Section
        title="AI Prompt"
        action={
          <CopyButton text={role.aiPrompt} />
        }
      >
        <div className="rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          {role.aiPrompt}
        </div>
      </Section>

      <Section title="Recruiter Notes">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5 leading-7 text-slate-700">
          {role.recruiterNotes}
        </div>
      </Section>
    </div>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold">
        {value}
      </div>
    </div>
  );
}