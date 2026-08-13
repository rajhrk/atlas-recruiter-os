import { notFound } from "next/navigation";

import IntelligencePage from "@/components/intelligence/IntelligencePage";
import CompanyHero from "@/components/intelligence/CompanyHero";
import StatsGrid from "@/components/intelligence/StatsGrid";
import QuickFacts from "@/components/intelligence/QuickFacts";
import StringGrid from "@/components/intelligence/StringGrid";
import TextCard from "@/components/intelligence/TextCard";
import AIPromptCard from "@/components/intelligence/AIPromptCard";

import CompanyLinks from "@/components/company/CompanyLinks";
import HiringSignals from "@/components/company/HiringSignals";
import HiringIntelligence from "@/components/company/HiringIntelligence";
import SourcingSignals from "@/components/company/SourcingSignals";

import { getCompanyById } from "@/lib/atlas/companyService";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = getCompanyById(slug);

  if (!company) {
    notFound();
  }

  return (
    <IntelligencePage
      header={
        <CompanyHero
          name={company.name}
          companyType={company.companyType}
          headquarters={company.headquarters}
        />
      }

      stats={
        <StatsGrid
          stats={[
            {
              label: "Regions",
              value: company.regions.length.toString(),
            },
            {
              label: "Data Center Types",
              value: company.dataCenterTypes.length.toString(),
            },
            {
              label: "Roles",
              value: company.roles.length.toString(),
            },
            {
              label: "Technologies",
              value: company.coreTechnologies.length.toString(),
            },
          ]}
        />
      }

      sidebar={
        <QuickFacts
          items={[
            {
              label: "Company Type",
              value: company.companyType,
            },
            {
              label: "Priority",
              value: company.priority,
            },
            {
              label: "HQ",
              value: company.headquarters,
            },
            {
              label: "Website",
              value: company.website,
            },
          ]}
        />
      }
    >
      <HiringSignals
        priority={company.priority}
        roles={company.roles}
        technologies={company.coreTechnologies}
        certifications={company.certifications}
      />

      <HiringIntelligence
        roles={company.roles}
        technologies={company.coreTechnologies}
        vendors={company.strategicVendors}
        certifications={company.certifications}
        recruiterNotes={company.recruiterNotes}
      />

      <SourcingSignals
        aliases={company.aliases}
        roles={company.roles}
        technologies={company.coreTechnologies}
        vendors={company.strategicVendors}
        certifications={company.certifications}
      />

      <StringGrid
        title="Data Center Types"
        items={company.dataCenterTypes}
      />

      <StringGrid
        title="Regions"
        items={company.regions}
      />

      <StringGrid
        title="Data Center Presence"
        items={company.dataCenterPresence}
      />

      <StringGrid
        title="Core Technologies"
        items={company.coreTechnologies}
      />

      <StringGrid
        title="Strategic Vendors"
        items={company.strategicVendors}
      />

      <StringGrid
        title="Certifications"
        items={company.certifications}
      />

      <CompanyLinks
        companyName={company.name}
        certifications={company.certifications}
      />

      <TextCard
        title="Recruiter Notes"
        text={company.recruiterNotes}
      />

      <AIPromptCard
        prompt={company.aiPrompt}
      />
    </IntelligencePage>
  );
}