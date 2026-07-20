import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecruiterSearchPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-4xl font-bold">
          Recruiter Search
        </h1>

        <p className="mt-2 text-slate-600">
          Search Atlas Intelligence by Job Title
        </p>

        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

          <div className="space-y-6">

            <div>
              <label className="mb-2 block font-medium">
                Job Title
              </label>

              <Input placeholder="Backend Engineer" />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Location
              </label>

              <Input placeholder="Singapore" />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Experience
              </label>

              <Input placeholder="5-8 Years" />
            </div>

            <div className="flex gap-4">

              <Button>
                Search
              </Button>

              <Button variant="outline">
                Clear
              </Button>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}