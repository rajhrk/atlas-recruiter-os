"use client";

const tabs = [
  "Overview",
  "Companies",
  "Skills",
  "Certifications",
  "Conferences",
  "Boolean",
  "AI Copilot",
  "LinkedIn",
  "Market Intelligence",
];

export default function WorkspaceTabs() {
  return (
    <div className="mt-8 rounded-xl border bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b p-4">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              index === 0
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-semibold">Overview</h2>

        <p className="mt-3 text-slate-500">
          Select a role and click <strong>Generate Intelligence</strong> to
          populate recruiter insights.
        </p>
      </div>
    </div>
  );
}