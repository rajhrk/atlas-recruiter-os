
interface ChipProps {
  text: string;
}

export default function Chip({
  text,
}: ChipProps) {
  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        border
        bg-slate-100
        px-3
        py-1
        text-sm
        font-medium
        transition-colors
        hover:bg-slate-200
      "
    >
      {text}
    </span>
  );
}