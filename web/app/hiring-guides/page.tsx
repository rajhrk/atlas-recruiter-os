import Link from "next/link";

import { getAllHiringGuides } from "@/data/hiringGuides";

export default function HiringGuidesPage() {
  const guides = getAllHiringGuides();

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">
      <div>
        <h1 className="text-4xl font-bold">
          Hiring Guides
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Recruiter playbooks for hiring data center professionals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/hiring-guides/${guide.id}`}
            className="rounded-xl border p-6 transition hover:shadow-lg"
          >
            <div className="text-sm text-blue-600">
              {guide.category}
            </div>

            <h2 className="mt-2 text-xl font-semibold">
              {guide.role}
            </h2>

            <p className="mt-3 text-gray-600">
              {guide.overview}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}