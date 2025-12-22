import { BeamInput } from "../types/beam";

export type BeamOutput = {
  // Generated
  torque_ftlbf: number;

  // Statics
  RA_lbf: number;
  RB_lbf: number;

  // Beam
  Mmax_ftlbf: number;
  bendingStress_psi: number;
  bendingUtil_percent: number;

  // Deflection
  deflection_in: number;
};

export function calcBeam(b: BeamInput): BeamOutput {
  const F = b.appliedForce_lbf;
  const L = b.supportSpan_in;
  const a = b.loadPosFromLeft_in;
  const R = b.leverRadius_in;

  const bDist = L - a;

  // Guards to avoid divide-by-zero
  const safeL = L > 0 ? L : 1e-9;
  const safeS = b.sectionModulus_in3 > 0 ? b.sectionModulus_in3 : 1e-9;
  const safeI = b.inertia_in4 > 0 ? b.inertia_in4 : 1e-9;
  const safeE = b.E_psi > 0 ? b.E_psi : 1e-9;
  const allow = b.allowableBendingStress_psi > 0 ? b.allowableBendingStress_psi : 1e-9;

  // Torque at lock ring (F in lbf, R in inches => convert to ft)
  const torque_ftlbf = F * (R / 12);

  // Reactions for simply supported beam with point load at distance a
  const RA = F * (bDist / safeL);
  const RB = F * (a / safeL);

  // Max moment under the load: M = F*a*b/L (in·lbf)
  const Mmax_inlbf = (F * a * bDist) / safeL;
  const Mmax_ftlbf = Mmax_inlbf / 12;

  // Bending stress sigma = M/S (psi) with M in in·lbf, S in in^3
  const bendingStress = Mmax_inlbf / safeS;

  // Utilization %
  const util = (bendingStress / allow) * 100;

  // Deflection at load point:
  // δ = F a b (L^2 − a^2 − b^2) / (6 E I L)
  const defl_in =
    (F * a * bDist * (safeL * safeL - a * a - bDist * bDist)) /
    (6 * safeE * safeI * safeL);

  return {
    torque_ftlbf,
    RA_lbf: RA,
    RB_lbf: RB,
    Mmax_ftlbf,
    bendingStress_psi: bendingStress,
    bendingUtil_percent: util,
    deflection_in: defl_in
  };
}
