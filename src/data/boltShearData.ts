import { BoltSizeSpec, MaterialSpec } from "../types/boltShear";

export const BOLT_SIZES: BoltSizeSpec[] = [
  { key: '1"-8UN', At_in2: 0.606 },
  { key: '1-1/8"-8UN', At_in2: 0.790 },
  { key: '1-1/2"-8UN', At_in2: 1.491 }
];

export const MATERIALS: MaterialSpec[] = [
  { key: "SA-193-B7", Sy_ksi: 105 },
  { key: "SA-193-B16", Sy_ksi: 105 }
];

export const getBoltSize = (key: string) => BOLT_SIZES.find(b => b.key === key);
export const getMaterial = (key: string) => MATERIALS.find(m => m.key === key);
