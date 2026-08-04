// app/conferences/[id]/page.tsx

import { notFound } from "next/navigation";

import { atlasRoles } from "@/data/atlas/roles";

import Section from "@/components/recruiter/Section";
import BadgeLink from "@/components/recruiter/BadgeLink";
import CopyButton from "@/components/recruiter/CopyButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConferencePage({
  params,
}: Props) {
  const { id } = await params;

  const conference = decodeURIComponent(id);

  const relatedRoles = atlasRoles.filter((role) =>
    role.conferences.some(
      (c) =>
        c.toLowerCase() === conference.toLowerCase()
    )
  );

  if (!relatedRoles.length) {
    notFound();
  }

  const companies = Array.from(
    new Set(
      relatedRoles.flatMap((r) => r.targetCompanies)
    )
  );

  const skills = Array.from(
    new Set(
      relatedRoles.flatMap((r) => r.coreSkills)
    )
  );

  const certifications = Array.from(
    new Set(
      relatedRoles.flatMap((r) => r.certifications)
    )
  );

  const booleanSearch = relatedRoles
    .map((r) => r.booleanSearch)
    .join("\n\n");

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">

      <header className="rounded-2xl border bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-bold">
          {conference}
        </h1>

        <p className="mt-3 text-slate-500">
          Conference Intelligence
        </p>

      </header>

      <Section title="Overview">

        <div className="grid gap-6 md:grid-cols-4">

          <Info
            label="Conference"
            value={conference}
          />

          <Info
            label="Roles"
            value={String(relatedRoles.length)}
          />

          <Info
            label="Companies"
            value={String(companies.length)}
          />

          <Info
            label="Skills"
            value={String(skills.length)}
          />

        </div>

      </Section>

      <Section title="Companies">

        <div className="flex flex-wrap gap-3">

          {companies.map((company) => (

            <BadgeLink
              key={company}
              label={company}
              href={`/company/${company.toLowerCase()}`}
            />

          ))}

        </div>

      </Section>

      <Section title="Hiring Roles">

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

      <Section title="Technologies">

        <div className="flex flex-wrap gap-3">

          {skills.map((skill) => (

            <BadgeLink
              key={skill}
              label={skill}
              href={`/skills/${encodeURIComponent(
                skill
              )}`}
            />

          ))}

        </div>

      </Section>

      <Section title="Recommended Certifications">

        <div className="flex flex-wrap gap-3">

          {certifications.map((cert) => (

            <BadgeLink
              key={cert}
              label={cert}
              href={`/certifications/${encodeURIComponent(
                cert
              )}`}
            />

          ))}

        </div>

      </Section>

      <Section
        title="Boolean Search"
        action={
          <CopyButton
            text={booleanSearch}
          />
        }
      >

        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-green-300">

{booleanSearch}

        </pre>

      </Section>

      <Section title="Recruiting Playbook">

        <ul className="list-disc space-y-3 pl-6">

          <li>
            Search conference speaker lists.
          </li>

          <li>
            Search attendee lists.
          </li>

          <li>
            Review sponsor companies.
          </li>

          <li>
            Search LinkedIn posts mentioning
            the conference.
          </li>

          <li>
            Search presentation PDFs.
          </li>

          <li>
            Search YouTube conference talks.
          </li>

          <li>
            Search GitHub repositories shared
            during presentations.
          </li>

          <li>
            Search patents published by
            speakers.
          </li>

          <li>
            Search engineering blogs from
            presenters.
          </li>

          <li>
            Add every speaker into your talent
            mapping pipeline.
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