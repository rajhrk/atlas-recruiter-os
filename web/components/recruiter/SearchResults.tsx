"use client";

import { useRouter } from "next/navigation";
import SearchCard from "@/components/recruiter/SearchCard";

interface SearchResultsProps {
  results: {
    companies: any[];
    roles: any[];
    skills: any[];
    certifications: any[];
  };
}

export default function SearchResults({
  results,
}: SearchResultsProps) {
  const router = useRouter();

  const total =
    results.companies.length +
    results.roles.length +
    results.skills.length +
    results.certifications.length;

  if (total === 0) {
    return (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        No matching results found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Companies */}
      {results.companies.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold">
            🏢 Companies
          </h3>

          <div className="space-y-3">
            {results.companies.map((company) => (
              <SearchCard
                key={company.id}
                icon="🏢"
                title={company.name}
                subtitle={company.companyType ?? "Company"}
                onClick={() =>
                 router.push(
  `/company/${company.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`
)
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Roles */}
      {results.roles.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold">
            👤 Roles
          </h3>

          <div className="space-y-3">
            {results.roles.map((role) => (
              <SearchCard
                key={role.roleId}
                icon="👤"
                title={role.role}
                subtitle={role.division ?? "Role"}
                onClick={() =>
                  router.push(
                    `/role-intelligence?role=${encodeURIComponent(
                      role.role
                    )}`
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {results.skills.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold">
            🧠 Skills
          </h3>

          <div className="space-y-3">
            {results.skills.map((skill) => (
              <SearchCard
                key={skill.skillId}
                icon="🧠"
                title={skill.skill}
                subtitle={skill.category ?? "Skill"}
                onClick={() =>
                  router.push(
                    `/skills-intelligence?skill=${encodeURIComponent(
                      skill.skill
                    )}`
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {results.certifications.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold">
            🎓 Certifications
          </h3>

          <div className="space-y-3">
            {results.certifications.map((cert) => (
              <SearchCard
                key={cert.certification}
                icon="🎓"
                title={cert.certification}
                subtitle={cert.provider ?? "Certification"}
                onClick={() =>
                  router.push(
                    `/certification-intelligence?cert=${encodeURIComponent(
                      cert.certification
                    )}`
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}