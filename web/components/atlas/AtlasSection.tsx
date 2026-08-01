import { ReactNode } from "react";

interface AtlasSectionProps {
  children: ReactNode;
  className?: string;
}

export default function AtlasSection({
  children,
  className = "",
}: AtlasSectionProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}