interface RecruiterNotesCardProps {
  notes: string;
}

export default function RecruiterNotesCard({
  notes,
}: RecruiterNotesCardProps) {
  return (
    <div className="rounded-lg border bg-amber-50 p-4">
      <p className="leading-7">
        {notes}
      </p>
    </div>
  );
}