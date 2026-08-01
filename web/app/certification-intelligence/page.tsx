"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { atlasCertifications } from "@/data/atlas/certifications";

import DetailCard from "@/components/atlas/DetailCard";
import InfoCard from "@/components/atlas/InfoCard";
import SearchParamsBoundary from "@/components/atlas/SearchParamsBoundary";
import AtlasHeader from "@/components/atlas/AtlasHeader";

function CertificationIntelligenceContent() {
  const searchParams = useSearchParams();

  const [selectedCertification, setSelectedCertification] = useState(
    atlasCertifications[0]?.certification ?? ""
  );

  useEffect(() => {
    const certName = searchParams.get("cert");

    if (!certName) return;

    const cert = atlasCertifications.find(
      (c) =>
        c.certification.toLowerCase() === certName.toLowerCase()
    );

    if (cert) {
      setSelectedCertification(cert.certification);
    }
  }, [searchParams]);

  const certification =
    atlasCertifications.find(
      (c) => c.certification === selectedCertification
    ) ?? atlasCertifications[0];

  if (!certification) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <h1 className="text-4xl font-bold">
          🎓 Certification Intelligence
        </h1>

        <p className="mt-4 text-gray-600">
          No certifications available.
        </p>
      </main>
    );
  }

  const relatedRoles = certification.relatedJobTitles
    ? certification.relatedJobTitles
        .split(",")
        .map((role) => role.trim())
        .filter(Boolean)
    : [];

  const priorityStars =
    certification.priority > 0
      ? "⭐".repeat(certification.priority)
      : "N/A";

  return (
    <main className="mx-auto max-w-7xl p-8 space-y-8">
      <AtlasHeader
        title="🎓 Certification Intelligence"
        description="Recruiter intelligence for certifications across Data Centers, Critical Facilities, AI Infrastructure and Construction."
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-8">
        <div>
          <h2 className="text-3xl font-bold">
            {certification.certification}
          </h2>

          <p className="mt-2 text-gray-500">
            {certification.division} • {certification.specialization}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <DetailCard
            title="Division"
            value={certification.division}
          />

          <DetailCard
            title="Specialization"
            value={certification.specialization}
          />

          <DetailCard
            title="Issuing Organization"
            value={certification.issuingOrganization}
          />

          <DetailCard
            title="Level"
            value={certification.level}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            title="💼 Related Job Titles"
            items={relatedRoles}
          />

          <InfoCard
            title="⭐ Priority"
            items={[priorityStars]}
          />
        </div>

        <div className="rounded-xl border bg-slate-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            📝 Recruiter Notes
          </h3>

          <p className="leading-7 text-gray-700">
            {certification.recruiterNotes}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CertificationIntelligencePage() {
  return (
    <SearchParamsBoundary>
      <CertificationIntelligenceContent />
    </SearchParamsBoundary>
  );
}