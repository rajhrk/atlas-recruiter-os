"use client";

import { useMemo, useState } from "react";
import type { TalentDomainId } from "@/lib/atlas/talentDomains";
import Link from "next/link";

import { searchAtlas } from "@/lib/search/searchEngine";

interface UniversalSearchProps {
  domainId?: TalentDomainId;
}

export default function UniversalSearch({
  domainId,
}: UniversalSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return searchAtlas(query, domainId);
  }, [query, domainId]);

  return (
    <div className="w-full max-w-3xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search companies, roles, skills, certifications..."
        className="w-full rounded-xl border p-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      {query && (
        <div className="mt-4 rounded-xl border bg-white shadow-sm">
          {results.length === 0 ? (
            <p className="p-4 text-slate-500">
              No results found.
            </p>
          ) : (
            results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.href}
                className="block border-b p-4 last:border-b-0 hover:bg-slate-50"
              >
                <div className="font-semibold">
                  {result.title}
                </div>

                <div className="text-sm text-slate-500">
                  {result.subtitle}
                </div>

                <div className="mt-1 text-xs uppercase tracking-wide text-blue-600">
                  {result.type}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}