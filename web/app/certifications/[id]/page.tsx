// app/certifications/[id]/page.tsx

import { notFound } from "next/navigation";

import { atlasCertifications } from "@/data/atlas/certifications";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";

import Section from "@/components/recruiter/Section";
import BadgeLink from "@/components/recruiter/BadgeLink";
import CopyButton from "@/components/recruiter/CopyButton";

interface Props {
  params: {
    id: string;
  };
}

export default function CertificationPage({
  params,
}: Props) {
  const certificationName = decodeURIComponent(params.id);

  const certification = atlasCertifications.find(
    (c) =>
      c.certification.toLowerCase() ===
      certificationName.toLowerCase()
  );

  if (!certification) {
    notFound();
  }

  const relatedRoles = atlasRoles.filter((role) =>
    role.certifications.some(
      (c) =>
        c.toLowerCase() ===
        certification.certification.toLowerCase()
    )
  );

  const relatedSkills = atlasSkills.filter((skill) =>
    certification.relatedJobTitles
      .toLowerCase()
      .includes(skill.relatedJobTitles.toLowerCase())
  );

  const booleanSearch = relatedRoles
    .map((role) => role.booleanSearch)
    .join("\n\n");

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">
          {certification.certification}
        </h1>

        <p className="mt-3 text-slate-500">
          {certification.issuingOrganization}
        </p>
      </header>

      <Section title="Certification Overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Certification"
            value={certification.certification}
          />

          <Info
            label="Organisation"
            value={certification.issuingOrganization}
          />

          <Info
            label="Division"
            value={certification.division}
          />

          <Info
            label="Specialization"
            value={certification.specialization}
          />

          <Info
            label="Level"
            value={certification.level}
          />

          <Info
            label="Priority"
            value={`${certification.priority}/5`}
          />
        </div>
      </Section>

      <Section title="Typical Job Titles">
        <div className="rounded-xl bg-slate-50 p-5">
          {certification.relatedJobTitles}
        </div>
      </Section>

      <Section title="Recruiter Notes">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5 leading-7">
          {certification.recruiterNotes}
        </div>
      </Section>

      <Section title="Related Roles">
        <div className="flex flex-wrap gap-3">
          {relatedRoles.map((role) => (
            <BadgeLink
              key={role.roleId}
              label={role.role}
              href={`/recruiter?role=${encodeURIComponent(
                role.role
              )}`}
            />
          ))}
        </div>
      </Section>

      <Section title="Related Skills">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedSkills.map((skill) => (
            <div
              key={skill.skillId}
              className="rounded-xl border bg-white p-5"
            >
              <BadgeLink
                label={skill.skill}
                href={`/skills/${encodeURIComponent(
                  skill.skill
                )}`}
              />

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Category:</strong>{" "}
                  {skill.category}
                </p>

                <p>
                  <strong>Vendor:</strong>{" "}
                  {skill.relatedVendors}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {skill.priority}/5
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Boolean Search Library"
        action={
          <CopyButton text={booleanSearch} />
        }
      >
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-green-300">
          {booleanSearch}
        </pre>
      </Section>

      <Section title="Recruiting Strategy">
        <ul className="list-disc space-y-3 pl-6">
          <li>
            Prioritise candidates who already
            hold this certification.
          </li>

          <li>
            Search engineers mentioning the
            certification in LinkedIn, resumes
            and conference profiles.
          </li>

          <li>
            Combine this certification with
            vendor technologies and product
            keywords.
          </li>

          <li>
            Target candidates from hyperscalers,
            colocation providers, OEMs and EPC
            companies.
          </li>

          <li>
            Use certification plus role title
            Boolean combinations for higher
            precision sourcing.
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold">
        {value}
      </div>
    </div>
  );
}