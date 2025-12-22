export type UnitSystem = "EN" | "SI";

export type StudSpec = {
  key: string;
  diameter_in: number;
  tensileArea_in2: number;
};

export type GasketRowInput = {
  id: "internal_flange" | "partition_cover" | "tlr" | "channel_cover";
  name: string;

  studKey: string;
  studStress_psi: number;
  studCount: number;

  gasketOD_in: number;
  gasketID_in: number;

  designPressure_psi: number;

  // only used when id === "tlr"
  tlrOD_in: number;

  gasketType: string;
};

export type GasketRowResult = {
  tensileArea_in2: number;
  studDiameter_in: number;

  loadPerStud_lbf: number;
  totalBoltLoad_lbf: number;

  pressureDiameter_in: number;
  pressureLoad_lbf: number;

  gasketArea_in2: number;
  gasketStress_psi: number;

  torque_ftlbf: number;
  torque_Nm: number;
};

export type GasketCalcParams = {
  kFactor: number;
  unitSystem: UnitSystem;
};
