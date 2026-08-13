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

      <TechnicalTalentOverview domain={aiMlDomain} />

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Role Explorer
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore AI / ML roles by technical family, skills,
            technologies, research areas, and sourcing signals.
          </p>
        </div>

        <RoleFamilyExplorer roles={aiMlDomain.roles} />
      </div>
    </div>
  );
}