import AtlasHeader from "@/components/atlas/AtlasHeader";
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
    </div>
  );
}