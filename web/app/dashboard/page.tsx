// app/dashboard/page.tsx

import Link from "next/link";

import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";
import { companyMaster } from "@/data/atlas/companyMaster";

export default function RecruiterDashboard() {
  const totalCompanies = companyMaster.length;
  const totalRoles = atlasRoles.length;
  const totalSkills = atlasSkills.length;
  const totalCertifications = atlasCertifications.length;

  const hyperscalers = companyMaster.filter(
    (c) => c.companyType === "Hyperscaler"
  );

 const colocation = companyMaster.filter(
  (c) => c.companyType === "Colocation Provider"
);

  const oems = companyMaster.filter(
    (c) => c.companyType === "OEM"
  );

 const epc = companyMaster.filter(
  (c) => c.companyType === "Construction"
);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">

      <div>

        <h1 className="text-4xl font-bold">
          Recruiter Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Atlas Recruiter Operating System
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Companies"
          value={totalCompanies}
        />

        <MetricCard
          title="Roles"
          value={totalRoles}
        />

        <MetricCard
          title="Skills"
          value={totalSkills}
        />

        <MetricCard
          title="Certifications"
          value={totalCertifications}
        />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <Panel title="Company Distribution">

          <Stat
            label="Hyperscalers"
            value={hyperscalers.length}
          />

          <Stat
            label="Colocation"
            value={colocation.length}
          />

          <Stat
            label="OEM"
            value={oems.length}
          />

          <Stat
            label="Construction / EPC"
            value={epc.length}
          />

        </Panel>

        <Panel title="Atlas Coverage">

          <Progress
            title="Role Intelligence"
            value={100}
          />

          <Progress
            title="Company Intelligence"
            value={100}
          />

          <Progress
            title="Skill Intelligence"
            value={100}
          />

          <Progress
            title="Certification Intelligence"
            value={100}
          />

        </Panel>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <Panel title="Quick Actions">

          <DashboardLink
            href="/recruiter"
            label="Recruiter Workspace"
          />

          <DashboardLink
            href="/company/aws"
            label="Company Intelligence"
          />

          <DashboardLink
            href="/skills/UPS"
            label="Skill Intelligence"
          />

          <DashboardLink
            href="/certifications/CDCS"
            label="Certification Intelligence"
          />

          <DashboardLink
            href="/ai-copilot"
            label="AI Recruiter Copilot"
          />

        </Panel>

        <Panel title="Hiring Workflow">

          <Workflow step="1">
            Choose Role
          </Workflow>

          <Workflow step="2">
            Review Companies
          </Workflow>

          <Workflow step="3">
            Review Skills
          </Workflow>

          <Workflow step="4">
            Review Certifications
          </Workflow>

          <Workflow step="5">
            Generate Boolean
          </Workflow>

          <Workflow step="6">
            Generate AI Prompt
          </Workflow>

          <Workflow step="7">
            Source Candidates
          </Workflow>

        </Panel>

      </div>

      <Panel title="Top Hiring Roles">

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {atlasRoles.slice(0, 12).map((role) => (

            <Link
              key={role.roleId}
              href={`/recruiter?role=${encodeURIComponent(
                role.role
              )}`}
              className="rounded-xl border bg-white p-5 hover:border-blue-500 hover:shadow-md"
            >

              <div className="font-semibold">
                {role.role}
              </div>

              <div className="mt-2 text-sm text-slate-500">
                {role.targetCompanies.length} Companies
              </div>

              <div className="text-sm text-slate-500">
                {role.coreSkills.length} Skills
              </div>

            </Link>

          ))}

        </div>

      </Panel>

    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-3 text-4xl font-bold">
        {value}
      </div>

    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-semibold">
        {title}
      </h2>

      <div className="space-y-4">
        {children}
      </div>

    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between rounded-lg bg-slate-50 p-3">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}

function Progress({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span>{title}</span>

        <strong>{value}%</strong>

      </div>

      <div className="h-3 rounded-full bg-slate-200">

        <div
          className="h-3 rounded-full bg-blue-600"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

function DashboardLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border p-4 hover:border-blue-500 hover:bg-blue-50"
    >
      {label}
    </Link>
  );
}

function Workflow({
  step,
  children,
}: {
  step: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
        {step}
      </div>

      <div>{children}</div>

    </div>
  );
}