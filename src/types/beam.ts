export type BeamInput = {
  // Geometry (base units: inches)
  leverRadius_in: number;        // R
  supportSpan_in: number;        // L
  loadPosFromLeft_in: number;    // a

  // Load (base units: lbf)
  appliedForce_lbf: number;      // F

  // Beam properties (base units)
  E_psi: number;                 // Young’s modulus
  sectionModulus_in3: number;    // S
  inertia_in4: number;           // I

  // Allowables
  allowableBendingStress_psi: number;
};
