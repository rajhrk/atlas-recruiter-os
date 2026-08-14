import AtlasHeader from "@/components/atlas/AtlasHeader";
import SemiconductorRoleExplorer from "@/components/technicalTalent/SemiconductorRoleExplorer";
import SemiconductorTechnicalTalentOverview from "@/components/technicalTalent/SemiconductorTechnicalTalentOverview";
import { semiconductorDomain } from "@/data/technicalTalent/semiconductor";

export default function SemiconductorTechnicalTalentPage() {
  return (
    <div className="space-y-8">
      <AtlasHeader
        title="Semiconductor Technical Talent Intelligence"
        description="Technical talent intelligence for sourcing ASIC, RTL, verification, physical design, DFT, STA, FPGA, SoC architecture, analog/mixed-signal, and silicon validation professionals."
      />

      {/* Primary recruiter workspace */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Role Explorer
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore semiconductor roles by technical family and
            drill into skills, technologies, languages,
            methodologies, platforms, related roles, sourcing
            signals, and recruiter notes.
          </p>
        </div>

        <SemiconductorRoleExplorer
          roles={semiconductorDomain.roles}
        />
      </section>

      {/* Supporting intelligence */}
      <SemiconductorTechnicalTalentOverview
        domain={semiconductorDomain}
      />
    </div>
  );
}