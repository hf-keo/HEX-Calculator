export const PI = Math.PI;

// Length
export const in_to_mm = (x: number) => x * 25.4;
export const mm_to_in = (x: number) => x / 25.4;

// Section modulus (in^3 <-> mm^3)
const MM_PER_IN = 25.4;
const CUBIC_CONVERSION = MM_PER_IN ** 3;
export const in3_to_mm3 = (x: number) => x * CUBIC_CONVERSION;
export const mm3_to_in3 = (x: number) => x / CUBIC_CONVERSION;

// Moment of inertia (in^4 <-> mm^4)
const QUARTIC_CONVERSION = MM_PER_IN ** 4;
export const in4_to_mm4 = (x: number) => x * QUARTIC_CONVERSION;
export const mm4_to_in4 = (x: number) => x / QUARTIC_CONVERSION;

// Pressure / stress
export const psi_to_MPa = (x: number) => x / 145.037738;
export const MPa_to_psi = (x: number) => x * 145.037738;

// Force
export const lbf_to_kN = (x: number) => x * 0.004448221615;
export const kN_to_lbf = (x: number) => x / 0.004448221615;

// Torque
export const ftlbf_to_Nm = (x: number) => x * 1.355817948;
export const Nm_to_ftlbf = (x: number) => x / 1.355817948;

// Helpers
export function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}
