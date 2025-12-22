import { useState } from "react";
import { DualNumberField } from "./DualNumberField";
import { BeamInput } from "../types/beam";
import { calcBeam, BeamOutput } from "../calc/beamCalc";
import { in_to_mm, mm_to_in, lbf_to_kN, kN_to_lbf, psi_to_MPa, MPa_to_psi, ftlbf_to_Nm } from "../calc/units";

const emptyBeam: BeamInput = {
  leverRadius_in: 0,
  supportSpan_in: 0,
  loadPosFromLeft_in: 0,
  appliedForce_lbf: 0,
  E_psi: 0,
  sectionModulus_in3: 0,
  inertia_in4: 0,
  allowableBendingStress_psi: 0
};

function statusFromUtil(utilPct: number) {
  if (!Number.isFinite(utilPct)) return { label: "—", icon: "" };
  if (utilPct < 80) return { label: "OK", icon: "✅" };
  if (utilPct <= 100) return { label: "WARNING", icon: "⚠" };
  return { label: "FAIL", icon: "❌" };
}

export function BeamModule() {
  const [inp, setInp] = useState<BeamInput>(emptyBeam);
  const [out, setOut] = useState<BeamOutput | null>(null);

  const set = <K extends keyof BeamInput>(k: K, v: number) => setInp(prev => ({ ...prev, [k]: v }));

  const canCalculate =
    inp.leverRadius_in > 0 &&
    inp.supportSpan_in > 0 &&
    inp.loadPosFromLeft_in >= 0 &&
    inp.appliedForce_lbf > 0 &&
    inp.E_psi > 0 &&
    inp.sectionModulus_in3 > 0 &&
    inp.inertia_in4 > 0 &&
    inp.allowableBendingStress_psi > 0 &&
    inp.loadPosFromLeft_in <= inp.supportSpan_in;

  const utilStatus = out ? statusFromUtil(out.bendingUtil_percent) : null;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
      <h2 style={{ marginTop: 0 }}>Beam / I-Beam Cracking Calculator (legacy)</h2>
      <div style={{ opacity: 0.8, marginBottom: 10 }}>
        This module is a simple beam model kept for reference.
      </div>

      <h3>Geometry</h3>
      <DualNumberField label="Lever radius R (center → load point)" enUnit="in" siUnit="mm"
        baseValue={inp.leverRadius_in} setBaseValue={(v) => set("leverRadius_in", v)}
        fromBaseToEN={(x) => x} fromBaseToSI={in_to_mm} toBaseFromEN={(x) => x} toBaseFromSI={mm_to_in} decimals={3} />

      <DualNumberField label="Support span L (left → right support)" enUnit="in" siUnit="mm"
        baseValue={inp.supportSpan_in} setBaseValue={(v) => set("supportSpan_in", v)}
        fromBaseToEN={(x) => x} fromBaseToSI={in_to_mm} toBaseFromEN={(x) => x} toBaseFromSI={mm_to_in} decimals={3} />

      <DualNumberField label="Load position a (from left support)" enUnit="in" siUnit="mm"
        baseValue={inp.loadPosFromLeft_in} setBaseValue={(v) => set("loadPosFromLeft_in", v)}
        fromBaseToEN={(x) => x} fromBaseToSI={in_to_mm} toBaseFromEN={(x) => x} toBaseFromSI={mm_to_in} decimals={3} />

      <h3>Load</h3>
      <DualNumberField label="Applied force F (line pull / jack force)" enUnit="lbf" siUnit="kN"
        baseValue={inp.appliedForce_lbf} setBaseValue={(v) => set("appliedForce_lbf", v)}
        fromBaseToEN={(x) => x} fromBaseToSI={lbf_to_kN} toBaseFromEN={(x) => x} toBaseFromSI={kN_to_lbf} decimals={2} />

      <h3>Beam Properties</h3>
      <DualNumberField label="Young’s modulus E" enUnit="psi" siUnit="MPa"
        baseValue={inp.E_psi} setBaseValue={(v) => set("E_psi", v)}
        fromBaseToEN={(x) => x} fromBaseToSI={psi_to_MPa} toBaseFromEN={(x) => x} toBaseFromSI={MPa_to_psi} decimals={0} />

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600 }}>Section modulus S</div>
        <input type="number" value={inp.sectionModulus_in3 === 0 ? "" : String(inp.sectionModulus_in3)}
          onChange={(e) => set("sectionModulus_in3", e.target.value.trim() === "" ? 0 : Number(e.target.value))}
          placeholder="in^3" style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600 }}>Moment of inertia I</div>
        <input type="number" value={inp.inertia_in4 === 0 ? "" : String(inp.inertia_in4)}
          onChange={(e) => set("inertia_in4", e.target.value.trim() === "" ? 0 : Number(e.target.value))}
          placeholder="in^4" style={{ width: "100%", padding: 8 }} />
      </div>

      <h3>Allowables</h3>
      <DualNumberField label="Allowable bending stress" enUnit="psi" siUnit="MPa"
        baseValue={inp.allowableBendingStress_psi} setBaseValue={(v) => set("allowableBendingStress_psi", v)}
        fromBaseToEN={(x) => x} fromBaseToSI={psi_to_MPa} toBaseFromEN={(x) => x} toBaseFromSI={MPa_to_psi} decimals={0} />

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={() => setOut(calcBeam(inp))} disabled={!canCalculate}
          style={{ padding: "10px 14px", fontWeight: 700, cursor: canCalculate ? "pointer" : "not-allowed" }}>
          Calculate
        </button>
        <button onClick={() => { setInp(emptyBeam); setOut(null); }} style={{ padding: "10px 14px" }}>Clear</button>
      </div>

      {out && (
        <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 12 }}>
          <h3>Results</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Generated</div>
              <div><b>Torque:</b> {out.torque_ftlbf.toFixed(0)} ft·lbf ({ftlbf_to_Nm(out.torque_ftlbf).toFixed(0)} N·m)</div>
            </div>
            <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Support reactions</div>
              <div><b>RA:</b> {out.RA_lbf.toFixed(0)} lbf ({lbf_to_kN(out.RA_lbf).toFixed(2)} kN)</div>
              <div><b>RB:</b> {out.RB_lbf.toFixed(0)} lbf ({lbf_to_kN(out.RB_lbf).toFixed(2)} kN)</div>
            </div>
            <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Beam</div>
              <div><b>Mmax:</b> {out.Mmax_ftlbf.toFixed(0)} ft·lbf</div>
              <div><b>Stress:</b> {out.bendingStress_psi.toFixed(0)} psi ({psi_to_MPa(out.bendingStress_psi).toFixed(1)} MPa)</div>
              <div><b>Utilization:</b> {out.bendingUtil_percent.toFixed(1)}% <span style={{ marginLeft: 6 }}>{utilStatus?.icon} {utilStatus?.label}</span></div>
            </div>
            <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Deflection</div>
              <div><b>δ at load:</b> {out.deflection_in.toFixed(3)} in ({in_to_mm(out.deflection_in).toFixed(1)} mm)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
