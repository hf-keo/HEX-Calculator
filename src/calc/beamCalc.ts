import { BeamInput } from "../types/beam";

export type BeamOutput = {
  torque_ftlbf: number;
  RA_lbf: number;
  RB_lbf: number;
  Mmax_ftlbf: number;
  bendingStress_psi: number;
  bendingUtil_percent: number;
  deflection_in: number;
};

export function calcBeam(b: BeamInput): BeamOutput {
  const F = b.appliedForce_lbf;
  const L = b.supportSpan_in;
  const a = b.loadPosFromLeft_in;
  const R = b.leverRadius_in;

  const bDist = L - a;

  const safeL = L > 0 ? L : 1e-9;
  const safeS = b.sectionModulus_in3 > 0 ? b.sectionModulus_in3 : 1e-9;
  const safeI = b.inertia_in4 > 0 ? b.inertia_in4 : 1e-9;
  const safeE = b.E_psi > 0 ? b.E_psi : 1e-9;
  const allow = b.allowableBendingStress_psi > 0 ? b.allowableBendingStress_psi : 1e-9;

  const torque_ftlbf = F * (R / 12);

  const RA = F * (bDist / safeL);
  const RB = F * (a / safeL);

  const Mmax_inlbf = (F * a * bDist) / safeL;
  const Mmax_ftlbf = Mmax_inlbf / 12;

  const bendingStress = Mmax_inlbf / safeS;
  const util = (bendingStress / allow) * 100;

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
