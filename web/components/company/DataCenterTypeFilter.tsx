"use client";

interface Props {
  selected: string;
  onSelect: (type: string) => void;
  options: string[];
}

export default function DataCenterTypeFilter({
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
            ? "bg-purple-600 text-white"
            : "bg-white hover:bg-slate-50"
        }`}
      >
        All
      </button>

      {options.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            selected === type
              ? "bg-purple-600 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}