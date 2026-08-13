import AtlasHeader from "@/components/atlas/AtlasHeader";
import RoleFamilyExplorer from "@/components/technicalTalent/RoleFamilyExplorer";
import TechnicalTalentOverview from "@/components/technicalTalent/TechnicalTalentOverview";
import { aiMlDomain } from "@/data/technicalTalent/aiMl";

export default function AIMLTechnicalTalentPage() {
  return (
    <div className="space-y-8">
      <AtlasHeader
        title="AI / ML Technical Talent Intelligence"
        description="Technical talent intelligence for sourcing AI, machine learning, recommender systems, research, and applied AI professionals."
      />

      {/* Primary recruiter workspace */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Role Explorer
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore AI / ML roles by technical family and drill
            into the skills, technologies, companies, research
            areas, conferences, Boolean keywords, and recruiter
            signals associated with each role.
          </p>
        </div>

        <RoleFamilyExplorer roles={aiMlDomain.roles} />
      </section>

      {/* Supporting intelligence */}
      <TechnicalTalentOverview domain={aiMlDomain} />
    </div>
  );
}