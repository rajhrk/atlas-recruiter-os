"use client";

import Link from "next/link";
import UniversalSearch from "@/components/search/UniversalSearch";

const stats = [
  { label: "Companies", value: "240+" },
  { label: "Roles", value: "180+" },
  { label: "Skills", value: "550+" },
  { label: "Certifications", value: "70+" },
];

const quickLinks = [
  {
    title: "Recruiter Search",
    description: "Search across every entity in Atlas.",
    href: "/recruiter-search",
    emoji: "🔍",
  },
  {
    title: "Company Intelligence",
    description: "Explore target companies and hiring insights.",
    href: "/company-intelligence",
    emoji: "🏢",
  },
  {
    title: "Role Intelligence",
    description: "Discover roles, responsibilities and career paths.",
    href: "/role-intelligence",
    emoji: "👤",
  },
  {
    title: "Boolean Builder",
    description: "Generate recruiter-ready Boolean searches.",
    href: "/boolean-builder",
    emoji: "🧩",
  },
  {
    title: "AI Prompt Builder",
    description: "Create structured recruiting prompts instantly.",
    href: "/ai-prompts",
    emoji: "✨",
  },
  {
    title: "AI Recruiter Copilot",
    description: "Research companies and hiring markets with AI.",
    href: "/ai-recruiter-copilot",
    emoji: "🤖",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl p-10">

      {/* Hero */}

      <section className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Welcome Back
        </p>

        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900">
          Atlas Recruiter Intelligence OS
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Your recruiter workspace for Data Centres, AI Infrastructure,
          Critical Facilities and Construction Talent Intelligence.
        </p>
      </section>

      {/* Search */}

      <section className="mb-12 rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Universal Search
          </h2>

          <p className="mt-2 text-slate-600">
            Search companies, roles, skills, certifications,
            technologies and more.
          </p>
        </div>

        <UniversalSearch />
      </section>

      {/* Stats */}

      <section className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}

      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            Quick Actions
          </h2>

          <p className="mt-2 text-slate-600">
            Jump directly into the recruiter tools you use every day.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-900 hover:shadow-lg"
            >
              <div className="mb-5 text-4xl">
                {item.emoji}
              </div>

              <h3 className="text-xl font-semibold group-hover:text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}

      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">
          Recent Activity
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="font-medium">
                Microsoft
              </p>

              <p className="text-sm text-slate-500">
                Company workspace viewed
              </p>
            </div>

            <span className="text-sm text-slate-400">
              Today
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="font-medium">
                Critical Facilities Engineer
              </p>

              <p className="text-sm text-slate-500">
                Role searched
              </p>
            </div>

            <span className="text-sm text-slate-400">
              Yesterday
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="font-medium">
                CDCS Certification
              </p>

              <p className="text-sm text-slate-500">
                Certification opened
              </p>
            </div>

            <span className="text-sm text-slate-400">
              Yesterday
            </span>
          </div>

        </div>
      </section>

    </main>
  );
}