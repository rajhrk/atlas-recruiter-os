import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import StatsGrid from "@/components/intelligence/StatsGrid";
import type { AIMLDomain } from "@/types/aiMl";

interface TechnicalTalentOverviewProps {
  domain: AIMLDomain;
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

export default function TechnicalTalentOverview({
  domain,
}: TechnicalTalentOverviewProps) {
  const roleFamilies = Array.from(
    new Set(domain.roles.map((role) => role.family)),
  );

  const recommenderAreas = Array.from(
    new Set(domain.recommenderRoles.map((role) => role.area)),
  );

  const companies = Array.from(
    new Set(domain.companyLandscape.map((company) => company.company)),
  );

  const researchAreas = Array.from(
    new Set(
      domain.researchLandscape.flatMap(
        (landscape) => landscape.researchAreas,
      ),
    ),
  );

  const stats = [
    { label: "Roles", value: domain.roles.length },
    { label: "Role Families", value: roleFamilies.length },
    { label: "Companies", value: companies.length },
    { label: "Boolean Strings", value: domain.booleanLibrary.length },
  ];

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />

      <IntelligenceSection title="Role Families">
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
                <div className="font-medium text-slate-900">{family}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {count} role{count === 1 ? "" : "s"}
                </div>
              </div>
            );
          })}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="Core Skills">
        <TagList items={domain.coreSkills} />
      </IntelligenceSection>

      <IntelligenceSection title="Core Technologies">
        <TagList items={domain.coreTechnologies} />
      </IntelligenceSection>

      <IntelligenceSection title="Recommender Systems">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recommenderAreas.map((area) => {
            const count = domain.recommenderRoles.filter(
              (role) => role.area === area,
            ).length;

            return (
              <div
                key={area}
                className="rounded-lg border bg-slate-50 p-4"
              >
                <div className="font-medium text-slate-900">{area}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {count} role{count === 1 ? "" : "s"}
                </div>
              </div>
            );
          })}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="Company Landscape">
        <div className="space-y-3">
          {domain.companyLandscape.map((company) => (
            <div
              key={`${company.company}-${company.region}`}
              className="rounded-lg border p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">
                    {company.company}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {company.region}
                  </div>
                </div>

                {company.commonTitles &&
                  company.commonTitles.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {company.commonTitles.length} common title
                      {company.commonTitles.length === 1 ? "" : "s"}
                    </div>
                  )}
              </div>

              <div className="mt-3">
                <TagList items={company.relevantAreas} />
              </div>

              {company.sourcingKeywords.length > 0 && (
                <div className="mt-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sourcing Keywords
                  </div>
                  <TagList items={company.sourcingKeywords} />
                </div>
              )}

              {company.notes && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {company.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="Research Landscape">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Research Areas
            </h3>
            <TagList items={researchAreas} />
          </div>

          {domain.researchLandscape.map((landscape) => (
            <div
              key={landscape.region}
              className="rounded-lg border p-5"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">
                  {landscape.region}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {landscape.companies.length} companies ·{" "}
                  {landscape.researchOrganizations.length} research
                  organizations
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Companies
                  </div>
                  <TagList items={landscape.companies} />
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Research Organizations
                  </div>
                  <TagList items={landscape.researchOrganizations} />
                </div>

                {landscape.universities &&
                  landscape.universities.length > 0 && (
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Universities
                      </div>
                      <TagList items={landscape.universities} />
                    </div>
                  )}

                {landscape.sourcingSources.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sourcing Sources
                    </div>
                    <TagList items={landscape.sourcingSources} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="Research & Sourcing Signals">
        <div className="grid gap-6 md:grid-cols-2">
          {domain.researchLandscape.map((landscape) => (
            <div
              key={`signals-${landscape.region}`}
              className="rounded-lg border p-5"
            >
              <h3 className="mb-4 font-semibold text-slate-900">
                {landscape.region}
              </h3>

              <div className="space-y-4">
                {landscape.researcherSignals?.length ? (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Researcher Signals
                    </div>
                    <TagList items={landscape.researcherSignals} />
                  </div>
                ) : null}

                {landscape.publicationSignals?.length ? (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Publication Signals
                    </div>
                    <TagList items={landscape.publicationSignals} />
                  </div>
                ) : null}

                {landscape.conferenceSignals?.length ? (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Conference Signals
                    </div>
                    <TagList items={landscape.conferenceSignals} />
                  </div>
                ) : null}

                {landscape.openSourceSignals?.length ? (
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Open Source Signals
                    </div>
                    <TagList items={landscape.openSourceSignals} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="Boolean Library">
        <div className="space-y-4">
          {domain.booleanLibrary.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border p-5"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">
                    {entry.name}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {entry.category}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {entry.useCase}
                </div>
              </div>

              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-green-300">
                {entry.query}
              </pre>
            </div>
          ))}
        </div>
      </IntelligenceSection>

      <IntelligenceSection title="Knowledge Sources">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Conferences
            </h3>
            <TagList items={domain.conferences} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Research Sources
            </h3>
            <TagList items={domain.researchSources} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Developer Sources
            </h3>
            <TagList items={domain.developerSources} />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Patent Sources
          </h3>
          <TagList items={domain.patentSources} />
        </div>
      </IntelligenceSection>
    </div>
  );
}