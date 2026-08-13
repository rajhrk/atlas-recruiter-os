import Link from "next/link";

import IntelligenceSection from "@/components/intelligence/IntelligenceSection";

interface Props {
  title: string;
  baseUrl: string;
  items: string[];
}

export default function RelatedResources({
  title,
  baseUrl,
  items,
}: Props) {
  return (
    <IntelligenceSection title={title}>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <Link
            key={item}
            href={`${baseUrl}/${encodeURIComponent(
              item.toLowerCase().replace(/\s+/g, "-")
            )}`}
            className="rounded-full border px-3 py-2 text-sm transition hover:bg-blue-50 hover:border-blue-500"
          >
            {item}
          </Link>
        ))}
      </div>
    </IntelligenceSection>
  );
}