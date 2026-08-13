import Link from "next/link";

interface Props {
  roleIds?: string[];
  skillIds?: string[];
  knowledgeIds?: string[];
  certificationIds?: string[];
}

function LinkGroup({
  title,
  items,
  basePath,
}: {
  title: string;
  items: string[];
  basePath: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item}
            href={`${basePath}/${item}`}
            className="rounded-lg border bg-white px-3 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CompanyLinks({
  roleIds = [],
  skillIds = [],
  knowledgeIds = [],
  certificationIds = [],
}: Props) {
  return (
    <section className="space-y-6 rounded-xl border bg-slate-50 p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Related Atlas Intelligence
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Continue researching this company across the Atlas knowledge system.
        </p>
      </div>

      <LinkGroup
        title="Hiring Guides"
        items={roleIds}
        basePath="/hiring-guides"
      />

      <LinkGroup
        title="Skills Intelligence"
        items={skillIds}
        basePath="/skills"
      />

      <LinkGroup
        title="Recruiter Knowledge"
        items={knowledgeIds}
        basePath="/recruiter-knowledge"
      />

      <LinkGroup
        title="Certifications"
        items={certificationIds}
        basePath="/certifications"
      />
    </section>
  );
}