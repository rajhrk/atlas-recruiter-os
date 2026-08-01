const XLSX = require("xlsx");
const fs = require("fs");

const workbookPath =
  "/Users/pillairaj/Downloads/Data Center Talent Intelligence Platform (APAC & EMEA).xlsx";

const workbook = XLSX.readFile(workbookPath);

const sheet = workbook.Sheets["Skills"];

const data = XLSX.utils.sheet_to_json(sheet);

const skills = data.map((row) => ({
  skillId: row["Skill ID"] || "",
  division: row["Division"] || "",
  specialization: row["Specialization"] || "",
  skill: row["Skill"] || "",
  category: row["Category"] || "",
  relatedVendors: row["Related Vendors"] || "",
  relatedJobTitles: row["Related Job Titles"] || "",
  priority: Number(row["Priority"] || 0),
  recruiterNotes: row["Recruiter Notes"] || "",
}));

const output = `export interface AtlasSkill {
  skillId: string;
  division: string;
  specialization: string;
  skill: string;
  category: string;
  relatedVendors: string;
  relatedJobTitles: string;
  priority: number;
  recruiterNotes: string;
}

export const atlasSkills: AtlasSkill[] = ${JSON.stringify(skills, null, 2)};
`;

fs.writeFileSync("data/atlas/skills.ts", output);

console.log(`✅ Generated ${skills.length} skills.`);
console.log("📄 data/atlas/skills.ts updated.");