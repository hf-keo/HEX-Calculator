export const PI = Math.PI;

// Length
export const in_to_mm = (x: number) => x * 25.4;
export const mm_to_in = (x: number) => x / 25.4;

export const ft_to_m = (x: number) => x * 0.3048;
export const m_to_ft = (x: number) => x / 0.3048;

// Pressure / stress
export const psi_to_MPa = (x: number) => x / 145.037738;
export const MPa_to_psi = (x: number) => x * 145.037738;

// Force
export const lbf_to_kN = (x: number) => x * 0.004448221615;
export const kN_to_lbf = (x: number) => x / 0.004448221615;

// Torque
export const ftlbf_to_Nm = (x: number) => x * 1.355817948;
export const Nm_to_ftlbf = (x: number) => x / 1.355817948;
