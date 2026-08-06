import Link from "next/link";

const knowledgeCategories = [
  {
    title: "⚡ Electrical Systems",
    topics: [
      "UPS",
      "Generator",
      "ATS",
      "Switchgear",
      "Transformer",
    ],
  },
  {
    title: "❄️ Cooling Systems",
    topics: [
      "Chillers",
      "CRAC",
      "CRAH",
      "Cooling Towers",
      "Pumps",
    ],
  },
  {
    title: "🏗 Construction & Commissioning",
    topics: [
      "Commissioning",
      "EPC",
      "MEP",
      "FAT",
      "SAT",
    ],
  },
  {
    title: "🌐 Network Infrastructure",
    topics: [
      "Fiber Optics",
      "Spine-Leaf",
      "BGP",
      "DWDM",
      "Structured Cabling",
    ],
  },
  {
    title: "🔥 Fire & Safety",
    topics: [
      "VESDA",
      "FM200",
      "Fire Alarm",
      "Fire Suppression",
    ],
  },
  {
    title: "🤖 AI Infrastructure",
    topics: [
      "GPU Clusters",
      "Liquid Cooling",
      "NVLink",
      "InfiniBand",
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function RecruiterKnowledgePage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">

      <header className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">
          📚 Recruiter Knowledge
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          Learn the technologies, systems and terminology used inside
          modern data centers. This knowledge base is designed specifically
          for technical recruiters.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">

        {knowledgeCategories.map((category) => (
          <section
            key={category.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              {category.title}
            </h2>

            <div className="flex flex-wrap gap-3">
              {category.topics.map((topic) => (
                <Link
                  key={topic}
                  href={`/recruiter-knowledge/${slugify(topic)}`}
                  className="rounded-full border bg-slate-50 px-4 py-2 text-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </section>
        ))}

      </div>
    </main>
  );
}