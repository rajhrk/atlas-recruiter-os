
const { execSync } = require("child_process");

const scripts = [
  "importRoles.js",
  "importSkills.js",
  "importRoleSkillMap.js",
  "importCompanies.js",
  "importCertifications.js",
];

console.log("🚀 Starting Atlas workbook import...\n");

for (const script of scripts) {
  console.log(`▶ Running ${script}...`);

  execSync(`node scripts/${script}`, {
    stdio: "inherit",
  });

  console.log("");
}

console.log("✅ Atlas workbook import completed successfully.");