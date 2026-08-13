interface Company {
  dataCenterTypes: string[];
}

interface Props {
  companies: Company[];
}

export default function DataCenterTypeBreakdown({
  companies,
}: Props) {
  const typeCounts = new Map<string, number>();

  companies.forEach((company) => {
    const types = new Set(company.dataCenterTypes);

    types.forEach((type) => {
      typeCounts.set(
        type,
        (typeCounts.get(type) ?? 0) + 1
      );
    });
  });

  const breakdown = Array.from(
    typeCounts.entries()
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Data Center Landscape
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Data center infrastructure types represented
          across the Atlas company database.
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
              <div className="font-medium">
                {type}
              </div>

              <div className="mt-2 text-3xl font-bold">
                {count}
              </div>

              <div className="text-xs text-slate-500">
                Companies
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-purple-600"
                  style={{
                    width: `${Math.min(
                      percentage,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-xs text-slate-500">
                {percentage}% of database
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}