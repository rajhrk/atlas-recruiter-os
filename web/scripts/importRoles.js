const XLSX = require("xlsx");
const fs = require("fs");

const workbookPath =
  "/Users/pillairaj/Downloads/Data Center Talent Intelligence Platform (APAC & EMEA).xlsx";

const workbook = XLSX.readFile(workbookPath);

const sheet = workbook.Sheets["Master Role Matrix"];

const data = XLSX.utils.sheet_to_json(sheet);

const roles = data.map((row, index) => ({
  roleId: `ROLE-${String(index + 1).padStart(3, "0")}`,
  role: row["Role"] || "",

  targetCompanies: String(row["Target Companies"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  coreSkills: String(row["Core Skills"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  certifications: String(row["Certifications"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  conferences: String(row["Conferences"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  booleanSearch: row["Boolean Search"] || "",
  aiPrompt: row["AI Prompt"] || "",
  recruiterNotes: row["Recruiter Notes"] || "",
}));

const output = `export interface AtlasRole {
  roleId: string;
  role: string;
  targetCompanies: string[];
  coreSkills: string[];
  certifications: string[];
  conferences: string[];
  booleanSearch: string;
  aiPrompt: string;
  recruiterNotes: string;
}

export const atlasRoles: AtlasRole[] = ${JSON.stringify(roles, null, 2)};
`;

fs.writeFileSync("data/atlas/roles.ts", output);

console.log(`✅ Generated ${roles.length} roles.`);
console.log("📄 data/atlas/roles.ts updated.");