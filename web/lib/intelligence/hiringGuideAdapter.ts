import { HiringGuide } from "@/data/hiringGuides/types";
import {
  BooleanExample,
  IntelligenceObject,
  IntelligenceStat,
  Relationship,
  SidebarItem,
  TimelineItem,
} from "@/types/intelligence";

export function toIntelligenceObject(
  guide: HiringGuide
): IntelligenceObject {

  const stats: IntelligenceStat[] = [
    {
      label: "Market Difficulty",
      value: guide.marketDifficulty,
    },
    {
      label: "Time to Fill",
      value: guide.timeToFill,
    },
    {
      label: "Certifications",
     value: (guide.certifications ?? []).length,
    },
  ];

  const sidebar: SidebarItem[] = [
    {
      label: "Category",
      value: guide.category,
    },
    {
      label: "Market",
      value: guide.marketDifficulty,
    },
    {
      label: "Time to Fill",
      value: guide.timeToFill,
    },
  ];

 const careerPath: TimelineItem[] =
  guide.careerPath ?? [];

  const booleanExamples: BooleanExample[] =
  (guide.booleanStrings ?? []).map((query, index) => ({
    title: `Boolean ${index + 1}`,
    query,
  }));

  const relatedCompanies: Relationship[] =
  (guide.targetCompanies ?? []).map((company, index) => ({
      id: `${index}`,
      label: company,
      type: "company",
    }));

  return {

    id: guide.id,

    title: guide.role,

    category: guide.category,

    summary: guide.overview,

    overview: guide.overview,

    stats,

    sidebar,

    recruiterNotes: guide.recruiterTips,

    interviewQuestions: guide.interviewQuestions,

    redFlags: guide.redFlags,

    responsibilities: guide.responsibilities,

    careerPath,

    mustHaveSkills: guide.mustHaveSkills,

    niceToHaveSkills: guide.niceToHaveSkills,

    targetCompanies: guide.targetCompanies,

    certifications: guide.certifications,

    booleanExamples,

    aiPrompt: guide.aiPrompt,

    relatedCompanies,

  };

}