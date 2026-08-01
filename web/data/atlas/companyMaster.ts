import { AtlasCompany } from "@/types/company";

import { hyperscalers } from "./companies/hyperscalers";
import { aiCloud } from "./companies/aiCloud";
import { colocation } from "./companies/colocation";
import { oem } from "./companies/oem";

export const companyMaster: AtlasCompany[] = [
  ...hyperscalers,
  ...aiCloud,
  ...colocation,
  ...oem,
];

export default companyMaster;