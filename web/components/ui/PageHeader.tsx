import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-10 flex items-start justify-between gap-6">
      <div className="max-w-4xl">

        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            {eyebrow}
          </p>
        )}

        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {description}
          </p>
        )}

      </div>

      {actions && (
        <div className="shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}