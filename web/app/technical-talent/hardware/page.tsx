import AtlasHeader from "@/components/atlas/AtlasHeader";
import SharedRoleExplorer from "@/components/technicalTalent/SharedRoleExplorer";
import HardwareTechnicalTalentOverview from "@/components/technicalTalent/HardwareTechnicalTalentOverview";
import { hardwareDomain } from "@/data/technicalTalent/hardware";

export default function HardwareTechnicalTalentPage() {
  return (
    <div className="space-y-8">
      <AtlasHeader
        title="Hardware / Embedded Technical Talent Intelligence"
        description="Technical talent intelligence for sourcing embedded engineers, firmware engineers, embedded Linux specialists, BSP and device-driver engineers, hardware engineers, platform engineers, and hardware validation talent."
      />

      {/* Primary recruiter workspace */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Role Explorer
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore Hardware / Embedded roles by technical family
            and drill into skills, technologies, protocols,
            platforms, related roles, sourcing signals, and
            recruiter notes.
          </p>
        </div>

        <SharedRoleExplorer roles={hardwareDomain.roles} />
      </section>

      {/* Supporting intelligence */}
      <HardwareTechnicalTalentOverview
        domain={hardwareDomain}
      />
    </div>
  );
}