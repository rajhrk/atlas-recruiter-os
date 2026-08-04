interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function Section({
  title,
  children,
  action,
}: SectionProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}