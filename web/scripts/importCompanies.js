
const XLSX = require("xlsx");
const fs = require("fs");

const workbookPath =
  "/Users/pillairaj/Downloads/Data Center Talent Intelligence Platform (APAC & EMEA).xlsx";

const workbook = XLSX.readFile(workbookPath);

const sheet = workbook.Sheets["Companies"];

const data = XLSX.utils.sheet_to_json(sheet);

const companies = data.map((row, index) => ({
  id: `COMP-${String(index + 1).padStart(3, "0")}`,
  name: row["Company"] || "",
  companyType: row["Company Type"] || "",
  hq: row["HQ"] || "",
  regions: row["Regions"] || "",
  dataCenterPresence: row["Data Center Presence"] || "",

  coreTechnologies: String(row["Core Technologies"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  strategicVendors: String(row["Strategic Vendors"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  roles: String(row["Typical Roles"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  certifications: String(row["Certifications"] || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean),

  recruiterNotes: row["Recruiter Notes"] || "",
  aiPrompt: row["AI Prompt"] || "",
}));

const output = `export interface AtlasCompany {
  id: string;
  name: string;
  companyType: string;
  hq: string;
  regions: string;
  dataCenterPresence: string;
  coreTechnologies: string[];
  strategicVendors: string[];
  roles: string[];
  certifications: string[];
  recruiterNotes: string;
  aiPrompt: string;
}

export const atlasCompanies: AtlasCompany[] = ${JSON.stringify(companies, null, 2)};
`;

fs.writeFileSync("data/atlas/companies.ts", output);

console.log(`✅ Generated ${companies.length} companies.`);
console.log("📄 data/atlas/companies.ts updated.");