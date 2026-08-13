// app/skills/[id]/page.tsx

import { notFound } from "next/navigation";
import { getCompaniesForSkill } from "@/lib/atlas/skillCompanies";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasRoles } from "@/data/atlas/roles";
import { atlasCertifications } from "@/data/atlas/certifications";

import Section from "@/components/recruiter/Section";
import BadgeLink from "@/components/recruiter/BadgeLink";
import CopyButton from "@/components/recruiter/CopyButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SkillPage({ params }: Props) {
  const { id } = await params;

  const skillName = decodeURIComponent(id);

  const skill = atlasSkills.find(
    (s) =>
      s.skill.toLowerCase() === skillName.toLowerCase()
  );

  if (!skill) {
    notFound();
  }
const relatedCompanies = getCompaniesForSkill(
  skill.skill
);
  const vendors = skill.relatedVendors
    ? skill.relatedVendors
        .split(",")
        .map((vendor) => vendor.trim())
        .filter(Boolean)
    : [];

  const relatedRoles = atlasRoles.filter((role) =>
    role.coreSkills.some(
      (s) =>
        s.toLowerCase() === skill.skill.toLowerCase()
    )
  );

  const relatedCertifications = atlasCertifications.filter(
    (cert) =>
      cert.relatedJobTitles
        .toLowerCase()
        .includes(
          skill.relatedJobTitles.toLowerCase()
        )
  );

  const booleanSearch = relatedRoles
    .map((role) => role.booleanSearch)
    .join("\n\n");

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">
      {/* Header */}

      <header className="rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-medium text-blue-600">
              {skill.division}
            </div>

            <h1 className="mt-2 text-4xl font-bold">
              {skill.skill}
            </h1>

            <p className="mt-3 text-slate-500">
              {skill.division} • {skill.specialization}
            </p>
          </div>

          <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            {"⭐".repeat(skill.priority)}
          </div>
        </div>
      </header>

      {/* Skill Overview */}

      <Section title="Skill Overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Skill"
            value={skill.skill}
          />

          <Info
            label="Division"
            value={skill.division}
          />

          <Info
            label="Specialization"
            value={skill.specialization}
          />

          <Info
            label="Category"
            value={skill.category}
          />

          <Info
            label="Priority"
            value={`${skill.priority}/5`}
          />

          <Info
            label="Related Vendors"
            value={skill.relatedVendors}
          />
        </div>
      </Section>

      {/* Vendor / Job Title Intelligence */}

      <Section title="Recruiter Intelligence">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-5">
            <h3 className="mb-4 text-lg font-semibold">
              🏢 Related Vendors
            </h3>

            <div className="flex flex-wrap gap-2">
              {vendors.map((vendor) => (
                <span
                  key={vendor}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
                >
                  {vendor}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h3 className="mb-4 text-lg font-semibold">
              💼 Related Job Titles
            </h3>

            <div className="flex flex-wrap gap-2">
              {skill.relatedJobTitles
                .split(",")
                .map((role) => role.trim())
                .filter(Boolean)
                .map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700"
                  >
                    {role}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Recruiter Notes */}

      <Section title="Recruiter Notes">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5 leading-7 text-slate-700">
          {skill.recruiterNotes}
        </div>
      </Section>

      {/* Roles */}

      <Section title="Roles Using This Skill">
        {relatedRoles.length === 0 ? (
          <p className="text-sm text-slate-500">
            No directly mapped Atlas roles found.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {relatedRoles.map((role) => (
              <BadgeLink
                key={role.roleId}
                label={role.role}
                href={`/role/${encodeURIComponent(
                  role.roleId
                )}`}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Recruiter Knowledge */}

      <Section title="Recruiter Knowledge">
        <div className="flex flex-wrap gap-3">
          <BadgeLink
            label={`${skill.skill} recruiter knowledge`}
            href={`/recruiter-knowledge/${encodeURIComponent(
              skill.skill
            )}`}
          />

          {vendors.map((vendor) => (
            <BadgeLink
              key={vendor}
              label={`${vendor} knowledge`}
              href={`/recruiter-knowledge/${encodeURIComponent(
                vendor
              )}`}
            />
          ))}
        </div>
      </Section>
<Section title="Companies Using / Hiring Around This Skill">
  {relatedCompanies.length === 0 ? (
    <p className="text-sm text-slate-500">
      No directly mapped Atlas companies found.
    </p>
  ) : (
    <div className="flex flex-wrap gap-3">
      {relatedCompanies.map((company) => (
        <BadgeLink
          key={company.id}
          label={company.name}
          href={`/company/${encodeURIComponent(
            company.id
          )}`}
        />
      ))}
    </div>
  )}
</Section>
      {/* Certifications */}

      <Section title="Recommended Certifications">
        {relatedCertifications.length === 0 ? (
          <p className="text-sm text-slate-500">
            No directly mapped certifications found.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {relatedCertifications.map((cert) => (
              <div
                key={cert.certification}
                className="rounded-xl border bg-white p-5"
              >
                <BadgeLink
                  label={cert.certification}
                  href={`/certifications/${encodeURIComponent(
                    cert.certification
                  )}`}
                />

                <div className="mt-4 space-y-2 text-sm text-slate-600">
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
        )}
      </Section>

      {/* Boolean Library */}

      <Section
        title="Boolean Library"
        action={
          <CopyButton text={booleanSearch} />
        }
      >
        {booleanSearch ? (
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-green-300">
            {booleanSearch}
          </pre>
        ) : (
          <p className="text-sm text-slate-500">
            No Boolean searches are currently mapped
            to this skill.
          </p>
        )}
      </Section>

      {/* Recruiting Strategy */}

      <Section title="Recruiting Strategy">
        <ul className="list-disc space-y-3 pl-6 text-slate-700">
          <li>
            Search this skill together with vendor names.
          </li>

          <li>
            Include certification keywords.
          </li>

          <li>
            Search conference speakers and attendees.
          </li>

          <li>
            Expand into adjacent technologies.
          </li>

          <li>
            Use GitHub, LinkedIn, patents and technical
            forums.
          </li>

          <li>
            Prioritise candidates with multiple critical
            infrastructure skills.
          </li>
        </ul>
      </Section>
    </main>
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
    <div className="rounded-xl border bg-slate-50 p-5">
      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold">
        {value}
      </div>
    </div>
  );
}