import Link from "next/link";
import { notFound } from "next/navigation";

import IntelligenceHeader from "@/components/intelligence/IntelligenceHeader";
import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import BadgeGrid from "@/components/intelligence/BadgeGrid";
import BooleanCard from "@/components/intelligence/BooleanCard";
import AIPromptCard from "@/components/intelligence/AIPromptCard";
import RecruiterNotesCard from "@/components/intelligence/RecruiterNotesCard";

import { getRoleByName } from "@/lib/atlas/service";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export default async function RolePage({ params }: Props) {
  const { slug } = await params;

  const roleName = decodeURIComponent(slug).replace(/-/g, " ");

  const role = getRoleByName(roleName);

  if (!role) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <Link
        href="/recruiter-search"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Recruiter Search
      </Link>

      <IntelligenceHeader
        title={role.role}
        subtitle="Atlas Role Intelligence"
      />

      <IntelligenceSection title="Target Companies">
        <BadgeGrid
          items={role.targetCompanies.map((company) => ({
            label: company,
            href: `/company/${slugify(company)}`,
          }))}
          emptyMessage="No target companies mapped."
        />
      </IntelligenceSection>

      <IntelligenceSection title="Core Skills">
        <BadgeGrid
          items={role.coreSkills.map((skill) => ({
            label: skill,
            href: `/skills/${slugify(skill)}`,
          }))}
          emptyMessage="No mapped skills."
        />
      </IntelligenceSection>

      <IntelligenceSection title="Certifications">
        <BadgeGrid
          items={role.certifications.map((certification) => ({
            label: certification,
            href: `/certifications/${slugify(certification)}`,
          }))}
          emptyMessage="No certifications mapped."
        />
      </IntelligenceSection>

      <IntelligenceSection title="Conferences">
        <BadgeGrid
          items={role.conferences.map((conference) => ({
            label: conference,
          }))}
          emptyMessage="No conferences mapped."
        />
      </IntelligenceSection>

      <IntelligenceSection title="Boolean Search">
        <BooleanCard booleanSearch={role.booleanSearch} />
      </IntelligenceSection>

      <IntelligenceSection title="AI Recruiter Prompt">
        <AIPromptCard prompt={role.aiPrompt} />
      </IntelligenceSection>

      <IntelligenceSection title="Recruiter Notes">
        <RecruiterNotesCard notes={role.recruiterNotes} />
      </IntelligenceSection>
    </main>
  );
}