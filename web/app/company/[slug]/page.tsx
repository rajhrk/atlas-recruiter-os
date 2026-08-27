import { notFound } from "next/navigation";

import IntelligencePage from "@/components/intelligence/IntelligencePage";
import CompanyHero from "@/components/intelligence/CompanyHero";
import StatsGrid from "@/components/intelligence/StatsGrid";
import QuickFacts from "@/components/intelligence/QuickFacts";
import StringGrid from "@/components/intelligence/StringGrid";
import TextCard from "@/components/intelligence/TextCard";
import AIPromptCard from "@/components/intelligence/AIPromptCard";

import {
  getCompanyDomainIntelligence,
  getTalentDomainLabel,
} from "@/lib/atlas/companyDomainIntelligenceService";

import type { TalentDomainId } from "@/lib/atlas/talentDomains";

import CompanyLinks from "@/components/company/CompanyLinks";
import HiringSignals from "@/components/company/HiringSignals";
import HiringIntelligence from "@/components/company/HiringIntelligence";
import SourcingSignals from "@/components/company/SourcingSignals";

import { getCompanyById } from "@/lib/atlas/companyService";

export default async function CompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ domain?: string }>;
}) {
  const { slug } = await params;
  const { domain } = await searchParams;

  const company = getCompanyById(slug);

  if (!company) {
    notFound();
  }

  const requestedDomain = domain as TalentDomainId | undefined;

  /*
   * Company pages opened from Recruiter Search carry the
   * selected talent domain in the URL.
   *
   * Until the remaining domain profiles are populated,
   * Data Center preserves the existing company intelligence
   * while other domains intentionally remain empty rather
   * than inheriting Data Center data.
   */
  const domainId: TalentDomainId =
    requestedDomain ?? "data-center";

  const domainIntelligence =
    getCompanyDomainIntelligence(
      company.id,
      domainId,
    );

  if (!domainIntelligence) {
    notFound();
  }

  const domainLabel =
    getTalentDomainLabel(domainId);

  return (
    <IntelligencePage
      header={
        <CompanyHero
          name={company.name}
          companyType={
            domainIntelligence.companyType ??
            domainLabel
          }
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
              label: "Target Roles",
              value: domainIntelligence.targetRoles.length.toString(),
            },
            {
              label: "Technologies",
              value: domainIntelligence.coreTechnologies.length.toString(),
            },
            {
              label: "Certifications",
              value: domainIntelligence.certifications.length.toString(),
            },
          ]}
        />
      }

      sidebar={
        <QuickFacts
          items={[
            ...(domainIntelligence.companyType
              ? [
                  {
                    label: "Company Type",
                    value: domainIntelligence.companyType,
                  },
                ]
              : []),
            {
              label: "Priority",
              value:
                domainIntelligence.priority ??
                company.priority,
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
        priority={
          domainIntelligence.priority ??
          company.priority
        }
        roles={domainIntelligence.targetRoles}
        technologies={domainIntelligence.coreTechnologies}
        certifications={domainIntelligence.certifications}
      />

      <HiringIntelligence
        roles={domainIntelligence.targetRoles}
        technologies={domainIntelligence.coreTechnologies}
        vendors={domainIntelligence.strategicVendors}
        certifications={domainIntelligence.certifications}
        recruiterNotes={domainIntelligence.recruiterNotes}
      />

      <SourcingSignals
        aliases={company.aliases}
        roles={domainIntelligence.targetRoles}
        technologies={domainIntelligence.coreTechnologies}
        vendors={domainIntelligence.strategicVendors}
        certifications={domainIntelligence.certifications}
      />

      {domainIntelligence.dataCenterTypes &&
        domainIntelligence.dataCenterTypes.length > 0 && (
          <StringGrid
            title="Data Center Types"
            items={domainIntelligence.dataCenterTypes}
          />
        )}

      <StringGrid
        title="Regions"
        items={company.regions}
      />

      {domainIntelligence.dataCenterPresence &&
        domainIntelligence.dataCenterPresence.length > 0 && (
          <StringGrid
            title="Data Center Presence"
            items={domainIntelligence.dataCenterPresence}
          />
        )}

      <StringGrid
        title="Core Technologies"
        items={domainIntelligence.coreTechnologies}
      />

      <StringGrid
        title="Strategic Vendors"
        items={domainIntelligence.strategicVendors}
      />

      <StringGrid
        title="Certifications"
        items={domainIntelligence.certifications}
      />

      <CompanyLinks
        companyName={company.name}
        certifications={domainIntelligence.certifications}
        domainId={domainId}
      />

      <TextCard
        title="Recruiter Notes"
        text={domainIntelligence.recruiterNotes}
      />

      <AIPromptCard
        prompt={domainIntelligence.aiPrompt}
      />
    </IntelligencePage>
  );
}