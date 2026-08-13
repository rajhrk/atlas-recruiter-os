"use client";

interface Props {
  selected: string;
  onSelect: (filter: string) => void;
  options: string[];
}

export default function CompanyFilters({
  selected,
  onSelect,
  options,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("All")}
        className={`rounded-full border px-4 py-2 text-sm transition ${
          selected === "All"
            ? "bg-blue-600 text-white"
            : "bg-white hover:bg-slate-50"
        }`}
      >
        All
      </button>

      {options.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            selected === filter
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}