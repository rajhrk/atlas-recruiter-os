"use client";

import { useMemo, useState } from "react";
import type { SemiconductorRole } from "@/types/semiconductor";

interface Props {
  roles: SemiconductorRole[];
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

export default function SemiconductorRoleExplorer({
  roles,
}: Props) {
  const families = useMemo(
    () =>
      Array.from(
        new Set(roles.map((role) => role.family)),
      ),
    [roles],
  );

  const [selectedFamily, setSelectedFamily] = useState("All");
  const [selectedRoleId, setSelectedRoleId] = useState(
    roles[0]?.id ?? "",
  );

  const filteredRoles =
    selectedFamily === "All"
      ? roles
      : roles.filter(
          (role) => role.family === selectedFamily,
        );

  const selectedRole =
    filteredRoles.find(
      (role) => role.id === selectedRoleId,
    ) ?? filteredRoles[0];

  const handleFamilyChange = (family: string) => {
    setSelectedFamily(family);

    const nextRoles =
      family === "All"
        ? roles
        : roles.filter((role) => role.family === family);

    setSelectedRoleId(nextRoles[0]?.id ?? "");
  };

  return (
    <div className="space-y-6">
      {/* Role family filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
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
            type="button"
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

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Role list */}
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <div className="mb-3 px-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Roles
            </div>

            <div className="mt-1 text-sm text-slate-600">
              {filteredRoles.length} role
              {filteredRoles.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="space-y-1">
            {filteredRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full rounded-lg px-3 py-3 text-left transition ${
                  selectedRole?.id === role.id
                    ? "bg-slate-900 text-white"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="font-medium">
                  {role.title}
                </div>

                <div
                  className={`mt-1 text-xs ${
                    selectedRole?.id === role.id
                      ? "text-slate-300"
                      : "text-muted-foreground"
                  }`}
                >
                  {role.family}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role detail */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          {selectedRole ? (
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {selectedRole.family}
                </div>

                <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                  {selectedRole.title}
                </h3>

                {selectedRole.seniority && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {selectedRole.seniority}
                  </div>
                )}
              </div>

              {/* Aliases */}
              {selectedRole.aliases.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Title Variants
                  </div>

                  <TagList items={selectedRole.aliases} />
                </div>
              )}

              {/* Skills */}
              {selectedRole.skills.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Core Skills
                  </div>

                  <TagList items={selectedRole.skills} />
                </div>
              )}

              {/* Technologies */}
              {selectedRole.technologies.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Technologies
                  </div>

                  <TagList
                    items={selectedRole.technologies}
                  />
                </div>
              )}

              {/* Languages */}
              {selectedRole.languages &&
                selectedRole.languages.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Languages
                    </div>

                    <TagList
                      items={selectedRole.languages}
                    />
                  </div>
                )}

              {/* Methodologies */}
              {selectedRole.methodologies &&
                selectedRole.methodologies.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Methodologies
                    </div>

                    <TagList
                      items={selectedRole.methodologies}
                    />
                  </div>
                )}

              {/* Platforms */}
              {selectedRole.platforms &&
                selectedRole.platforms.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Platforms
                    </div>

                    <TagList
                      items={selectedRole.platforms}
                    />
                  </div>
                )}

              {/* Related roles */}
              {selectedRole.relatedRoles &&
                selectedRole.relatedRoles.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Related Roles
                    </div>

                    <TagList
                      items={selectedRole.relatedRoles}
                    />
                  </div>
                )}

              {/* Sourcing signals */}
              {selectedRole.sourcingSignals &&
                selectedRole.sourcingSignals.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sourcing Signals
                    </div>

                    <TagList
                      items={selectedRole.sourcingSignals}
                    />
                  </div>
                )}

              {/* Recruiter notes */}
              {selectedRole.recruiterNotes &&
                selectedRole.recruiterNotes.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Recruiter Notes
                    </div>

                    <div className="space-y-2">
                      {selectedRole.recruiterNotes.map(
                        (note) => (
                          <div
                            key={note}
                            className="rounded-lg border bg-slate-50 p-3 text-sm leading-6 text-slate-700"
                          >
                            {note}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No semiconductor roles available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}