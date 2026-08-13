"use client";

import { useMemo, useState } from "react";
import type { AIMLRole } from "@/types/aiMl";

interface Props {
  roles: AIMLRole[];
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function RoleFamilyExplorer({ roles }: Props) {
  const families = useMemo(
    () => Array.from(new Set(roles.map((role) => role.family))),
    [roles],
  );

  const [selectedFamily, setSelectedFamily] = useState<string>("All");

  const filteredRoles = useMemo(() => {
    if (selectedFamily === "All") {
      return roles;
    }

    return roles.filter((role) => role.family === selectedFamily);
  }, [roles, selectedFamily]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedFamily("All")}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            selectedFamily === "All"
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          All
        </button>

        {families.map((family) => (
          <button
            key={family}
            onClick={() => setSelectedFamily(family)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selectedFamily === family
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            {family}
          </button>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredRoles.length} role
        {filteredRoles.length === 1 ? "" : "s"}
        {selectedFamily !== "All" ? ` in ${selectedFamily}` : ""}
      </div>

      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {role.title}
                </h3>

                <div className="mt-1 text-sm text-muted-foreground">
                  {role.family}
                  {role.seniority ? ` · ${role.seniority}` : ""}
                </div>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {role.normalizedTitle}
              </div>
            </div>

            {role.aliases.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Title Aliases
                </div>

                <TagList items={role.aliases} />
              </div>
            )}

            {role.skills.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Skills
                </div>

                <TagList items={role.skills} />
              </div>
            )}

            {role.technologies.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Technologies
                </div>

                <TagList items={role.technologies} />
              </div>
            )}

            {role.researchAreas &&
              role.researchAreas.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Research Areas
                  </div>

                  <TagList items={role.researchAreas} />
                </div>
              )}

            {role.targetCompanies &&
              role.targetCompanies.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Target Companies
                  </div>

                  <TagList items={role.targetCompanies} />
                </div>
              )}

            {role.conferences &&
              role.conferences.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Conferences
                  </div>

                  <TagList items={role.conferences} />
                </div>
              )}

            {role.booleanKeywords &&
              role.booleanKeywords.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Boolean Keywords
                  </div>

                  <TagList items={role.booleanKeywords} />
                </div>
              )}

            {role.recruiterNotes &&
              role.recruiterNotes.length > 0 && (
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recruiter Notes
                  </div>

                  <ul className="space-y-2 text-sm leading-6 text-slate-700">
                    {role.recruiterNotes.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}