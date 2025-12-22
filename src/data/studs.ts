import { StudSpec } from "../types/gasket";

// Values aligned to your Reeves spreadsheet screenshots.
// Extend this over time as you add more stud sizes.
export const STUD_SPECS: StudSpec[] = [
  { key: "1-1/2-8UN", diameter_in: 1.5, tensileArea_in2: 1.491 },
  { key: "5/8-11UNC", diameter_in: 0.625, tensileArea_in2: 0.226 }
];

export function getStudSpec(key: string): StudSpec | undefined {
  return STUD_SPECS.find(s => s.key === key);
}
