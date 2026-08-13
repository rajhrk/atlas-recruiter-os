import IntelligenceSection from "./IntelligenceSection";

interface Props {
  title: string;
  items: string[];
}

export default function StringGrid({
  title,
  items,
}: Props) {
  return (
    <IntelligenceSection title={title}>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </IntelligenceSection>
  );
}