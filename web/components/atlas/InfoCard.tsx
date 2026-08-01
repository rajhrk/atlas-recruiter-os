import Chip from "./Chip";

interface InfoCardProps {
  title: string;
  items: string[];
}

export default function InfoCard({
  title,
  items,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip
            key={item}
            text={item}
          />
        ))}
      </div>
    </div>
  );
}