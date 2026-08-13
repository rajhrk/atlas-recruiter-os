interface Company {
  companyType: string;
}

interface Props {
  companies: Company[];
}

export default function CompanyTypeBreakdown({
  companies,
}: Props) {
  const breakdown = Array.from(
    companies.reduce((map, company) => {
      map.set(
        company.companyType,
        (map.get(company.companyType) ?? 0) + 1
      );

      return map;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Company Landscape
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Current company mix in the Atlas database.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {breakdown.map(([type, count]) => {
          const percentage =
            companies.length > 0
              ? Math.round(
                  (count / companies.length) * 100
                )
              : 0;

          return (
            <div
              key={type}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <div className="text-sm font-medium text-slate-500">
                {type}
              </div>

              <div className="mt-2 text-3xl font-bold">
                {count}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {percentage}% of database
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}