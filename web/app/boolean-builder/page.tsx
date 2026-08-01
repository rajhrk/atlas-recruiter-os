import BooleanBuilder from "@/components/boolean/BooleanBuilder";

export default function BooleanBuilderPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Boolean Builder
        </h1>

        <p className="mt-2 text-muted-foreground">
          Generate recruiter Boolean strings from your Atlas data.
        </p>
      </div>

      <BooleanBuilder />
    </main>
  );
}