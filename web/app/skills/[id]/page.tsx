// app/skills/[id]/page.tsx

import { notFound } from "next/navigation";

import { atlasSkills } from "@/data/atlas/skills";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasCertifications } from "@/data/atlas/certifications";

import Section from "@/components/recruiter/Section";
import BadgeLink from "@/components/recruiter/BadgeLink";
import CopyButton from "@/components/recruiter/CopyButton";

interface Props {
  params: {
    id: string;
  };
}

export default function SkillPage({ params }: Props) {
  const skillName = decodeURIComponent(params.id);

  const skill = atlasSkills.find(
    (s) =>
      s.skill.toLowerCase() === skillName.toLowerCase()
  );

  if (!skill) {
    notFound();
  }

  const relatedRoles = atlasRoles.filter((role) =>
    role.coreSkills.some(
      (s) => s.toLowerCase() === skill.skill.toLowerCase()
    )
  );

  const relatedCertifications = atlasCertifications.filter((cert) =>
    cert.relatedJobTitles
      .toLowerCase()
      .includes(skill.relatedJobTitles.toLowerCase())
  );

  const booleanSearch = relatedRoles
    .map((r) => r.booleanSearch)
    .join("\n\n");

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">
          {skill.skill}
        </h1>

        <p className="mt-3 text-slate-500">
          {skill.division} • {skill.specialization}
        </p>
      </header>

      <Section title="Skill Overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="Skill" value={skill.skill} />
          <Info label="Division" value={skill.division} />
          <Info label="Specialization" value={skill.specialization} />
          <Info label="Category" value={skill.category} />
          <Info label="Priority" value={`${skill.priority}/5`} />
          <Info
            label="Related Vendors"
            value={skill.relatedVendors}
          />
        </div>
      </Section>

      <Section title="Typical Job Titles">
        <div className="rounded-xl bg-slate-50 p-5">
          {skill.relatedJobTitles}
        </div>
      </Section>

      <Section title="Recruiter Notes">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5 leading-7">
          {skill.recruiterNotes}
        </div>
      </Section>

      <Section title="Roles Using This Skill">
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

      <Section title="Recommended Certifications">
        <div className="grid gap-4 md:grid-cols-2">
          {relatedCertifications.map((cert) => (
            <div
              key={cert.certification}
              className="rounded-xl border p-5"
            >
              <BadgeLink
                label={cert.certification}
                href={`/certifications/${encodeURIComponent(
                  cert.certification
                )}`}
              />

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Organisation:</strong>{" "}
                  {cert.issuingOrganization}
                </p>

                <p>
                  <strong>Level:</strong>{" "}
                  {cert.level}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {cert.priority}/5
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Boolean Library"
        action={<CopyButton text={booleanSearch} />}
      >
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-green-300">
          {booleanSearch}
        </pre>
      </Section>

      <Section title="Recruiting Strategy">
        <ul className="list-disc space-y-3 pl-6">
          <li>Search this skill together with vendor names.</li>
          <li>Include certification keywords.</li>
          <li>Search conference speakers and attendees.</li>
          <li>Expand into adjacent technologies.</li>
          <li>Use GitHub, LinkedIn, patents and technical forums.</li>
          <li>Prioritise candidates with multiple critical infrastructure skills.</li>
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