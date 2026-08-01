import Link from "next/link";

interface BadgeItem {
  label: string;
  href?: string;
}

interface BadgeGridProps {
  items: BadgeItem[];
  emptyMessage?: string;
}

export default function BadgeGrid({
  items,
  emptyMessage = "No data available.",
}: BadgeGridProps) {
  if (items.length === 0) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) =>
        item.href ? (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full border bg-slate-50 px-3 py-1 text-sm transition hover:bg-slate-100 hover:border-slate-400"
          >
            {item.label}
          </Link>
        ) : (
          <span
            key={item.label}
            className="rounded-full border bg-slate-50 px-3 py-1 text-sm"
          >
            {item.label}
          </span>
        )
      )}
    </div>
  );
}