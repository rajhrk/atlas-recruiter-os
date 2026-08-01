"use client";

import { useState } from "react";
import { RecruiterSearchRequest } from "@/types/recruiter";

interface RecruiterFiltersProps {
  onGenerate: (request: RecruiterSearchRequest) => void;
}

export default function RecruiterFilters({
  onGenerate,
}: RecruiterFiltersProps) {
  const [request, setRequest] = useState<RecruiterSearchRequest>({
    domain: "Data Center",
    role: "",
    location: "",
    seniority: "Any",
    company: "",
  });

  function update<K extends keyof RecruiterSearchRequest>(
    key: K,
    value: RecruiterSearchRequest[K]
  ) {
    setRequest((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Recruiter Filters</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Domain</label>

          <select
            className="w-full rounded-lg border p-3"
            value={request.domain}
            onChange={(e) => update("domain", e.target.value)}
          >
            <option>Data Center</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Job Title</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Critical Facilities Engineer"
            value={request.role}
            onChange={(e) => update("role", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Singapore"
            value={request.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Seniority</label>

          <select
            className="w-full rounded-lg border p-3"
            value={request.seniority}
            onChange={(e) => update("seniority", e.target.value)}
          >
            <option>Any</option>
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
            <option>Lead</option>
            <option>Principal</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Company</label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="AWS"
            value={request.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={() => onGenerate(request)}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Generate Intelligence
      </button>
    </div>
  );
}