"use client";

import { SearchMode } from "@/lib/boolean/generator";

interface Props {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
}

const modes: {
  value: SearchMode;
  label: string;
  description: string;
}[] = [
  {
    value: "standard",
    label: "Standard Recruiter Boolean",
    description:
      "Compatible with LinkedIn Recruiter and most ATS / CRM sourcing platforms.",
  },
  {
    value: "google",
    label: "Google X-Ray",
    description:
      "Prepends site:linkedin.com/in for public LinkedIn profile searches.",
  },
];

export default function PlatformSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold">
        Search Mode
      </h3>

      <p className="mb-5 text-sm text-slate-500">
        Select how Atlas should generate the Boolean search.
      </p>

      <div className="space-y-3">
        {modes.map((mode) => (
          <label
            key={mode.value}
            className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition ${
              value === mode.value
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              className="mt-1"
              checked={value === mode.value}
              onChange={() => onChange(mode.value)}
            />

            <div>
              <div className="font-semibold">
                {mode.label}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {mode.description}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}