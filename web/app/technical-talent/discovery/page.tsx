import AtlasHeader from "@/components/atlas/AtlasHeader";
import TechnicalTalentDiscovery from "@/components/technicalTalent/TechnicalTalentDiscovery";

export default function TechnicalTalentDiscoveryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AtlasHeader
        title="Technical Talent Discovery"
        description="Discover and explore technical talent intelligence across AI / ML, Robotics, Hardware / Embedded, and Semiconductor."
      />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <TechnicalTalentDiscovery />
      </section>
    </main>
  );
}