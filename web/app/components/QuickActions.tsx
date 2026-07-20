
export default function QuickActions() {
  const actions = [
    "🔍 Recruiter Search",
    "🏢 Company Lookup",
    "🔗 Boolean Builder",
    "🤖 AI Recruiter Copilot",
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="mb-5 text-xl font-bold text-slate-800">
        ⚡ Quick Actions
      </h2>

      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action}
            className="w-full rounded-lg border border-slate-200 p-3 text-left transition hover:bg-blue-50 hover:border-blue-500"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}