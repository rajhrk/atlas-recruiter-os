interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-6">

      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-slate-600">
          {subtitle}
        </p>
      )}

    </div>
  );
}