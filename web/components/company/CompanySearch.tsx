"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CompanySearch({
  value,
  onChange,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search companies..."
      className="w-full rounded-xl border p-3 text-lg"
    />
  );
}