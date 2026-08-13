"use client";

import { useMemo, useState } from "react";
import type { HardwareRole } from "@/types/hardware";

interface Props {
  roles: HardwareRole[];
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

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>

      {children}
    </div>
  );
}

export default function HardwareRoleExplorer({ roles }: Props) {
  const families = useMemo(
    () => Array.from(new Set(roles.map((role) => role.family))),
    [roles],
  );

  const [selectedFamily, setSelectedFamily] = useState<string>("All");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    null,
  );

  const filteredRoles = useMemo(() => {
    if (selectedFamily === "All") {
      return roles;
    }

    return roles.filter((role) => role.family === selectedFamily);
  }, [roles, selectedFamily]);

  const selectedRole = useMemo(() => {
    if (!selectedRoleId) {
      return filteredRoles[0] ?? null;
    }

    return (
      filteredRoles.find((role) => role.id === selectedRoleId) ??
      filteredRoles[0] ??
      null
    );
  }, [filteredRoles, selectedRoleId]);

  function handleFamilyChange(family: string) {
    setSelectedFamily(family);
    setSelectedRoleId(null);
  }

  return (
    <div className="space-y-6">
      {/* Role Family Filter */}
      <div>
        <div className="mb-3 text-sm font-semibold text-slate-900">
          Role Family
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFamilyChange("All")}
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
              onClick={() => handleFamilyChange(family)}
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
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        {filteredRoles.length} role
        {filteredRoles.length === 1 ? "" : "s"}
        {selectedFamily !== "All"
          ? ` in ${selectedFamily}`
          : ""}
      </div>

      {/* Role List + Selected Role */}
      {filteredRoles.length > 0 && selectedRole ? (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Role List */}
          <div className="space-y-2">
            <div className="mb-3 text-sm font-semibold text-slate-900">
              Roles
            </div>

            {filteredRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selectedRole.id === role.id
                    ? "border-blue-500 bg-blue-50"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                <div className="font-medium text-slate-900">
                  {role.title}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {role.seniority ?? role.normalizedTitle}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Role Intelligence */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b pb-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {selectedRole.title}
                </h3>

                <div className="mt-1 text-sm text-muted-foreground">
                  {selectedRole.family}
                  {selectedRole.seniority
                    ? ` · ${selectedRole.seniority}`
                    : ""}
                </div>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {selectedRole.normalizedTitle}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {selectedRole.aliases.length > 0 && (
                <DetailSection title="Title Aliases">
                  <TagList items={selectedRole.aliases} />
                </DetailSection>
              )}

              {selectedRole.skills.length > 0 && (
                <DetailSection title="Skills">
                  <TagList items={selectedRole.skills} />
                </DetailSection>
              )}

              {selectedRole.technologies.length > 0 && (
                <DetailSection title="Technologies">
                  <TagList items={selectedRole.technologies} />
                </DetailSection>
              )}

              {selectedRole.protocols &&
                selectedRole.protocols.length > 0 && (
                  <DetailSection title="Protocols / Interfaces">
                    <TagList items={selectedRole.protocols} />
                  </DetailSection>
                )}

              {selectedRole.platforms &&
                selectedRole.platforms.length > 0 && (
                  <DetailSection title="Platforms">
                    <TagList items={selectedRole.platforms} />
                  </DetailSection>
                )}

              {selectedRole.relatedRoles &&
                selectedRole.relatedRoles.length > 0 && (
                  <DetailSection title="Related Roles">
                    <TagList items={selectedRole.relatedRoles} />
                  </DetailSection>
                )}

              {selectedRole.sourcingSignals &&
                selectedRole.sourcingSignals.length > 0 && (
                  <DetailSection title="Sourcing Signals">
                    <TagList items={selectedRole.sourcingSignals} />
                  </DetailSection>
                )}
            </div>

            {selectedRole.recruiterNotes &&
              selectedRole.recruiterNotes.length > 0 && (
                <div className="mt-6 rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recruiter Notes
                  </div>

                  <ul className="space-y-2 text-sm leading-6 text-slate-700">
                    {selectedRole.recruiterNotes.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-muted-foreground">
          No roles found for this selection.
        </div>
      )}
    </div>
  );
}