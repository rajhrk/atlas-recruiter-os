import {
  LayoutDashboard,
  Search,
  Building2,
  Brain,
  GraduationCap,
  CalendarDays,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Search, label: "Recruiter Search" },
  { icon: Building2, label: "Companies" },
  { icon: Brain, label: "Skills" },
  { icon: GraduationCap, label: "Certifications" },
  { icon: CalendarDays, label: "Conferences" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-900 text-white">

      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-blue-400">
          Atlas
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Recruiter OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition hover:bg-slate-800"
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </button>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-800">
          <Settings size={20} />

          <span>Settings</span>
        </button>

      </div>

    </aside>
  );
}