import { getBoltSize, getMaterial } from "../data/boltShearData";
import { BoltShearInput, BoltShearOutput, BoltGroupResult } from "../types/boltShear";

function status(utilPct: number): "OK" | "WARN" | "FAIL" {
  if (!Number.isFinite(utilPct)) return "FAIL";
  if (utilPct < 80) return "OK";
  if (utilPct <= 100) return "WARN";
  return "FAIL";
}

export type Validation = { ok: boolean; errors: string[] };

export function validateBoltShear(inp: BoltShearInput): Validation {
  const e: string[] = [];
  if (!(inp.F_lbf > 0)) e.push("Applied load F must be > 0");
  if (!(inp.X_ft > 0)) e.push("X must be > 0");
  if (!(inp.D_ft > 0)) e.push("D must be > 0");
  if (inp.X_ft > 0 && inp.D_ft > 0 && inp.X_ft <= inp.D_ft) e.push("X must be > D (so X − D is positive)");
  if (!(inp.safetyFactor > 0)) e.push("Safety factor must be > 0");

  const groups = [inp.support, inp.tlr];
  for (const g of groups) {
    if (!(g.boltCount > 0)) e.push(`${g.name}: bolt count must be > 0`);
    if (!getBoltSize(g.boltKey)) e.push(`${g.name}: unknown bolt size`);
    if (!getMaterial(g.materialKey)) e.push(`${g.name}: unknown material`);
  }
  return { ok: e.length === 0, errors: e };
}

export function calcBoltShear(inp: BoltShearInput): BoltShearOutput {
  const theta = (inp.theta_deg * Math.PI) / 180;
  const Fv = inp.F_lbf * Math.cos(theta);
  const Fa = inp.F_lbf * Math.sin(theta);

  const XminusD = inp.X_ft - inp.D_ft;

  const R_tlr = Fv * (inp.X_ft / inp.D_ft);
  const R_support = Fv - R_tlr;

  const solve = (reaction: number, boltKey: string, matKey: string, n: number): BoltGroupResult => {
    const bolt = getBoltSize(boltKey)!;
    const mat = getMaterial(matKey)!;
    const perBolt = Math.abs(reaction) / n;
    const shearStress = perBolt / bolt.At_in2; // psi
    const allowableShear = (0.5 * mat.Sy_ksi * 1000) / inp.safetyFactor; // psi
    const util = (shearStress / allowableShear) * 100;

    return {
      reaction_lbf: reaction,
      reactionAbs_lbf: Math.abs(reaction),
      perBoltShear_lbf: perBolt,
      shearStress_psi: shearStress,
      allowableShear_psi: allowableShear,
      utilization_percent: util,
      status: status(util)
    };
  };

  return {
    Fv_lbf: Fv,
    Fa_lbf: Fa,
    XminusD_ft: XminusD,
    support: solve(R_support, inp.support.boltKey, inp.support.materialKey, inp.support.boltCount),
    tlr: solve(R_tlr, inp.tlr.boltKey, inp.tlr.materialKey, inp.tlr.boltCount)
  };
}
