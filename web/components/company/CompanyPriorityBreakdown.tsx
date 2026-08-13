interface Company {
  priority: string;
}

interface Props {
  companies: Company[];
}

export default function CompanyPriorityBreakdown({
  companies,
}: Props) {
  const priorities = [
    "Tier 1",
    "Tier 2",
    "Tier 3",
  ];

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Recruiter Priority
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Companies ranked by sourcing and hiring priority.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {priorities.map((priority) => {
          const count = companies.filter(
            (company) =>
              company.priority === priority
          ).length;

          const percentage =
            companies.length > 0
              ? Math.round(
                  (count / companies.length) * 100
                )
              : 0;

          return (
            <div
              key={priority}
              className="rounded-xl border bg-slate-50 p-5"
            >
              <div className="text-sm font-medium text-slate-500">
                {priority}
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