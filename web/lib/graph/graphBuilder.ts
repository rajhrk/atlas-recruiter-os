import { AtlasGraph, GraphEdge, GraphNode } from "@/types/graph";

import {
  getAllCompanies,
  getCompanyByName,
} from "@/lib/atlas/companyService";

import { atlasRoles } from "@/data/atlas/roles";
import { atlasSkills } from "@/data/atlas/skills";
import { atlasCertifications } from "@/data/atlas/certifications";

function addNode(
  nodes: GraphNode[],
  id: string,
  label: string,
  type: GraphNode["type"]
) {
  if (!nodes.some((n) => n.id === id && n.type === type)) {
    nodes.push({
      id,
      label,
      type,
    });
  }
}

export function buildAtlasGraph(): AtlasGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Companies
  getAllCompanies().forEach((company) => {
    addNode(
      nodes,
      company.id,
      company.name,
      "company"
    );
  });

  // Skills
  atlasSkills.forEach((skill) => {
    addNode(
      nodes,
      skill.skillId,
      skill.skill,
      "skill"
    );
  });

  // Certifications
  atlasCertifications.forEach((cert) => {
    addNode(
      nodes,
      cert.certification,
      cert.certification,
      "certification"
    );
  });

  // Roles
  atlasRoles.forEach((role) => {
    addNode(
      nodes,
      role.roleId,
      role.role,
      "role"
    );

    role.targetCompanies.forEach((companyName) => {
      const company = getCompanyByName(companyName);

      if (!company) return;

      edges.push({
        from: company.id,
        to: role.roleId,
        relationship: "hires",
      });
    });

    role.coreSkills.forEach((skillName) => {
      const skill = atlasSkills.find(
        (s) => s.skill === skillName
      );

      if (!skill) return;

      edges.push({
        from: role.roleId,
        to: skill.skillId,
        relationship: "requires",
      });
    });

    role.certifications.forEach((certName) => {
      const cert = atlasCertifications.find(
        (c) => c.certification === certName
      );

      if (!cert) return;

      edges.push({
        from: role.roleId,
        to: cert.certification,
        relationship: "prefers",
      });
    });
  });

  return {
    nodes,
    edges,
  };
}