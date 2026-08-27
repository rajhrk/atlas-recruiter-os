"use client";

import { useMemo, useState } from "react";

import { RecruiterSearchRequest } from "@/types/recruiter";
import {
  TALENT_DOMAINS,
  TalentDomainId,
} from "@/lib/atlas/talentDomains";

interface RecruiterFiltersProps {
  onGenerate: (request: RecruiterSearchRequest) => void;
}

export default function RecruiterFilters({
  onGenerate,
}: RecruiterFiltersProps) {
  const [domainId, setDomainId] =
    useState<TalentDomainId>("data-center");

  const domain = useMemo(
    () =>
      TALENT_DOMAINS.find(
        (item) => item.id === domainId,
      )!,
    [domainId],
  );

  const [request, setRequest] =
    useState<RecruiterSearchRequest>({
      domain: domainId,
      role: domain.defaultRole,
      location: "",
      seniority: "Any",
      company: "",
    });

  function handleDomainChange(
    nextDomainId: TalentDomainId,
  ) {
    const nextDomain = TALENT_DOMAINS.find(
      (item) => item.id === nextDomainId,
    )!;

    setDomainId(nextDomainId);

    /*
     * Changing domain also changes the valid role universe.
     *
     * Never retain the previous domain's role.
     */
    setRequest((prev) => ({
      ...prev,
      domain: nextDomainId,
      role: nextDomain.defaultRole,
    }));
  }

  function update<K extends keyof RecruiterSearchRequest>(
    key: K,
    value: RecruiterSearchRequest[K],
  ) {
    setRequest((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Recruiter Filters
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Domain
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={domainId}
            onChange={(e) =>
              handleDomainChange(
                e.target.value as TalentDomainId,
              )
            }
          >
            {TALENT_DOMAINS.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Job Title
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={request.role}
            onChange={(e) =>
              update("role", e.target.value)
            }
          >
            {domain.roles.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Location
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Singapore"
            value={request.location}
            onChange={(e) =>
              update("location", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Seniority
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={request.seniority}
            onChange={(e) =>
              update("seniority", e.target.value)
            }
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
          <label className="mb-2 block text-sm font-medium">
            Company
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="AWS"
            value={request.company}
            onChange={(e) =>
              update("company", e.target.value)
            }
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
