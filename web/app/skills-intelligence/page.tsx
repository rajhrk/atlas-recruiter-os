"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { atlasSkills } from "@/data/atlas/skills";

export default function SkillsIntelligencePage() {
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("All");
  const [specialization, setSpecialization] = useState("All");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  const divisions = useMemo(
    () =>
      Array.from(
        new Set(atlasSkills.map((skill) => skill.division))
      ).sort(),
    []
  );

  const specializations = useMemo(
    () =>
      Array.from(
        new Set(atlasSkills.map((skill) => skill.specialization))
      ).sort(),
    []
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(atlasSkills.map((skill) => skill.category))
      ).sort(),
    []
  );

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return atlasSkills.filter((skill) => {
      const matchesSearch =
        !query ||
        skill.skill.toLowerCase().includes(query) ||
        skill.division.toLowerCase().includes(query) ||
        skill.specialization.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query) ||
        skill.relatedVendors.toLowerCase().includes(query) ||
        skill.relatedJobTitles.toLowerCase().includes(query);

      const matchesDivision =
        division === "All" ||
        skill.division === division;

      const matchesSpecialization =
        specialization === "All" ||
        skill.specialization === specialization;

      const matchesCategory =
        category === "All" ||
        skill.category === category;

      const matchesPriority =
        priority === "All" ||
        skill.priority === Number(priority);

      return (
        matchesSearch &&
        matchesDivision &&
        matchesSpecialization &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [
    search,
    division,
    specialization,
    category,
    priority,
  ]);

  const priority5 = atlasSkills.filter(
    (skill) => skill.priority === 5
  ).length;

  const divisionsCount = divisions.length;

  const categoriesCount = categories.length;

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-10">
      {/* Header */}

      <div>
        <div className="text-sm font-medium text-blue-600">
          ATLAS INTELLIGENCE
        </div>

        <h1 className="mt-2 text-4xl font-bold">
          Skills Intelligence
        </h1>

        <p className="mt-2 max-w-3xl text-lg text-slate-600">
          Data center, critical infrastructure, construction,
          commissioning, networking and AI infrastructure skills
          mapped for recruiters.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Skills"
          value={atlasSkills.length}
          detail="Skills in Atlas"
        />

        <StatCard
          label="Critical Skills"
          value={priority5}
          detail="Priority 5"
        />

        <StatCard
          label="Divisions"
          value={divisionsCount}
          detail="Skill domains"
        />

        <StatCard
          label="Categories"
          value={categoriesCount}
          detail="Skill categories"
        />
      </div>

      {/* Search */}

      <div className="rounded-xl border bg-white p-6">
        <label className="text-sm font-medium text-slate-700">
          Search Skills
        </label>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search skills, vendors, job titles..."
          className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* Filters */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Filter
          label="Division"
          value={division}
          onChange={setDivision}
          options={divisions}
        />

        <Filter
          label="Specialization"
          value={specialization}
          onChange={setSpecialization}
          options={specializations}
        />

        <Filter
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories}
        />

        <Filter
          label="Priority"
          value={priority}
          onChange={setPriority}
          options={["1", "2", "3", "4", "5"]}
        />
      </div>

      {/* Results */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Skills
          </h2>

          <p className="text-sm text-slate-500">
            Showing {filteredSkills.length} of{" "}
            {atlasSkills.length}
          </p>
        </div>

        {(search ||
          division !== "All" ||
          specialization !== "All" ||
          category !== "All" ||
          priority !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setDivision("All");
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

      {/* Skill cards */}

      {filteredSkills.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h3 className="text-xl font-semibold">
            No skills found
          </h3>

          <p className="mt-2 text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.skillId}
              href={`/skills/${encodeURIComponent(
                skill.skill
              )}`}
              className="group rounded-xl border bg-white p-6 transition hover:border-blue-400 hover:shadow-lg"
            >
              {/* Top */}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {skill.division}
                  </div>

                  <h3 className="mt-2 text-xl font-bold group-hover:text-blue-600">
                    {skill.skill}
                  </h3>
                </div>

                <div className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  {"⭐".repeat(skill.priority)}
                </div>
              </div>

              {/* Specialization */}

              <div className="mt-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {skill.specialization}
                </span>

                <span className="ml-2 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                  {skill.category}
                </span>
              </div>

              {/* Recruiter information */}

              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <div className="font-medium text-slate-700">
                    Vendors
                  </div>

                  <div className="mt-1 text-slate-500">
                    {skill.relatedVendors}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-slate-700">
                    Related Role
                  </div>

                  <div className="mt-1 text-slate-500">
                    {skill.relatedJobTitles}
                  </div>
                </div>
              </div>

              {/* Recruiter note */}

              <div className="mt-5 border-t pt-4 text-sm leading-6 text-slate-600">
                {skill.recruiterNotes}
              </div>

              {/* Footer */}

              <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                <span>{skill.skillId}</span>

                <span className="font-medium text-blue-600">
                  View intelligence →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-3xl font-bold">
        {value}
      </div>

      <div className="mt-1 text-xs text-slate-400">
        {detail}
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border bg-white px-3 py-3 text-sm"
      >
        <option value="All">All</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}