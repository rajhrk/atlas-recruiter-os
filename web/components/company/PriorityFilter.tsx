"use client";

interface Props {
  selected: string;
  onSelect: (value: string) => void;
  options: string[];
}

export default function PriorityFilter({
  selected,
  onSelect,
  options,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("All")}
        className={`rounded-full border px-4 py-2 ${
          selected === "All"
            ? "bg-orange-600 text-white"
            : "bg-white"
        }`}
      >
        All
      </button>

      {options.map((priority) => (
        <button
          key={priority}
          onClick={() => onSelect(priority)}
          className={`rounded-full border px-4 py-2 ${
            selected === priority
              ? "bg-orange-600 text-white"
              : "bg-white"
          }`}
        >
          {priority}
        </button>
      ))}
    </div>
  );
}