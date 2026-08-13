import AtlasHeader from "@/components/atlas/AtlasHeader";
import RoboticsRoleExplorer from "@/components/technicalTalent/RoboticsRoleExplorer";
import { roboticsDomain } from "@/data/technicalTalent/robotics";

export default function RoboticsTechnicalTalentPage() {
  return (
    <div className="space-y-8">
      <AtlasHeader
        title="Robotics Technical Talent Intelligence"
        description="Technical talent intelligence for sourcing robotics engineers, researchers, autonomy specialists, perception engineers, controls engineers, robot learning specialists, and robotics systems talent."
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Role Explorer
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore robotics roles by technical family and drill
            into the skills, technologies, research areas,
            related roles, sourcing signals, and recruiter notes
            associated with each role.
          </p>
        </div>

        <RoboticsRoleExplorer roles={roboticsDomain.roles} />
      </section>
    </div>
  );
}