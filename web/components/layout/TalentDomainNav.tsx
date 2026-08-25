"use client";

import { useAtlas } from "@/context/AtlasContext";
import { TALENT_DOMAINS } from "@/lib/atlas/talentDomains";

export default function TalentDomainNav() {
  const { selectedDomain, setSelectedDomain } = useAtlas();

  return (
    <nav
      aria-label="Talent domains"
      className="sticky top-0 z-20 border-b bg-white/95 px-6 py-3 backdrop-blur"
    >
      <div className="flex min-w-max items-center gap-1 md:justify-center">
        {TALENT_DOMAINS.map((domain) => {
          const active = selectedDomain === domain.id;

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => setSelectedDomain(domain.id)}
              aria-pressed={active}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="mr-2">{domain.icon}</span>
              {domain.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
