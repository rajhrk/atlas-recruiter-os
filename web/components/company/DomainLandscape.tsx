interface Company {
  dataCenterTypes: string[];
  coreTechnologies: string[];
}

interface Props {
  companies: Company[];
  domainLabel: string;
  signalLabel: string;
  useDataCenterTypes?: boolean;
}

export default function DomainLandscape({
  companies,
  domainLabel,
  signalLabel,
  useDataCenterTypes = false,
}: Props) {
  const signalCounts = new Map<string, number>();

  companies.forEach((company) => {
    const signals = useDataCenterTypes
      ? company.dataCenterTypes
      : company.coreTechnologies;

    const uniqueSignals = new Set(signals);

    uniqueSignals.forEach((signal) => {
      signalCounts.set(
        signal,
        (signalCounts.get(signal) ?? 0) + 1,
      );
    });
  });

  const breakdown = Array.from(
    signalCounts.entries(),
  ).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          {domainLabel} Landscape
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {signalLabel} represented across the Atlas
          company database.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {breakdown.map(([signal, count]) => {
          const percentage =
            companies.length > 0
              ? Math.round(
                  (count / companies.length) * 100,
                )
              : 0;

          return (
            <div
              key={signal}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <div className="font-medium">
                {signal}
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
                      100,
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-xs text-slate-500">
                {percentage}% of domain
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
