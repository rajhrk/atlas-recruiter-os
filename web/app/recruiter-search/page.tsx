
import { SearchForm } from "@/components/recruiter/SearchForm";
import SearchTabs from "@/components/recruiter/SearchTabs";

export default function RecruiterSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Recruiter Search
        </h1>
        <p className="text-muted-foreground">
          Search Atlas recruiter intelligence.
        </p>
      </div>

      <SearchForm />

      <SearchTabs />
    </div>
  );
}