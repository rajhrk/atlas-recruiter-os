"use client";

import { useState } from "react";

import { atlasRoles } from "@/data/atlas/roles";

import CopyButton from "@/components/atlas/CopyButton";

export default function AIPromptsPage() {
  const [selectedRole, setSelectedRole] = useState(atlasRoles[0]);

  return (
    <main className="mx-auto max-w-7xl p-8 space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          🤖 AI Prompt Builder
        </h1>

        <p className="mt-2 text-gray-600">
          Generate recruiter-ready AI prompts for sourcing, assessment,
          outreach and market intelligence.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <label className="mb-2 block font-semibold">
          Select Role
        </label>

        <select
          className="w-full rounded-lg border p-3"
          value={selectedRole.role}
          onChange={(e) => {
            const role = atlasRoles.find(
              (r) => r.role === e.target.value
            );

            if (role) {
              setSelectedRole(role);
            }
          }}
        >
          {atlasRoles.map((role) => (
            <option key={role.roleId}>
              {role.role}
            </option>
          ))}
        </select>

      </div>

      <PromptCard
        title="Candidate Sourcing"
        prompt={selectedRole.aiPrompt}
      />

      <PromptCard
        title="Talent Mapping"
        prompt={`Create a complete talent map for ${selectedRole.role} across ${selectedRole.targetCompanies.join(
          ", "
        )}. Include seniority, locations, competitor companies and hiring trends.`}
      />

      <PromptCard
        title="Interview Questions"
        prompt={`Generate technical interview questions for a ${selectedRole.role} with expertise in ${selectedRole.coreSkills.join(
          ", "
        )}.`}
      />

      <PromptCard
        title="LinkedIn Outreach"
        prompt={`Write a personalized LinkedIn message for an experienced ${selectedRole.role}. Keep it under 150 words.`}
      />

      <PromptCard
        title="Market Intelligence"
        prompt={`Explain the hiring market for ${selectedRole.role}. Include demand, top companies, salary trends and difficult-to-find skills.`}
      />

    </main>
  );
}

function PromptCard({
  title,
  prompt,
}: {
  title: string;
  prompt: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <CopyButton text={prompt} />

      </div>

      <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm">
        {prompt}
      </pre>

    </div>
  );
}