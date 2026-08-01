
const XLSX = require("xlsx");
const fs = require("fs");

const workbookPath =
  "/Users/pillairaj/Downloads/Data Center Talent Intelligence Platform (APAC & EMEA).xlsx";

const workbook = XLSX.readFile(workbookPath);

const sheet = workbook.Sheets["Certifications"];

const data = XLSX.utils.sheet_to_json(sheet);

const certifications = data.map((row) => ({
  division: row["Division"] || "",
  specialization: row["Specialization"] || "",
  certification: row["Certification"] || "",
  issuingOrganization: row["Issuing Organization"] || "",
  level: row["Level"] || "",
  relatedJobTitles: row["Related Job Titles"] || "",
  priority: Number(row["Priority"] || 0),
  recruiterNotes: row["Recruiter Notes"] || "",
}));

const output = `export interface AtlasCertification {
  division: string;
  specialization: string;
  certification: string;
  issuingOrganization: string;
  level: string;
  relatedJobTitles: string;
  priority: number;
  recruiterNotes: string;
}

export const atlasCertifications: AtlasCertification[] = ${JSON.stringify(
  certifications,
  null,
  2
)};
`;

fs.writeFileSync(
  "data/atlas/certifications.ts",
  output
);

console.log(`✅ Generated ${certifications.length} certifications.`);
console.log("📄 data/atlas/certifications.ts updated.");