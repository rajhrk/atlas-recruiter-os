import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getRole,
  getCompaniesByRole,
  getSkillsByRole,
  getCertificationsByRole,
  getConferencesByRole,
  getSimilarRoles,
} from "@/lib/atlas/relationshipService";

interface Props {
  params: {
    id: string;
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        {title}
      </h2>

      {children}
    </section>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
      {children}
    </span>
  );
}

export default function RolePage({
  params,
}: Props) {
  const role = getRole(params.id);

  if (!role) {
    notFound();
  }

  const companies = getCompaniesByRole(role.roleId);
  const skills = getSkillsByRole(role.roleId);
  const certifications =
    getCertificationsByRole(role.roleId);
  const conferences =
    getConferencesByRole(role.roleId);
  const similarRoles =
    getSimilarRoles(role.roleId);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">

      {/* HERO */}

      <div className="rounded-xl bg-slate-900 p-8 text-white">

        <h1 className="text-4xl font-bold">
          {role.role}
        </h1>

        <p className="mt-4 opacity-80">
          Recruiter Intelligence Report
        </p>

      </div>

      <Section title="Target Companies">

        <div className="flex flex-wrap gap-2">

          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/company/${company.id}`}
            >
              <Badge>{company.name}</Badge>
            </Link>
          ))}

        </div>

      </Section>

      <Section title="Core Skills">

        <div className="flex flex-wrap gap-2">

          {skills.map((skill) => (
            <Link
              key={skill.skillId}
              href={`/skills/${skill.skillId}`}
            >
              <Badge>{skill.skill}</Badge>
            </Link>
          ))}

        </div>

      </Section>

      <Section title="Certifications">

        <div className="flex flex-wrap gap-2">

          {certifications.map((cert) => (
            <Link
              key={cert.certification}
              href={`/certifications/${encodeURIComponent(
                cert.certification
              )}`}
            >
              <Badge>
                {cert.certification}
              </Badge>
            </Link>
          ))}

        </div>

      </Section>

      <Section title="Conferences">

        <div className="flex flex-wrap gap-2">

          {conferences.map((conference) => (
            <Link
              key={conference}
              href={`/conferences/${encodeURIComponent(
                conference
              )}`}
            >
              <Badge>{conference}</Badge>
            </Link>
          ))}

        </div>

      </Section>

      <Section title="Boolean Search">

        <pre className="overflow-auto rounded bg-slate-100 p-4 text-sm whitespace-pre-wrap">
          {role.booleanSearch}
        </pre>

      </Section>

      <Section title="AI Recruiter Prompt">

        <pre className="overflow-auto rounded bg-slate-100 p-4 text-sm whitespace-pre-wrap">
          {role.aiPrompt}
        </pre>

      </Section>

      <Section title="Recruiter Notes">

        <p>{role.recruiterNotes}</p>

      </Section>

      <Section title="Related Roles">

        <div className="grid gap-3">

          {similarRoles.map((related) => (
            <Link
              key={related.roleId}
              href={`/roles/${related.roleId}`}
              className="rounded-lg border p-4 hover:bg-slate-50"
            >
              {related.role}
            </Link>
          ))}

        </div>

      </Section>

    </div>
  );
}