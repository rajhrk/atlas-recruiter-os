interface Company {
  regions: string[];
  dataCenterPresence: string[];
}

interface Props {
  companies: Company[];
}

export default function CompanyRegionBreakdown({
  companies,
}: Props) {
  const regionCounts = new Map<string, number>();

  companies.forEach((company) => {
    const regions = new Set([
      ...company.regions,
      ...company.dataCenterPresence,
    ]);

    regions.forEach((region) => {
      regionCounts.set(
        region,
        (regionCounts.get(region) ?? 0) + 1
      );
    });
  });

  const breakdown = Array.from(
    regionCounts.entries()
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Regional Coverage
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Geographic footprint represented in the Atlas company database.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {breakdown.map(([region, count]) => {
          const percentage =
            companies.length > 0
              ? Math.round(
                  (count / companies.length) * 100
                )
              : 0;

          return (
            <div
              key={region}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <div className="text-sm font-medium text-slate-500">
                {region}
              </div>

              <div className="mt-2 text-3xl font-bold">
                {count}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Companies
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${Math.min(
                      percentage,
                      100
                    )}%`,
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