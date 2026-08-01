"use client";

import Link from "next/link";

import { useAtlas } from "@/context/AtlasContext";
import {
  getRoleByName,
  getSkillsForRole,
} from "@/lib/atlas/service";

function toArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") {
          return item
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        }

        return String(item);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [String(value)];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface BadgeListProps {
  items: string[];
  type?: "company" | "skill" | "certification" | "conference";
}

function BadgeList({
  items,
  type = "conference",
}: BadgeListProps) {
  if (items.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        No data available.
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item, index) => {
        let href = "#";

        switch (type) {
          case "company":
            href = `/company/${slugify(item)}`;
            break;

          case "skill":
            href = `/skills/${encodeURIComponent(item)}`;
            break;

          case "certification":
            href = `/certifications/${encodeURIComponent(item)}`;
            break;

          case "conference":
            href = "#";
            break;
        }

        if (href === "#") {
          return (
            <span
              key={`${item}-${index}`}
              className="rounded-full border bg-muted px-3 py-1 text-sm"
            >
              {item}
            </span>
          );
        }

        return (
          <Link
            key={`${item}-${index}`}
            href={href}
            className="rounded-full border bg-muted px-3 py-1 text-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
}

export default function OverviewTab() {
  const { selectedRole } = useAtlas();

  const role = getRoleByName(selectedRole);
  const mappedSkills = getSkillsForRole(selectedRole);

  if (!role) {
    return (
      <div className="rounded-lg border p-6">
        <p>No recruiter intelligence found for this role.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {/* Role */}
      <div className="rounded-xl border p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          👤 Role
        </h3>

        <p className="mt-3 text-2xl font-bold">
          {role.role}
        </p>
      </div>

      {/* Companies */}
      <div className="rounded-xl border p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          🏢 Target Companies
        </h3>

        <BadgeList
          items={toArray((role as any).targetCompanies)}
          type="company"
        />
      </div>

      {/* Core Skills */}
      <div className="rounded-xl border p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          🧠 Core Skills
        </h3>

        <BadgeList
          items={toArray((role as any).coreSkills)}
          type="skill"
        />
      </div>

      {/* Mapped Skills */}
      <div className="rounded-xl border p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          ⚡ Mapped Skills
        </h3>

        {mappedSkills.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No mapped skills found.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {mappedSkills.map((skill) => (
              <Link
                key={skill.skillId}
                href={`/skills/${encodeURIComponent(skill.skill)}`}
                className="rounded-full border bg-muted px-3 py-1 text-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
              >
                {skill.skill}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="rounded-xl border p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          🎓 Certifications
        </h3>

        <BadgeList
          items={toArray((role as any).certifications)}
          type="certification"
        />
      </div>

      {/* Conferences */}
      <div className="rounded-xl border p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          📅 Conferences
        </h3>

        <BadgeList
          items={toArray((role as any).conferences)}
        />
      </div>

      {/* Recruiter Notes */}
      <div className="rounded-xl border p-5 md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          📝 Recruiter Notes
        </h3>

        <p className="mt-3 leading-7">
          {(role as any).recruiterNotes ||
            "No recruiter notes available."}
        </p>
      </div>
    </div>
  );
}