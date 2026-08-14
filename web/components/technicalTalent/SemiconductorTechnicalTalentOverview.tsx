import type {
  SemiconductorDomain,
  SemiconductorRole,
  SemiconductorSkill,
  SemiconductorTechnology,
} from "@/types/semiconductor";

interface Props {
  domain: SemiconductorDomain;
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

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function SkillCard({
  skill,
}: {
  skill: SemiconductorSkill;
}) {
  return (
    <div className="rounded-lg border p-5">
      <div>
        <h3 className="font-semibold text-slate-900">
          {skill.name}
        </h3>

        <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {skill.category}
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

            <TagList items={skill.relatedTechnologies} />
          </div>
        )}
    </div>
  );
}

function TechnologyCard({
  technology,
}: {
  technology: SemiconductorTechnology;
}) {
  return (
    <div className="rounded-lg border p-5">
      <div>
        <h3 className="font-semibold text-slate-900">
          {technology.name}
        </h3>

        <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
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

            <TagList items={technology.relatedSkills} />
          </div>
        )}

      {technology.relatedRoles &&
        technology.relatedRoles.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Related Roles
            </div>

            <TagList items={technology.relatedRoles} />
          </div>
        )}
    </div>
  );
}

function RoleFamilyCoverage({
  roles,
}: {
  roles: SemiconductorRole[];
}) {
  const families = Array.from(
    new Set(roles.map((role) => role.family)),
  ).map((family) => ({
    family,
    count: roles.filter((role) => role.family === family).length,
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {families.map(({ family, count }) => (
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
      ))}
    </div>
  );
}

export default function SemiconductorTechnicalTalentOverview({
  domain,
}: Props) {
  const roleFamilies = new Set(
    domain.roles.map((role) => role.family),
  );

  const skillCategories = new Set(
    domain.skills.map((skill) => skill.category),
  );

  const technologyCategories = new Set(
    domain.technologies.map(
      (technology) => technology.category,
    ),
  );

  const stats = [
    {
      label: "Roles",
      value: domain.roles.length,
    },
    {
      label: "Role Families",
      value: roleFamilies.size,
    },
    {
      label: "Skills",
      value: domain.skills.length,
    },
    {
      label: "Technologies",
      value: domain.technologies.length,
    },
    {
      label: "Skill Categories",
      value: skillCategories.size,
    },
    {
      label: "Technology Categories",
      value: technologyCategories.size,
    },
    {
      label: "Boolean Strings",
      value: domain.booleanLibrary.length,
    },
    {
      label: "Research Sources",
      value: domain.researchSources.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>

            <div className="mt-2 text-2xl font-bold text-slate-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Role Family Coverage */}
      <Section
        title="Role Family Coverage"
        description="The semiconductor role taxonomy represented in Atlas."
      >
        <RoleFamilyCoverage roles={domain.roles} />
      </Section>

      {/* Skills */}
      <Section
        title="Semiconductor Skills"
        description="Core semiconductor engineering capabilities and their relationships to roles and technologies."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {domain.skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
            />
          ))}
        </div>
      </Section>

      {/* Technologies */}
      <Section
        title="Semiconductor Technologies"
        description="HDLs, verification environments, EDA platforms, timing tools, DFT technologies, FPGA platforms, and semiconductor interfaces."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {domain.technologies.map((technology) => (
            <TechnologyCard
              key={technology.id}
              technology={technology}
            />
          ))}
        </div>
      </Section>

      {/* Research Landscape */}
      <Section
        title="Semiconductor Research Landscape"
        description="Research, conference, publication, patent, and open-source signals useful for semiconductor talent sourcing."
      >
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Research Areas
            </div>

            <TagList
              items={
                domain.researchLandscape.researchAreas
              }
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Conferences
            </div>

            <TagList
              items={
                domain.researchLandscape.conferences
              }
            />
          </div>

          {domain.researchLandscape.journals &&
            domain.researchLandscape.journals.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Journals
                </div>

                <TagList
                  items={
                    domain.researchLandscape.journals
                  }
                />
              </div>
            )}

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Research Sources
            </div>

            <TagList
              items={
                domain.researchLandscape.researchSources
              }
            />
          </div>

          {domain.researchLandscape.researchLabs &&
            domain.researchLandscape.researchLabs.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Research Labs
                </div>

                <TagList
                  items={
                    domain.researchLandscape.researchLabs
                  }
                />
              </div>
            )}

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Publication Signals
              </div>

              <TagList
                items={
                  domain.researchLandscape
                    .publicationSignals
                }
              />
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Patent Signals
              </div>

              <TagList
                items={
                  domain.researchLandscape.patentSignals
                }
              />
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Open Source Signals
              </div>

              <TagList
                items={
                  domain.researchLandscape
                    .openSourceSignals
                }
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Boolean Library */}
      <Section
        title="Boolean Library"
        description="Ready-to-use sourcing queries for common semiconductor searches."
      >
        <div className="space-y-4">
          {domain.booleanLibrary.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border p-5"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="font-semibold text-slate-900">
                  {entry.name}
                </div>

                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {entry.category}
                </div>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {entry.useCase}
              </p>

              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                <code>{entry.query}</code>
              </pre>
            </div>
          ))}
        </div>
      </Section>

      {/* Knowledge Sources */}
      <Section
        title="Knowledge Sources"
        description="Technical ecosystems that can support deeper semiconductor talent research."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {domain.researchSources.map((source) => (
            <div
              key={source}
              className="rounded-lg border bg-slate-50 p-4"
            >
              <div className="font-medium text-slate-900">
                {source}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}