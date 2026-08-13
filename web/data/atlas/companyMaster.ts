import { AtlasCompany } from "@/types/company";

import { hyperscalers } from "./companies/hyperscalers";
import { aiCloud } from "./companies/aiCloud";
import { colocation } from "./companies/colocation";
import { oem } from "./companies/oem";
import { operators } from "./companies/operators";
import { enterprise } from "./companies/enterprise";
import { infrastructure } from "./companies/infrastructure";
import { finalBatch } from "./companies/finalBatch";

export const companyMaster: AtlasCompany[] = [
  ...hyperscalers,
  ...aiCloud,
  ...colocation,
  ...oem,
  ...operators,
  ...enterprise,
  ...infrastructure,
  ...finalBatch,
];

export default companyMaster;