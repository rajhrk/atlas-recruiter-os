"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: "🏠",
  },
  {
    title: "Recruiter Search",
    href: "/recruiter-search",
    icon: "🔍",
  },
  {
    title: "Role Intelligence",
    href: "/role-intelligence",
    icon: "👤",
  },
  {
    title: "Company Intelligence",
    href: "/company-intelligence",
    icon: "🏢",
  },
  {
    title: "Skills Intelligence",
    href: "/skills-intelligence",
    icon: "🧠",
  },
  {
    title: "Certification Intelligence",
    href: "/certification-intelligence",
    icon: "🎓",
  },
  {
    title: "Boolean Builder",
    href: "/boolean-builder",
    icon: "🧩",
  },
  {
    title: "AI Prompt Builder",
    href: "/ai-prompts",
    icon: "✨",
  },
  {
    title: "AI Recruiter Copilot",
    href: "/ai-recruiter-copilot",
    icon: "🤖",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen border-r bg-white p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">
          Atlas Recruiter OS
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Talent Intelligence Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                active
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-muted-foreground">
        <div className="font-semibold">
          Atlas Recruiter OS
        </div>

        <div>Version 1.0</div>

        <div className="mt-2">
          Built with Next.js 16
        </div>
      </div>

    </aside>
  );
}