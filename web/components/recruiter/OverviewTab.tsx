"use client";

import Link from "next/link";

import { useAtlas } from "@/context/AtlasContext";
import { TALENT_DOMAINS } from "@/lib/atlas/talentDomains";
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
          return item.split(",").map((v) => v.trim()).filter(Boolean);
        }
        return String(item);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
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

function BadgeList({ items, type = "conference" }: BadgeListProps) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">No data available.</p>;
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
        }

        if (href === "#") {
          return (
            <span key={`${item}-${index}`} className="rounded-full border bg-muted px-3 py-1 text-sm">
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
  const { selectedDomain, selectedRole } = useAtlas();
  const domain = TALENT_DOMAINS.find((item) => item.id === selectedDomain)!;
  const role = getRoleByName(selectedRole);
  const mappedSkills = role ? getSkillsForRole(selectedRole) : [];
  const preview = domain.preview;

  const data = role
    ? {
        role: role.role,
        targetCompanies: toArray((role as any).targetCompanies),
        coreSkills: toArray((role as any).coreSkills),
        mappedSkills: mappedSkills.map((skill) => skill.skill),
        certifications: toArray((role as any).certifications),
        conferences: toArray((role as any).conferences),
        notes: (role as any).recruiterNotes,
      }
    : {
        role: domain.defaultRole,
        targetCompanies: [...preview.targetCompanies],
        coreSkills: [...preview.coreSkills],
        mappedSkills: [...preview.mappedSkills],
        certifications: [...preview.certifications],
        conferences: [...preview.conferences],
        notes: preview.notes,
      };

  return (
    <div className="space-y-4">
      {!role && (
        <div className="rounded-xl border bg-slate-50 p-4 text-sm text-muted-foreground">
          Showing {domain.label} domain intelligence. Select a role above to load role-specific Atlas data.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h3 className="text-sm font-medium text-muted-foreground">👤 Role</h3>
          <p className="mt-3 text-2xl font-bold">{data.role}</p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm font-medium text-muted-foreground">🏢 Target Companies</h3>
          <BadgeList items={data.targetCompanies} type="company" />
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm font-medium text-muted-foreground">🧠 Core Skills</h3>
          <BadgeList items={data.coreSkills} type="skill" />
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm font-medium text-muted-foreground">⚡ Mapped Skills</h3>
          <BadgeList items={data.mappedSkills} type="skill" />
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm font-medium text-muted-foreground">🎓 Certifications</h3>
          <BadgeList items={data.certifications} type="certification" />
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm font-medium text-muted-foreground">📅 Conferences</h3>
          <BadgeList items={data.conferences} />
        </div>

        <div className="rounded-xl border p-5 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">📝 Recruiter Notes</h3>
          <p className="mt-3 leading-7">{data.notes || "No recruiter notes available."}</p>
        </div>
      </div>
    </div>
  );
}
