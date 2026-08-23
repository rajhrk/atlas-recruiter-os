"use client";

import { useState } from "react";

type Candidate = {
  id: string;
  name: string;
  headline?: string;
  primaryDomain: string;
  normalizedRole?: string;
  fitScore?: { overall: number };
  verification?: { status: string; score: number; independentSourceCount: number; evidenceCount: number };
  evidence: Array<{ id: string; source: string; title: string; confidence: string; date?: string; url?: string; supports?: string[] }>;
};

type EvidenceFirstResult = {
  records: Candidate[];
  total: number;
  blockedCandidateCount: number;
  evidenceGates: Array<{ candidateId: string; status: string; warnings: string[]; unsupportedClaimCount: number }>;
  sourceBiasAudit: {
    riskLevel: string;
    risks: string[];
    missingCoverage: string[];
    sourcesRequested: string[];
    sourcesSuccessful: string[];
    sourcesFailed: string[];
    coverage: Array<{ source: string; recordCount: number; evidenceCount: number; capabilities: string[]; warnings: string[] }>;
  };
  ecosystemMap: {
    candidateCount: number;
    skillCount: number;
    technologyCount: number;
    repositoryCount: number;
    nodes: Array<{ id: string; type: string; label: string }>;
    edges: Array<{ source: string; target: string; type: string }>;
  };
};

const SOURCES = ["GitHub", "Semantic Scholar", "OpenReview"] as const;

export default function EvidenceFirstTalentPage() {
  const [keywords, setKeywords] = useState("robotics");
  const [sources, setSources] = useState<string[]>([...SOURCES]);
  const [result, setResult] = useState<EvidenceFirstResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSource(source: string) {
    setSources((current) =>
      current.includes(source)
        ? current.filter((item) => item !== source)
        : [...current, source],
    );
  }

  async function search() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/technical-talent/evidence-first", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.split(",").map((item) => item.trim()).filter(Boolean),
          sources,
          limit: 25,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Evidence-first discovery failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evidence-first discovery failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Evidence-First Discovery
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Find evidence → find people
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Atlas only promotes candidates that pass the evidence gate. Every claim is traceable to source evidence, while the ecosystem map connects skills, technologies, repositories, and contributors.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="text-sm font-medium text-slate-800" htmlFor="evidence-first-keywords">
                Evidence search
              </label>
              <input
                id="evidence-first-keywords"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                placeholder="robotics, perception, ROS2"
              />
            </div>
            <button
              type="button"
              onClick={search}
              disabled={loading || sources.length === 0}
              className="self-end rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Searching evidence…" : "Search evidence"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SOURCES.map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => toggleSource(source)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  sources.includes(source)
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {source}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
        </section>

        {result && (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <Metric label="Eligible candidates" value={result.total} />
              <Metric label="Blocked by evidence gate" value={result.blockedCandidateCount} />
              <Metric label="Technologies" value={result.ecosystemMap.technologyCount} />
              <Metric label="Repositories" value={result.ecosystemMap.repositoryCount} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Source-Bias Auditor</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">{result.sourceBiasAudit.riskLevel} risk</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Successful: {result.sourceBiasAudit.sourcesSuccessful.length}</span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">Failed: {result.sourceBiasAudit.sourcesFailed.length}</span>
                </div>
              </div>

              {result.sourceBiasAudit.risks.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-amber-800">
                  {result.sourceBiasAudit.risks.map((risk) => <li key={risk}>⚠ {risk}</li>)}
                </ul>
              )}

              {result.sourceBiasAudit.missingCoverage.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {result.sourceBiasAudit.missingCoverage.map((item) => <li key={item}>Coverage gap: {item}</li>)}
                </ul>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {result.sourceBiasAudit.coverage.map((item) => (
                  <div key={item.source} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-medium text-slate-900">{item.source}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.recordCount} records · {item.evidenceCount} evidence items</p>
                    <p className="mt-2 text-xs text-slate-500">Capabilities: {item.capabilities.join(", ") || "none reported"}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Technical Ecosystem Map</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">Skill → technology → repository → contributor</h2>
                </div>
                <span className="text-xs text-slate-500">{result.ecosystemMap.nodes.length} nodes · {result.ecosystemMap.edges.length} edges</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Metric label="Candidates" value={result.ecosystemMap.candidateCount} />
                <Metric label="Skills" value={result.ecosystemMap.skillCount} />
                <Metric label="Technologies" value={result.ecosystemMap.technologyCount} />
                <Metric label="Repositories" value={result.ecosystemMap.repositoryCount} />
              </div>
            </section>

            <section className="space-y-4">
              {result.records.map((candidate) => {
                const gate = result.evidenceGates.find((item) => item.candidateId === candidate.id);
                return (
                  <article key={candidate.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">{candidate.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">{candidate.headline ?? candidate.normalizedRole ?? candidate.primaryDomain}</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Gate: {gate?.status}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Fit: {candidate.fitScore?.overall ?? 0}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <Metric label="Evidence" value={candidate.evidence.length} />
                      <Metric label="Sources" value={candidate.verification?.independentSourceCount ?? 0} />
                      <Metric label="Verification" value={candidate.verification?.score ?? 0} />
                    </div>

                    <div className="mt-4 space-y-2">
                      {candidate.evidence.slice(0, 8).map((item) => (
                        <div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-slate-900">{item.title}</span>
                            <span className="text-xs text-slate-500">{item.source} · {item.confidence}{item.date ? ` · ${item.date}` : ""}</span>
                          </div>
                          {item.supports && item.supports.length > 0 && (
                            <p className="mt-1 text-xs text-slate-500">Supports: {item.supports.slice(0, 5).join(", ")}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
