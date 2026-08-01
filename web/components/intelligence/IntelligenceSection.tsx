import { ReactNode } from "react";

interface IntelligenceSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function IntelligenceSection({
  title,
  children,
  className = "",
}: IntelligenceSectionProps) {
  return (
    <section
      className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}
    >
      <h2 className="mb-4 text-xl font-semibold">
        {title}
      </h2>

      {children}
    </section>
  );
}