interface IntelligenceHeaderProps {
  title: string;
  subtitle?: string;
}

export default function IntelligenceHeader({
  title,
  subtitle,
}: IntelligenceHeaderProps) {
  return (
    <section className="rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="text-4xl font-bold">{title}</h1>

      {subtitle && (
        <p className="mt-2 text-gray-500">
          {subtitle}
        </p>
      )}
    </section>
  );
}