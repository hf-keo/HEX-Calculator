import { ftlbf_to_Nm, PI } from "./units";
import { GasketCalcParams, GasketRowInput, GasketRowResult } from "../types/gasket";
import { getStudSpec } from "../data/studs";

export type RowValidation = {
  ok: boolean;
  errors: string[];
};

export function validateRow(row: GasketRowInput, isTLR: boolean): RowValidation {
  const errors: string[] = [];

  if (!row.studKey) errors.push("Select stud size");
  if (!(row.studStress_psi > 0)) errors.push("Stud stress must be > 0");
  if (!(row.studCount > 0)) errors.push("Stud count must be > 0");
  if (!(row.gasketOD_in > 0 && row.gasketID_in > 0)) errors.push("Gasket OD/ID must be > 0");
  if (row.gasketOD_in > 0 && row.gasketID_in > 0 && row.gasketOD_in <= row.gasketID_in) errors.push("Gasket OD must be > gasket ID");
  if (!(row.designPressure_psi > 0)) errors.push("Design pressure must be > 0");

  if (isTLR) {
    if (!(row.tlrOD_in > 0)) errors.push("TLR OD (plug diameter) must be > 0");
    if (row.tlrOD_in > 0 && row.gasketID_in > 0 && row.tlrOD_in >= row.gasketID_in) errors.push("TLR OD must be < gasket ID");
  }

  const spec = getStudSpec(row.studKey);
  if (!spec) errors.push("Unknown stud spec (update studs list)");

  return { ok: errors.length === 0, errors };
}

export function calculateRow(row: GasketRowInput, params: GasketCalcParams): GasketRowResult {
  const spec = getStudSpec(row.studKey);
  if (!spec) throw new Error("Stud spec not found: " + row.studKey);

  const At = spec.tensileArea_in2;

  // 1) stud loads
  const loadPerStud_lbf = row.studStress_psi * At;
  const totalBoltLoad_lbf = loadPerStud_lbf * row.studCount;

  // 2) pressure load
  const isTLR = row.id === "tlr";
  const pressureDiameter_in = isTLR ? row.tlrOD_in : row.gasketID_in;
  const pressureArea_in2 = (PI / 4) * pressureDiameter_in ** 2;
  const pressureLoad_lbf = row.designPressure_psi * pressureArea_in2;

  // 3) gasket contact area
  const gasketArea_in2 = (PI / 4) * (row.gasketOD_in ** 2 - row.gasketID_in ** 2);

  // 4) gasket stress
  const gasketStress_psi = (totalBoltLoad_lbf - pressureLoad_lbf) / gasketArea_in2;

  // 5) torque (per stud)
  const torque_inlbf = params.kFactor * loadPerStud_lbf * spec.diameter_in;
  const torque_ftlbf = torque_inlbf / 12;
  const torque_Nm = ftlbf_to_Nm(torque_ftlbf);

  return {
    tensileArea_in2: At,
    studDiameter_in: spec.diameter_in,
    loadPerStud_lbf,
    totalBoltLoad_lbf,
    pressureDiameter_in,
    pressureLoad_lbf,
    gasketArea_in2,
    gasketStress_psi,
    torque_ftlbf,
    torque_Nm
  };
}
