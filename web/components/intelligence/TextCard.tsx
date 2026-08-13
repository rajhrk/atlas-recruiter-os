import IntelligenceSection from "./IntelligenceSection";

interface Props {
  title: string;
  text: string;
}

export default function TextCard({
  title,
  text,
}: Props) {
  return (
    <IntelligenceSection title={title}>
      <p className="leading-8">
        {text}
      </p>
    </IntelligenceSection>
  );
}