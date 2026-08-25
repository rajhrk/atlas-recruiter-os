"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { atlasSkills } from "@/data/atlas/skills";
import { TALENT_DOMAINS } from "@/lib/atlas/talentDomains";
import { useAtlas } from "@/context/AtlasContext";
import AtlasHeader from "@/components/atlas/AtlasHeader";

export default function SkillsIntelligencePage() {
  const { selectedDomain } = useAtlas();
  const domain = TALENT_DOMAINS.find((item) => item.id === selectedDomain)!;

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  const domainTerms = useMemo(() => {
    const roleTerms = domain.roles.map((role) => role.toLowerCase());
    const skillTerms = domain.preview.mappedSkills.map((skill) => skill.toLowerCase());
    const coreTerms = domain.preview.coreSkills.map((skill) => skill.toLowerCase());
    return [...roleTerms, ...skillTerms, ...coreTerms];
  }, [domain]);

  const domainSkills = useMemo(() => {
    const matchesDomain = (skill: (typeof atlasSkills)[number]) => {
      const searchable = [
        skill.skill,
        skill.division,
        skill.specialization,
        skill.category,
        skill.relatedVendors,
        skill.relatedJobTitles,
        skill.recruiterNotes,
      ].join(" ").toLowerCase();

      return domainTerms.some((term) => searchable.includes(term));
    };

    const matched = atlasSkills.filter(matchesDomain);

    // During the domain transition, keep the UI useful even where the legacy
    // skills dataset has not yet been fully mapped to the new taxonomy.
    return matched.length > 0 ? matched : atlasSkills;
  }, [domainTerms]);

  const specializations = useMemo(
    () => Array.from(new Set(domainSkills.map((skill) => skill.specialization))).sort(),
    [domainSkills],
  );

  const categories = useMemo(
    () => Array.from(new Set(domainSkills.map((skill) => skill.category))).sort(),
    [domainSkills],
  );

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return domainSkills.filter((skill) => {
      const searchable = [
        skill.skill,
        skill.division,
        skill.specialization,
        skill.category,
        skill.relatedVendors,
        skill.relatedJobTitles,
      ].join(" ").toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (specialization === "All" || skill.specialization === specialization) &&
        (category === "All" || skill.category === category) &&
        (priority === "All" || skill.priority === Number(priority))
      );
    });
  }, [domainSkills, search, specialization, category, priority]);

  const priority5 = domainSkills.filter((skill) => skill.priority === 5).length;

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">
      <AtlasHeader
        title={`${domain.label} Skills Intelligence`}
        description={`Technical skills intelligence for ${domain.label.toLowerCase()} recruiting.`}
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-blue-600">
          {domain.icon} {domain.label} TALENT DOMAIN
        </div>
        <h2 className="mt-2 text-2xl font-bold">Skills mapped to {domain.label}</h2>
        <p className="mt-2 text-slate-600">
          Showing the skills Atlas currently associates with this talent domain.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Domain Skills" value={domainSkills.length} detail={`${domain.label} mapped skills`} />
        <StatCard label="Critical Skills" value={priority5} detail="Priority 5" />
        <StatCard label="Specializations" value={specializations.length} detail="Domain specializations" />
        <StatCard label="Categories" value={categories.length} detail="Skill categories" />
      </div>

      <div className="rounded-xl border bg-white p-6">
        <label className="text-sm font-medium text-slate-700">Search {domain.label} Skills</label>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${domain.label.toLowerCase()} skills, vendors, roles...`}
          className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Filter label="Specialization" value={specialization} onChange={setSpecialization} options={specializations} />
        <Filter label="Category" value={category} onChange={setCategory} options={categories} />
        <Filter label="Priority" value={priority} onChange={setPriority} options={["1", "2", "3", "4", "5"]} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{domain.label} Skills</h2>
          <p className="text-sm text-slate-500">Showing {filteredSkills.length} of {domainSkills.length}</p>
        </div>

        {(search || specialization !== "All" || category !== "All" || priority !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setSpecialization("All");
              setCategory("All");
              setPriority("All");
            }}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredSkills.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h3 className="text-xl font-semibold">No skills found</h3>
          <p className="mt-2 text-slate-500">Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.skillId}
              href={`/skills/${encodeURIComponent(skill.skill)}`}
              className="group rounded-xl border bg-white p-6 transition hover:border-blue-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-blue-600">{skill.division}</div>
                  <h3 className="mt-2 text-xl font-bold group-hover:text-blue-600">{skill.skill}</h3>
                </div>
                <div className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  {"⭐".repeat(skill.priority)}
                </div>
              </div>

              <div className="mt-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{skill.specialization}</span>
                <span className="ml-2 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{skill.category}</span>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <div className="font-medium text-slate-700">Vendors</div>
                  <div className="mt-1 text-slate-500">{skill.relatedVendors}</div>
                </div>
                <div>
                  <div className="font-medium text-slate-700">Related Role</div>
                  <div className="mt-1 text-slate-500">{skill.relatedJobTitles}</div>
                </div>
              </div>

              <div className="mt-5 border-t pt-4 text-sm leading-6 text-slate-600">{skill.recruiterNotes}</div>

              <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                <span>{skill.skillId}</span>
                <span className="font-medium text-blue-600">View intelligence →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{detail}</div>
    </div>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border bg-white px-3 py-3 text-sm">
        <option value="All">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}
