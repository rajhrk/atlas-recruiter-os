import Link from "next/link";

import { getRolesForCompany } from "@/lib/atlas/companyRelationships";
import { getSkillsForCompany } from "@/lib/atlas/companySkills";
import { getHiringGuidesForCompany } from "@/lib/atlas/companyHiringGuides";

interface Props {
  companyName: string;
  certifications?: string[];
}

export default function CompanyLinks({
  companyName,
  certifications = [],
}: Props) {
  const roles = getRolesForCompany(companyName);
  const skills = getSkillsForCompany(companyName);
  const guides = getHiringGuidesForCompany(companyName);

  return (
    <section className="space-y-8 rounded-xl border bg-slate-50 p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Related Atlas Intelligence
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Continue researching this company across the Atlas
          intelligence network.
        </p>
      </div>

      <LinkGroup title="Hiring Guides">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/hiring-guides/${encodeURIComponent(
              guide.id
            )}`}
            className="rounded-lg border bg-white px-3 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50"
          >
            {guide.role}
          </Link>
        ))}
      </LinkGroup>

      <LinkGroup title="Hiring Roles">
        {roles.map((role) => (
          <Link
            key={role.roleId}
            href={`/role/${encodeURIComponent(
              role.roleId
            )}`}
            className="rounded-lg border bg-white px-3 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50"
          >
            {role.role}
          </Link>
        ))}
      </LinkGroup>

      <LinkGroup title="Skills Intelligence">
        {skills.map((skill) => (
          <Link
            key={skill.skillId}
            href={`/skills/${encodeURIComponent(
              skill.skill
            )}`}
            className="rounded-lg border bg-white px-3 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50"
          >
            {skill.skill}
          </Link>
        ))}
      </LinkGroup>

      <LinkGroup title="Certifications">
        {certifications.map((certification) => (
          <Link
            key={certification}
            href={`/certifications/${encodeURIComponent(
              certification
            )}`}
            className="rounded-lg border bg-white px-3 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50"
          >
            {certification}
          </Link>
        ))}
      </LinkGroup>
    </section>
  );
}

function LinkGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  if (!children) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}