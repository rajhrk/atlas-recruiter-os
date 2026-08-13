"use client";

const regions = [
  "All",
  "Global",
  "APAC",
  "EMEA",
  "North America",
  "South America",
];

interface Props {
  selected: string;
  onSelect: (region: string) => void;
}

export default function RegionFilter({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => onSelect(region)}
          className={`rounded-full border px-4 py-2 ${
            selected === region
              ? "bg-green-600 text-white"
              : "bg-white"
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  );
}