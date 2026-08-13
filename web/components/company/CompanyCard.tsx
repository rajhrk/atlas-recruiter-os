import Link from "next/link";

import { AtlasCompany } from "@/types/company";

interface Props {
  company: AtlasCompany;
}

export default function CompanyCard({
  company,
}: Props) {
  return (
    <Link
      href={`/company/${company.id}`}
      className="rounded-xl border bg-white p-6 transition hover:shadow-xl hover:border-blue-400"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-blue-600">
            {company.companyType}
          </div>

          <h2 className="mt-2 text-2xl font-bold">
            {company.name}
          </h2>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            company.priority === "Tier 1"
              ? "bg-red-100 text-red-700"
              : company.priority === "Tier 2"
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {company.priority}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        {company.headquarters}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-2xl font-bold">
            {company.roles.length}
          </div>
          <div className="text-xs text-slate-500">
            Roles
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-2xl font-bold">
            {company.coreTechnologies.length}
          </div>
          <div className="text-xs text-slate-500">
            Technologies
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-2xl font-bold">
            {company.strategicVendors.length}
          </div>
          <div className="text-xs text-slate-500">
            Vendors
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-2xl font-bold">
            {company.certifications.length}
          </div>
          <div className="text-xs text-slate-500">
            Certifications
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {company.roles.slice(0, 3).map((role) => (
          <span
            key={role}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs"
          >
            {role}
          </span>
        ))}
      </div>
    </Link>
  );
}