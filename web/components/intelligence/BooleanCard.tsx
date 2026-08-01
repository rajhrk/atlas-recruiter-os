interface BooleanCardProps {
  booleanSearch: string;
}

export default function BooleanCard({
  booleanSearch,
}: BooleanCardProps) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
        {booleanSearch}
      </pre>
    </div>
  );
}