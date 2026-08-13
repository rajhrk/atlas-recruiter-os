interface Props {
  roles: string[];
  technologies: string[];
  vendors: string[];
  certifications: string[];
  recruiterNotes: string;
}

export default function HiringIntelligence({
  roles,
  technologies,
  vendors,
  certifications,
  recruiterNotes,
}: Props) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Hiring Intelligence
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Recruiter-focused signals for sourcing talent at this company.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <SignalCard
          title="Target Roles"
          items={roles}
        />

        <SignalCard
          title="Core Technologies"
          items={technologies}
        />

        <SignalCard
          title="Strategic Vendors"
          items={vendors}
        />

        <SignalCard
          title="Certifications"
          items={certifications}
        />
      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-5">
        <h3 className="font-semibold">
          Recruiter Note
        </h3>

        <p className="mt-2 leading-7 text-slate-700">
          {recruiterNotes}
        </p>
      </div>
    </section>
  );
}

function SignalCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-5">
      <h3 className="font-semibold">
        {title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}