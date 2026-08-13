import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import StatsGrid from "@/components/intelligence/StatsGrid";
import type { RoboticsDomain } from "@/types/robotics";

interface RoboticsTechnicalTalentOverviewProps {
  domain: RoboticsDomain;
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

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-xl border bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {title}
          </h2>

          <span className="text-sm text-muted-foreground transition-transform group-open:rotate-180">
            ▼
          </span>
        </div>
      </summary>

      <div className="border-t px-6 py-6">{children}</div>
    </details>
  );
}

export default function RoboticsTechnicalTalentOverview({
  domain,
}: RoboticsTechnicalTalentOverviewProps) {
  const roleFamilies = Array.from(
    new Set(domain.roles.map((role) => role.family)),
  );

  const stats = [
    {
      label: "Roles",
      value: domain.roles.length,
    },
    {
      label: "Role Families",
      value: roleFamilies.length,
    },
    {
      label: "Skills",
      value: domain.skills.length,
    },
    {
      label: "Technologies",
      value: domain.technologies.length,
    },
  ];

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />

      <CollapsibleSection title="Role Family Coverage">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {roleFamilies.map((family) => {
            const count = domain.roles.filter(
              (role) => role.family === family,
            ).length;

            return (
              <div
                key={family}
                className="rounded-lg border bg-slate-50 p-4"
              >
                <div className="font-medium text-slate-900">
                  {family}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  {count} role{count === 1 ? "" : "s"}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Robotics Skills">
        <div className="space-y-4">
          {domain.skills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-lg border p-5"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {skill.name}
                  </h3>

                  <div className="mt-1 text-sm text-muted-foreground">
                    {skill.category}
                  </div>
                </div>
              </div>

              {skill.description && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {skill.description}
                </p>
              )}

              {skill.relatedRoles &&
                skill.relatedRoles.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Related Roles
                    </div>

                    <TagList items={skill.relatedRoles} />
                  </div>
                )}

              {skill.relatedTechnologies &&
                skill.relatedTechnologies.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Related Technologies
                    </div>

                    <TagList
                      items={skill.relatedTechnologies}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Robotics Technologies">
        <div className="space-y-4">
          {domain.technologies.map((technology) => (
            <div
              key={technology.id}
              className="rounded-lg border p-5"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {technology.name}
                </h3>

                <div className="mt-1 text-sm text-muted-foreground">
                  {technology.category}
                </div>
              </div>

              {technology.description && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {technology.description}
                </p>
              )}

              {technology.relatedSkills &&
                technology.relatedSkills.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Related Skills
                    </div>

                    <TagList
                      items={technology.relatedSkills}
                    />
                  </div>
                )}

              {technology.relatedRoles &&
                technology.relatedRoles.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Related Roles
                    </div>

                    <TagList
                      items={technology.relatedRoles}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Research Landscape">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Research Areas
            </h3>

            <TagList
              items={domain.researchLandscape.researchAreas}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Conferences
            </h3>

            <TagList
              items={domain.researchLandscape.conferences}
            />
          </div>

          {domain.researchLandscape.journals &&
            domain.researchLandscape.journals.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Journals
                </h3>

                <TagList
                  items={domain.researchLandscape.journals}
                />
              </div>
            )}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Research Sources
            </h3>

            <TagList
              items={domain.researchLandscape.researchSources}
            />
          </div>

          {domain.researchLandscape.researchLabs &&
            domain.researchLandscape.researchLabs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Research Labs
                </h3>

                <TagList
                  items={domain.researchLandscape.researchLabs}
                />
              </div>
            )}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Publication Signals
            </h3>

            <TagList
              items={domain.researchLandscape.publicationSignals}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Patent Signals
            </h3>

            <TagList
              items={domain.researchLandscape.patentSignals}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Open Source Signals
            </h3>

            <TagList
              items={domain.researchLandscape.openSourceSignals}
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Boolean Library">
        <div className="space-y-4">
          {domain.booleanLibrary.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border p-5"
            >
              <div className="font-semibold text-slate-900">
                {entry.name}
              </div>

              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                {entry.category}
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                {entry.useCase}
              </div>

              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-green-300">
                {entry.query}
              </pre>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Robotics Knowledge Sources">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Conferences
            </h3>

            <TagList
              items={domain.conferences}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Research Sources
            </h3>

            <TagList
              items={domain.researchSources}
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Research Areas
            </h3>

            <TagList
              items={domain.researchLandscape.researchAreas}
            />
          </div>

          {domain.researchLandscape.researchLabs &&
            domain.researchLandscape.researchLabs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Research Labs
                </h3>

                <TagList
                  items={domain.researchLandscape.researchLabs}
                />
              </div>
            )}
        </div>
      </CollapsibleSection>
    </div>
  );
}