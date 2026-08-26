import type {
  TalentDomainId,
} from "@/lib/atlas/talentDomains";

interface Company {
  coreTechnologies: string[];
}

interface Props {
  companies: Company[];
  domainId?: TalentDomainId;
  domainLabel?: string;
}

export default function TechnologyBreakdown({
  companies,
  domainLabel = "Talent",
}: Props) {
  const technologyCounts = new Map<string, number>();

  companies.forEach((company) => {
    const technologies = new Set(
      company.coreTechnologies,
    );

    technologies.forEach((technology) => {
      technologyCounts.set(
        technology,
        (technologyCounts.get(technology) ?? 0) + 1,
      );
    });
  });

  const breakdown = Array.from(
    technologyCounts.entries(),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          {domainLabel} Technology Signals
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Core technologies appearing across companies
          relevant to the {domainLabel} talent domain.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {breakdown.map(([technology, count]) => {
          const percentage =
            companies.length > 0
              ? Math.round(
                  (count / companies.length) * 100,
                )
              : 0;

          return (
            <div
              key={technology}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <div className="font-medium">
                {technology}
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
                      100,
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
