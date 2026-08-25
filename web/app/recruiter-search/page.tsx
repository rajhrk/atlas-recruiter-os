import { SearchForm } from "@/components/recruiter/SearchForm";
import SearchTabs from "@/components/recruiter/SearchTabs";
import TalentDomainNav from "@/components/layout/TalentDomainNav";

export default function RecruiterSearchPage() {
  return (
    <div className="space-y-0">
      <TalentDomainNav />

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Recruiter Search
          </h1>
          <p className="text-muted-foreground">
            Search Atlas technical talent intelligence.
          </p>
        </div>

        <SearchForm />

        <SearchTabs />
      </div>
    </div>
  );
}
