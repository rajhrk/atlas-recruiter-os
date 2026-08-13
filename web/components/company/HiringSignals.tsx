interface Props {
  priority: string;
  roles: string[];
  technologies: string[];
  certifications: string[];
}

export default function HiringSignals({
  priority,
  roles,
  technologies,
  certifications,
}: Props) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Hiring Signals
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Key signals for recruiters targeting this company.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Recruiter Priority
          </div>

          <div className="mt-2 text-xl font-bold">
            {priority}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Hiring Roles
          </div>

          <div className="mt-2 text-xl font-bold">
            {roles.length}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Core Technologies
          </div>

          <div className="mt-2 text-xl font-bold">
            {technologies.length}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Certifications
          </div>

          <div className="mt-2 text-xl font-bold">
            {certifications.length}
          </div>
        </div>
      </div>
    </section>
  );
}