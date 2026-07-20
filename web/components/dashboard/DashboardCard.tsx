
type DashboardCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-4xl">{icon}</div>

      <h3 className="text-sm font-medium text-slate-500">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}