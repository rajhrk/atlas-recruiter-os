// app/ai-copilot/page.tsx

"use client";

import { useMemo, useState } from "react";

import { atlasRoles } from "@/data/atlas/roles";

import Section from "@/components/recruiter/Section";
import CopyButton from "@/components/recruiter/CopyButton";

export default function AIRecruiterCopilotPage() {
  const [role, setRole] = useState(atlasRoles[0]?.role ?? "");

  const intelligence = useMemo(() => {
    return atlasRoles.find(
      (r) => r.role === role
    );
  }, [role]);

  if (!intelligence) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">

      <header className="rounded-2xl border bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-bold">
          AI Recruiter Copilot
        </h1>

        <p className="mt-2 text-slate-500">
          Generate recruiter-ready sourcing
          prompts instantly.
        </p>

      </header>

      <Section title="Select Role">

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="w-full rounded-xl border p-3"
        >
          {atlasRoles.map((r) => (
            <option
              key={r.roleId}
              value={r.role}
            >
              {r.role}
            </option>
          ))}
        </select>

      </Section>

      <Section
        title="ChatGPT Prompt"
        action={
          <CopyButton
            text={buildPrompt(intelligence)}
          />
        }
      >

        <PromptBox
          text={buildPrompt(intelligence)}
        />

      </Section>

      <Section
        title="LinkedIn Recruiter Search"
        action={
          <CopyButton
            text={buildLinkedIn(intelligence)}
          />
        }
      >

        <PromptBox
          text={buildLinkedIn(intelligence)}
        />

      </Section>

      <Section
        title="Google X-Ray Search"
        action={
          <CopyButton
            text={buildGoogle(intelligence)}
          />
        }
      >

        <PromptBox
          text={buildGoogle(intelligence)}
        />

      </Section>

      <Section
        title="GitHub Search"
        action={
          <CopyButton
            text={buildGithub(intelligence)}
          />
        }
      >

        <PromptBox
          text={buildGithub(intelligence)}
        />

      </Section>

      <Section
        title="Interview Questions"
        action={
          <CopyButton
            text={buildInterview(intelligence)}
          />
        }
      >

        <PromptBox
          text={buildInterview(intelligence)}
        />

      </Section>

      <Section
        title="Outreach Message"
        action={
          <CopyButton
            text={buildOutreach(intelligence)}
          />
        }
      >

        <PromptBox
          text={buildOutreach(intelligence)}
        />

      </Section>

    </div>
  );
}

function PromptBox({
  text,
}: {
  text: string;
}) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-green-300">
{text}
    </pre>
  );
}

function buildPrompt(role: any) {
  return `
Act as a Senior Technical Recruiter.

Role:
${role.role}

Target Companies:
${role.targetCompanies.join(", ")}

Core Skills:
${role.coreSkills.join(", ")}

Certifications:
${role.certifications.join(", ")}

Conference Intelligence:
${role.conferences.join(", ")}

Generate:

1. Talent Mapping
2. Competitor Analysis
3. Boolean Searches
4. Interview Questions
5. Sourcing Strategy
6. Candidate Evaluation
7. Outreach Strategy
8. Offer Risks
9. Market Insights
`;
}

function buildLinkedIn(role: any) {
  return `
(${role.booleanSearch})

site:linkedin.com/in
`;
}

function buildGoogle(role: any) {
  return `
site:linkedin.com/in
(${role.booleanSearch})
`;
}

function buildGithub(role: any) {
  return `
site:github.com
${role.coreSkills.join(" ")}
${role.role}
`;
}

function buildInterview(role: any) {
  return `
Generate 25 technical interview questions for a

${role.role}

covering:

${role.coreSkills.join(", ")}

Include:

• Beginner
• Intermediate
• Advanced
• Scenario Based
• Troubleshooting
`;
}

function buildOutreach(role: any) {
  return `
Hi NAME,

I came across your experience with

${role.coreSkills.join(", ")}

and thought your background looked highly relevant for a

${role.role}

opportunity.

Would you be open to a confidential conversation this week?

Regards,
Recruiter
`;
}