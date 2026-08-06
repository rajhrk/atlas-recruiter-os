import { notFound } from "next/navigation";

import { getKnowledgeTopic } from "@/data/recruiterKnowledge";

interface Props {
  params: Promise<{
    topic: string;
  }>;
}

export default async function KnowledgeTopicPage({
  params,
}: Props) {
  const { topic } = await params;

  const knowledge = getKnowledgeTopic(topic);

  if (!knowledge) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">

      <header className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">
          {knowledge.title}
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          {knowledge.category}
        </p>

        <p className="mt-4 text-gray-700">
          {knowledge.summary}
        </p>
      </header>

      <section className="rounded-xl border p-8">
        <h2 className="text-2xl font-semibold">
          Why Recruiters Should Care
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          {knowledge.whyItMatters.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border p-8">
        <h2 className="text-2xl font-semibold">
          Major Vendors
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {knowledge.majorVendors.map((vendor) => (
            <span
              key={vendor}
              className="rounded-full border px-3 py-1"
            >
              {vendor}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border p-8">
        <h2 className="text-2xl font-semibold">
          Related Roles
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {knowledge.relatedRoles.map((role) => (
            <span
              key={role}
              className="rounded-full border px-3 py-1"
            >
              {role}
            </span>
          ))}
        </div>
      </section>

    </main>
  );
}