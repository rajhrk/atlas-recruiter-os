interface Props {
  aliases: string[];
  roles: string[];
  technologies: string[];
  vendors: string[];
  certifications: string[];
}

export default function SourcingSignals({
  aliases,
  roles,
  technologies,
  vendors,
  certifications,
}: Props) {
  const roleTerms = roles.join(" OR ");

  const technologyTerms = technologies.join(" OR ");

  const vendorTerms = vendors.join(" OR ");

  const certificationTerms = certifications.join(" OR ");

  const booleanSearch = [
    `("${roleTerms}")`,
    `("${technologyTerms}")`,
    `("${vendorTerms}")`,
    certifications.length
      ? `("${certificationTerms}")`
      : "",
  ]
    .filter(Boolean)
    .join(" AND ");

  return (
    <section className="rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Sourcing Signals
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Recruiter-ready signals derived from this company's
          intelligence profile.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Signal
          title="Company Aliases"
          items={aliases}
        />

        <Signal
          title="Target Roles"
          items={roles}
        />

        <Signal
          title="Technology Signals"
          items={technologies}
        />

        <Signal
          title="Vendor Signals"
          items={vendors}
        />

        <Signal
          title="Certification Signals"
          items={certifications}
        />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">
          Boolean Search
        </h3>

        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-sm text-green-300">
          {booleanSearch}
        </pre>
      </div>
    </section>
  );
}

function Signal({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items.length) {
    return null;
  }

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