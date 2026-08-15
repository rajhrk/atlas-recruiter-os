"use client";

import { useMemo, useState } from "react";

import {
  discoverTechnicalTalent,
} from "@/lib/technicalTalent/technicalTalentDiscoveryEngine";

import type {
  DiscoveryConfidence,
  DiscoveryTechnicalDomain,
  TechnicalTalentDiscoveryRecord,
} from "@/types/technicalTalentDiscovery";

const DOMAINS: DiscoveryTechnicalDomain[] = [
  "AI / ML",
  "Robotics",
  "Hardware / Embedded",
  "Semiconductor",
];

const CONFIDENCE_OPTIONS: DiscoveryConfidence[] = [
  "Low",
  "Medium",
  "High",
  "Very High",
];

type ResultCardProps = {
  record: TechnicalTalentDiscoveryRecord;
};

function ResultCard({
  record,
}: ResultCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            {record.name}
          </h3>

          {record.headline && (
            <p className="mt-1 text-sm text-slate-600">
              {record.headline}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {record.primaryDomain}
          </span>

          {record.talentType && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {record.talentType}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {record.roleFamily && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Role Family
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {record.roleFamily}
            </p>
          </div>
        )}

        {record.seniority && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Seniority
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {record.seniority}
            </p>
          </div>
        )}

        {record.confidence && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Confidence
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {record.confidence}
            </p>
          </div>
        )}
      </div>

      {record.skills.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Skills
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {record.skills.slice(0, 8).map((skill) => (
              <span
                key={`${record.id}-skill-${skill.name}`}
                className="rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {record.technologies.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Technologies
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {record.technologies.slice(0, 8).map((technology) => (
              <span
                key={`${record.id}-technology-${technology.name}`}
                className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700"
              >
                {technology.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {record.researchAreas &&
        record.researchAreas.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Research Areas
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {record.researchAreas
                .slice(0, 6)
                .map((area) => (
                  <span
                    key={`${record.id}-research-${area}`}
                    className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700"
                  >
                    {area}
                  </span>
                ))}
            </div>
          </div>
        )}

      {record.sourcingSignals &&
        record.sourcingSignals.length > 0 && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Sourcing Signals
            </p>

            <ul className="mt-2 space-y-1">
              {record.sourcingSignals
                .slice(0, 3)
                .map((signal, index) => (
                  <li
                    key={`${record.id}-signal-${index}`}
                    className="text-sm text-slate-700"
                  >
                    <span className="font-medium">
                      {signal.signal}
                    </span>

                    {signal.explanation && (
                      <span className="text-slate-500">
                        {" "}
                        — {signal.explanation}
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">
          Approval: {record.approvalStatus}
        </span>

        <span className="text-xs text-slate-400">
          Atlas role intelligence
        </span>
      </div>
    </article>
  );
}

export default function TechnicalTalentDiscovery() {
  const [keywords, setKeywords] = useState("");
  const [selectedDomains, setSelectedDomains] =
    useState<DiscoveryTechnicalDomain[]>([]);

  const [confidence, setConfidence] =
    useState<DiscoveryConfidence | "">("");

  const [researchFocused, setResearchFocused] =
    useState(false);

  const [openSourceFocused, setOpenSourceFocused] =
    useState(false);

  const [patentFocused, setPatentFocused] =
    useState(false);

  const [crossDomainOnly, setCrossDomainOnly] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  const result = useMemo(() => {
    if (!hasSearched) {
      return null;
    }

    const parsedKeywords = keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    return discoverTechnicalTalent({
      keywords:
        parsedKeywords.length > 0
          ? parsedKeywords
          : undefined,

      domains:
        selectedDomains.length > 0
          ? selectedDomains
          : undefined,

      minimumConfidence:
        confidence || undefined,

      researchFocused,

      openSourceFocused,

      patentFocused,

      crossDomainOnly,

      limit: 50,
    });
  }, [
    keywords,
    selectedDomains,
    confidence,
    researchFocused,
    openSourceFocused,
    patentFocused,
    crossDomainOnly,
    hasSearched,
  ]);

  function toggleDomain(
    domain: DiscoveryTechnicalDomain,
  ) {
    setSelectedDomains((current) => {
      if (current.includes(domain)) {
        return current.filter(
          (item) => item !== domain,
        );
      }

      return [...current, domain];
    });
  }

  function clearSearch() {
    setKeywords("");
    setSelectedDomains([]);
    setConfidence("");
    setResearchFocused(false);
    setOpenSourceFocused(false);
    setPatentFocused(false);
    setCrossDomainOnly(false);
    setHasSearched(false);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Cross-Domain Discovery
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Find technical talent across Atlas domains
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Search the normalized technical talent intelligence
            layer across AI / ML, Robotics, Hardware / Embedded,
            and Semiconductor.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="technical-talent-keywords"
            className="text-sm font-medium text-slate-800"
          >
            Keywords
          </label>

          <input
            id="technical-talent-keywords"
            type="text"
            value={keywords}
            onChange={(event) =>
              setKeywords(event.target.value)
            }
            placeholder="e.g. C++, robotics, perception"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Use commas to search for multiple terms.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-800">
            Technical domains
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {DOMAINS.map((domain) => {
              const active =
                selectedDomains.includes(domain);

              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() =>
                    toggleDomain(domain)
                  }
                  className={[
                    "rounded-full border px-4 py-2 text-sm transition",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                  ].join(" ")}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="technical-confidence"
              className="text-sm font-medium text-slate-800"
            >
              Minimum confidence
            </label>

            <select
              id="technical-confidence"
              value={confidence}
              onChange={(event) =>
                setConfidence(
                  event.target
                    .value as
                    | DiscoveryConfidence
                    | "",
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
            >
              <option value="">
                Any confidence
              </option>

              {CONFIDENCE_OPTIONS.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={researchFocused}
              onChange={(event) =>
                setResearchFocused(
                  event.target.checked,
                )
              }
            />

            <span className="text-sm text-slate-700">
              Research-focused
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={openSourceFocused}
              onChange={(event) =>
                setOpenSourceFocused(
                  event.target.checked,
                )
              }
            />

            <span className="text-sm text-slate-700">
              Open-source focused
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={patentFocused}
              onChange={(event) =>
                setPatentFocused(
                  event.target.checked,
                )
              }
            />

            <span className="text-sm text-slate-700">
              Patent-focused
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={crossDomainOnly}
              onChange={(event) =>
                setCrossDomainOnly(
                  event.target.checked,
                )
              }
            />

            <span className="text-sm text-slate-700">
              Cross-domain profiles only
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setHasSearched(true)}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Search technical talent
          </button>

          <button
            type="button"
            onClick={clearSearch}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-950">
                {result.total} matching technical roles
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Deterministic Atlas discovery results
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              Showing {result.candidates.length}
            </span>
          </div>

          {result.candidates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium text-slate-900">
                No matching technical roles found.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try broader keywords or remove one of the
                filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {result.candidates.map(
                (record) => (
                  <ResultCard
                    key={record.id}
                    record={record}
                  />
                ),
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}