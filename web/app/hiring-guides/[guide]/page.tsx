import { notFound } from "next/navigation";

import IntelligencePage from "@/components/intelligence/IntelligencePage";
import IntelligenceHeader from "@/components/intelligence/IntelligenceHeader";
import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import StatsGrid from "@/components/intelligence/StatsGrid";
import QuickFacts from "@/components/intelligence/QuickFacts";
import Timeline from "@/components/intelligence/Timeline";
import CompanyGrid from "@/components/intelligence/CompanyGrid";
import BadgeGrid from "@/components/intelligence/BadgeGrid";
import BooleanCard from "@/components/intelligence/BooleanCard";
import AIPromptCard from "@/components/intelligence/AIPromptCard";
import RecruiterNotesCard from "@/components/intelligence/RecruiterNotesCard";

import { getHiringGuide } from "@/data/hiringGuides";

export default async function HiringGuidePage({
  params,
}: {
  params: Promise<{ guide: string }>;
}) {

  const { guide } = await params;

  const hiringGuide = getHiringGuide(guide);

  if (!hiringGuide) {
    notFound();
  }

  return (

    <IntelligencePage

      header={
       <IntelligenceHeader
  title={hiringGuide.role}
/>
      }

      stats={
        <StatsGrid
          stats={[
            {
              label: "Difficulty",
              value: hiringGuide.marketDifficulty,
            },
            {
              label: "Time to Fill",
              value: hiringGuide.timeToFill,
            },
            {
              label: "Companies",
             value: hiringGuide.targetCompanies?.length ?? 0,
            },
            {
              label: "Skills",
              value: hiringGuide.mustHaveSkills?.length ?? 0,
            },
          ]}
        />
      }

      sidebar={
        <QuickFacts
          items={[
            {
              label: "Category",
              value: hiringGuide.category,
            },
            {
              label: "Market",
              value: hiringGuide.marketDifficulty,
            },
            {
              label: "Time to Fill",
              value: hiringGuide.timeToFill,
            },
            {
              label: "Certifications",
            value: (hiringGuide.certifications?.length ?? 0).toString(),
            },
          ]}
        />
      }

    >

      <IntelligenceSection title="Why Hiring Is Difficult">

        <ul className="list-disc space-y-2 pl-6">

         

        </ul>

      </IntelligenceSection>

      <Timeline
  title="Career Path"
  items={
    hiringGuide.careerPath?.map((item) =>
      typeof item === "string"
        ? item
        : item.title
    ) ?? []
  }
/>

      <CompanyGrid
  title="Target Companies"
  companies={hiringGuide.targetCompanies ?? []}
/>

<RecruiterNotesCard
  notes={hiringGuide.recruiterNotes?.join("\n") ?? ""}
/>

     

      <AIPromptCard
  prompt={hiringGuide.aiPrompt ?? ""}
/>

    </IntelligencePage>

  );

}