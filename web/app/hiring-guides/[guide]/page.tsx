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
          category={hiringGuide.category}
          summary={hiringGuide.overview}
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
              value: hiringGuide.targetCompanies.length,
            },
            {
              label: "Skills",
              value: hiringGuide.mustHaveSkills.length,
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
              value: hiringGuide.certifications.length.toString(),
            },
          ]}
        />
      }

    >

      <IntelligenceSection title="Why Hiring Is Difficult">

        <ul className="list-disc space-y-2 pl-6">

          {hiringGuide.whyHireIsDifficult.map((item) => (
            <li key={item}>{item}</li>
          ))}

        </ul>

      </IntelligenceSection>

      <Timeline
        title="Career Path"
        items={hiringGuide.careerPath}
      />

      <BadgeGrid
        title="Must Have Skills"
        badges={hiringGuide.mustHaveSkills}
      />

      <BadgeGrid
        title="Nice To Have Skills"
        badges={hiringGuide.niceToHaveSkills}
      />

      <CompanyGrid
        title="Target Companies"
        companies={hiringGuide.targetCompanies}
      />

      <RecruiterNotesCard
        notes={hiringGuide.recruiterTips}
      />

      <BooleanCard
        examples={hiringGuide.booleanExamples}
      />

      <AIPromptCard
        prompt={hiringGuide.aiPrompt}
      />

    </IntelligencePage>

  );

}