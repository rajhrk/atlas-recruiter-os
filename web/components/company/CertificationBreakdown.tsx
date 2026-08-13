interface Company {
  certifications: string[];
}

interface Props {
  companies: Company[];
}

export default function CertificationBreakdown({
  companies,
}: Props) {
  const certificationCounts = new Map<string, number>();

  companies.forEach((company) => {
    const certifications = new Set(
      company.certifications
    );

    certifications.forEach((certification) => {
      certificationCounts.set(
        certification,
        (certificationCounts.get(certification) ?? 0) + 1
      );
    });
  });

  const breakdown = Array.from(
    certificationCounts.entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Certification Signals
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Certifications appearing across the company intelligence database.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {breakdown.map(([certification, count]) => {
          const percentage =
            companies.length > 0
              ? Math.round(
                  (count / companies.length) * 100
                )
              : 0;

          return (
            <div
              key={certification}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <div className="font-medium">
                {certification}
              </div>

              <div className="mt-2 text-2xl font-bold">
                {count}
              </div>

              <div className="text-xs text-slate-500">
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