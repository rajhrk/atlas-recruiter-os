"use client";

import { useEffect, useMemo, useState } from "react";
import { AtlasService } from "@/lib/atlas/service";
import {
  generateBoolean,
  SearchMode,
} from "@/lib/boolean/generator";
import PlatformSelector from "./PlatformSelector";

export default function BooleanBuilder() {
  const roles = AtlasService.getRoles();

  const [selectedRole, setSelectedRole] = useState(
    roles.length ? roles[0].role : ""
  );

  const [searchMode, setSearchMode] =
    useState<SearchMode>("standard");

  const [location, setLocation] = useState("");

  const [selectedCompanies, setSelectedCompanies] = useState<
    string[]
  >([]);

  const [selectedSkills, setSelectedSkills] = useState<
    string[]
  >([]);

  const [
    selectedCertifications,
    setSelectedCertifications,
  ] = useState<string[]>([]);

  const role = useMemo(
    () => AtlasService.getRole(selectedRole),
    [selectedRole]
  );

  useEffect(() => {
    if (!role) return;

    setSelectedCompanies(role.targetCompanies);
    setSelectedSkills(role.coreSkills);
    setSelectedCertifications(role.certifications);
  }, [role]);

  const booleanString = useMemo(() => {
    if (!role) return "";

    return generateBoolean({
      role,
      searchMode,
      location,
      selectedCompanies,
      selectedSkills,
      selectedCertifications,
    });
  }, [
    role,
    searchMode,
    location,
    selectedCompanies,
    selectedSkills,
    selectedCertifications,
  ]);

  const toggleSelection = (
    value: string,
    values: string[],
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    if (values.includes(value)) {
      setter(values.filter((v) => v !== value));
    } else {
      setter([...values, value]);
    }
  };

  const copyBoolean = async () => {
    await navigator.clipboard.writeText(booleanString);
    alert("Boolean copied successfully.");
  };

  if (!role) {
    return (
      <div className="rounded-xl border p-6">
        No roles found.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* LEFT */}

      <div className="space-y-6">
        <PlatformSelector
          value={searchMode}
          onChange={setSearchMode}
        />

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <label className="mb-2 block font-semibold">
            Role
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={selectedRole}
            onChange={(e) =>
              setSelectedRole(e.target.value)
            }
          >
            {roles.map((role) => (
              <option
                key={role.roleId}
                value={role.role}
              >
                {role.role}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <label className="mb-2 block font-semibold">
            Location
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder="Singapore"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />
        </div>

        {/* Companies */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Target Companies
            </h3>

            <span className="text-sm text-slate-500">
              {selectedCompanies.length} selected
            </span>
          </div>

          <div className="space-y-2">
            {role.targetCompanies.map((company) => (
              <label
                key={company}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(
                    company
                  )}
                  onChange={() =>
                    toggleSelection(
                      company,
                      selectedCompanies,
                      setSelectedCompanies
                    )
                  }
                />

                <span>{company}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Skills */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Core Skills
            </h3>

            <span className="text-sm text-slate-500">
              {selectedSkills.length} selected
            </span>
          </div>

          <div className="space-y-2">
            {role.coreSkills.map((skill) => (
              <label
                key={skill}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(
                    skill
                  )}
                  onChange={() =>
                    toggleSelection(
                      skill,
                      selectedSkills,
                      setSelectedSkills
                    )
                  }
                />

                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Certifications */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Certifications
            </h3>

            <span className="text-sm text-slate-500">
              {selectedCertifications.length} selected
            </span>
          </div>

          <div className="space-y-2">
            {role.certifications.map(
              (certification) => (
                <label
                  key={certification}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedCertifications.includes(
                      certification
                    )}
                    onChange={() =>
                      toggleSelection(
                        certification,
                        selectedCertifications,
                        setSelectedCertifications
                      )
                    }
                  />

                  <span>{certification}</span>
                </label>
              )
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div>
        <div className="sticky top-6 rounded-xl border bg-slate-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Generated Boolean
              </h2>

              <p className="text-sm text-slate-500">
                {searchMode === "standard"
                  ? "Standard Recruiter Boolean"
                  : "Google X-Ray Boolean"}
              </p>
            </div>

            <button
              onClick={copyBoolean}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              📋 Copy
            </button>
          </div>

          <pre className="min-h-[650px] overflow-auto whitespace-pre-wrap rounded-lg border bg-white p-5 text-sm leading-7">
            {booleanString}
          </pre>
        </div>
      </div>
    </div>
  );
}