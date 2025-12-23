export type UnitSystem = "EN" | "SI";

export type BoltSizeSpec = { key: string; At_in2: number };
export type MaterialSpec = { key: string; Sy_ksi: number };

export type BoltGroupInput = {
  name: string;
  boltKey: string;
  materialKey: string;
  boltCount: number;
};

export type BoltShearInput = {
  unitSystem: UnitSystem;
  F_lbf: number;
  theta_deg: number;
  X_ft: number;
  D_ft: number;
  support: BoltGroupInput;
  tlr: BoltGroupInput;
  safetyFactor: number;
};

export type BoltGroupResult = {
  reaction_lbf: number;
  reactionAbs_lbf: number;
  perBoltShear_lbf: number;
  shearStress_psi: number;
  allowableShear_psi: number;
  utilization_percent: number;
  status: "OK" | "WARN" | "FAIL";
};

export type BoltShearOutput = {
  Fv_lbf: number;
  Fa_lbf: number;
  XminusD_ft: number;
  support: BoltGroupResult;
  tlr: BoltGroupResult;
};
