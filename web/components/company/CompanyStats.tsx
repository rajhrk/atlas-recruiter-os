interface Company {
  companyType: string;
  regions: string[];
  dataCenterPresence: string[];
}

interface Props {
  companies: Company[];
  filtered: number;
}

export default function CompanyStats({
  companies,
  filtered,
}: Props) {
  const companyTypes = new Set(
    companies.map((company) => company.companyType)
  );

  const regions = new Set(
    companies.flatMap((company) => [
      ...company.regions,
      ...company.dataCenterPresence,
    ])
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm text-slate-500">
          Companies
        </div>

        <div className="mt-2 text-3xl font-bold">
          {filtered}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Currently shown
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm text-slate-500">
          Total Database
        </div>

        <div className="mt-2 text-3xl font-bold">
          {companies.length}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Companies
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm text-slate-500">
          Company Types
        </div>

        <div className="mt-2 text-3xl font-bold">
          {companyTypes.size}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Active categories
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm text-slate-500">
          Regions
        </div>

        <div className="mt-2 text-3xl font-bold">
          {regions.size}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Coverage areas
        </div>
      </div>
    </div>
  );
}