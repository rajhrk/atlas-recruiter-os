
interface DetailCardProps {
  title: string;
  value: string;
}

export default function DetailCard({
  title,
  value,
}: DetailCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      <p className="text-lg font-medium">
        {value}
      </p>
    </div>
  );
}