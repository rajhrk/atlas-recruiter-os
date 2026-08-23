import Link from "next/link";

import AtlasHeader from "@/components/atlas/AtlasHeader";

const WORKSPACES = [
  {
    title: "Evidence-First Discovery",
    description:
      "Find evidence first, then promote people. Uses evidence gates, claim-level confidence, ecosystem mapping, and source-bias auditing.",
    href: "/technical-talent/evidence-first",
    label: "Recommended",
  },
  {
    title: "Technical Talent Discovery",
    description:
      "Explore normalized technical talent across AI / ML, Robotics, Hardware / Embedded, and Semiconductor.",
    href: "/technical-talent/discovery",
    label: "Discovery",
  },
  {
    title: "AI / ML",
    description:
      "Role intelligence, skills, technologies, research areas, companies, and sourcing signals for AI / ML talent.",
    href: "/technical-talent/ai-ml",
    label: "Domain",
  },
  {
    title: "Robotics",
    description:
      "Technical role intelligence for robotics, autonomy, perception, controls, manipulation, and robot learning.",
    href: "/technical-talent/robotics",
    label: "Domain",
  },
  {
    title: "Hardware / Embedded",
    description:
      "Explore embedded, firmware, hardware, systems, and related technical talent intelligence.",
    href: "/technical-talent/hardware",
    label: "Domain",
  },
  {
    title: "Semiconductor",
    description:
      "Explore ASIC, FPGA, silicon, verification, physical design, DFT, and semiconductor talent intelligence.",
    href: "/technical-talent/semiconductor",
    label: "Domain",
  },
] as const;

export default function TechnicalTalentHubPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <AtlasHeader
          title="Technical Talent Intelligence"
          description="Move from role intelligence to evidence-backed technical talent discovery."
        />

        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            New sourcing model
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Find evidence → find people
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Evidence-first discovery is now the preferred path for external
            technical sourcing. Atlas keeps source evidence, confidence,
            verification, fit, and recruiter review connected instead of
            treating a candidate list as the final output.
          </p>
          <Link
            href="/technical-talent/evidence-first"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Open Evidence-First Discovery →
          </Link>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {WORKSPACES.map((workspace) => (
            <Link
              key={workspace.href}
              href={workspace.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {workspace.label}
                </span>
                <span className="text-slate-400 transition group-hover:text-indigo-600">
                  →
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                {workspace.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {workspace.description}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
