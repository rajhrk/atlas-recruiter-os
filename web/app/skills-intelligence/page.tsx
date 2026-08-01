"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { atlasSkills } from "@/data/atlas/skills";

import DetailCard from "@/components/atlas/DetailCard";
import InfoCard from "@/components/atlas/InfoCard";
import SearchParamsBoundary from "@/components/atlas/SearchParamsBoundary";
import AtlasHeader from "@/components/atlas/AtlasHeader";

function SkillsIntelligenceContent() {
  const searchParams = useSearchParams();

  const [selectedSkillId, setSelectedSkillId] = useState(
    atlasSkills[0]?.skillId ?? ""
  );

  useEffect(() => {
    const skillName = searchParams.get("skill");

    if (!skillName) return;

    const skill = atlasSkills.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );

    if (skill) {
      setSelectedSkillId(skill.skillId);
    }
  }, [searchParams]);

  const skill =
    atlasSkills.find((s) => s.skillId === selectedSkillId) ??
    atlasSkills[0];

  if (!skill) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <h1 className="text-4xl font-bold">
          Skills Intelligence
        </h1>

        <p className="mt-4 text-gray-600">
          No skills available.
        </p>
      </main>
    );
  }

  const vendors = skill.relatedVendors
    ? skill.relatedVendors
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  const relatedRoles = skill.relatedJobTitles
    ? skill.relatedJobTitles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const stars =
    typeof skill.priority === "number"
      ? "⭐".repeat(skill.priority)
      : "N/A";

  return (
    <main className="mx-auto max-w-7xl p-8 space-y-8">
      <AtlasHeader
        title="Skills Intelligence"
        description="Recruiter intelligence for technical skills across Data Centers, AI Infrastructure, Critical Facilities and Construction."
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-8">
        <div>
          <h2 className="text-3xl font-bold">
            {skill.skill}
          </h2>

          <p className="mt-2 text-gray-500">
            {skill.division} • {skill.specialization}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <DetailCard
            title="Division"
            value={skill.division}
          />

          <DetailCard
            title="Specialization"
            value={skill.specialization}
          />

          <DetailCard
            title="Category"
            value={skill.category}
          />

          <DetailCard
            title="Priority"
            value={stars}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            title="🏢 Related Vendors"
            items={vendors}
          />

          <InfoCard
            title="💼 Related Job Titles"
            items={relatedRoles}
          />
        </div>

        <div className="rounded-xl border bg-slate-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            📝 Recruiter Notes
          </h3>

          <p className="leading-7 text-gray-700">
            {skill.recruiterNotes}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SkillsIntelligencePage() {
  return (
    <SearchParamsBoundary>
      <SkillsIntelligenceContent />
    </SearchParamsBoundary>
  );
}