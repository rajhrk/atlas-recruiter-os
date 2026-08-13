import IntelligenceSection from "./IntelligenceSection";

interface Props {
  title: string;
  items: string[];
}

export default function ListCard({
  title,
  items,
}: Props) {
  return (
    <IntelligenceSection title={title}>
      <ul className="list-disc space-y-2 pl-6">
        {items.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </IntelligenceSection>
  );
}