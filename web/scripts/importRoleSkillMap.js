
const XLSX = require("xlsx");
const fs = require("fs");

const workbookPath =
  "/Users/pillairaj/Downloads/Data Center Talent Intelligence Platform (APAC & EMEA).xlsx";

const workbook = XLSX.readFile(workbookPath);

const sheet = workbook.Sheets["Role-Skill Map"];

const data = XLSX.utils.sheet_to_json(sheet);

const mappings = data.map((row) => ({
  roleId: row["Role ID"] || "",
  role: row["Role"] || "",
  skillId: row["Skill ID"] || "",
  skill: row["Skill"] || "",
}));

const output = `export interface AtlasRoleSkillMap {
  roleId: string;
  role: string;
  skillId: string;
  skill: string;
}

export const atlasRoleSkillMap: AtlasRoleSkillMap[] = ${JSON.stringify(
  mappings,
  null,
  2
)};
`;

fs.writeFileSync("data/atlas/roleSkillMap.ts", output);

console.log(`✅ Generated ${mappings.length} role-skill mappings.`);
console.log("📄 data/atlas/roleSkillMap.ts updated.");