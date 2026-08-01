import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllCompanies } from "@/lib/atlas/companyService";
import { buildAtlasGraph } from "@/lib/graph/graphBuilder";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;

  const companies = getAllCompanies();

  const search = slug.toLowerCase();

  const company = companies.find((c) => {
    return (
      c.id.toLowerCase() === search ||
      toSlug(c.name) === search ||
      c.aliases.some((alias) => toSlug(alias) === search)
    );
  });

  if (!company) {
    notFound();
  }

  const graph = buildAtlasGraph();

  // Graph now uses company.id instead of company.name
  const hiringEdges = graph.edges.filter(
    (edge) =>
      edge.from === company.id &&
      edge.relationship === "hires"
  );

  const hiringRoles = hiringEdges
    .map((edge) => graph.nodes.find((node) => node.id === edge.to))
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">
      <Link
        href="/company-intelligence"
        className="text-blue-600 hover:underline"
      >
        ← Back to Companies
      </Link>

      <section className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">{company.name}</h1>

            <p className="mt-2 text-lg text-gray-500">
              {company.companyType}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-3xl font-bold">
                {hiringRoles.length}
              </div>

              <div className="text-sm text-gray-500">
                Hiring Roles
              </div>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <div className="text-3xl font-bold">
                {
                  graph.edges.filter(
                    (edge) => edge.from === company.id
                  ).length
                }
              </div>

              <div className="text-sm text-gray-500">
                Relationships
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Hiring Roles
          </h2>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {hiringRoles.length} Roles
          </span>
        </div>

        {hiringRoles.length === 0 ? (
          <p className="text-gray-500">
            No hiring relationships found.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hiringRoles.map((role) => (
              <Link
                key={role!.id}
                href={`/role/${toSlug(role!.label)}`}
                className="rounded-xl border p-5 transition hover:border-blue-500 hover:bg-blue-50 hover:shadow"
              >
                <div className="text-lg font-semibold">
                  {role!.label}
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  View Role Intelligence →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}