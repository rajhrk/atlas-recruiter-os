import { HiringGuide } from "./types";

import { criticalFacilitiesEngineerGuide } from "./criticalFacilitiesEngineer";

const hiringGuides: HiringGuide[] = [
  criticalFacilitiesEngineerGuide,
];

export function getHiringGuide(id: string) {
  return hiringGuides.find(
    (guide) => guide.id.toLowerCase() === id.toLowerCase()
  );
}

export function getAllHiringGuides() {
  return hiringGuides;
}