import { useMemo, useState } from "react";
import { BOLT_SIZES, MATERIALS } from "../data/boltShearData";
import { BoltShearInput } from "../types/boltShear";
import { calcBoltShear, validateBoltShear } from "../calc/boltShearCalc";
import { kN_to_lbf, lbf_to_kN, m_to_ft, ft_to_m, psi_to_MPa } from "../calc/units";

function fmt(x: number, d = 0) {
  if (!Number.isFinite(x)) return "—";
  return x.toFixed(d);
}

const DEFAULT: BoltShearInput = {
  unitSystem: "EN",
  F_lbf: 0,
  theta_deg: 0,
  X_ft: 0,
  D_ft: 0,
  safetyFactor: 2.0,
  support: { name: "Support", boltKey: '1"-8UN', materialKey: "SA-193-B16", boltCount: 2 },
  tlr: { name: "TLR Tie-in", boltKey: '1-1/8"-8UN', materialKey: "SA-193-B16", boltCount: 2 }
};

export function BoltShearModule() {
  const [unitSystem, setUnitSystem] = useState<"EN" | "SI">("EN");
  const [inp, setInp] = useState<BoltShearInput>({ ...DEFAULT });
  const [calculated, setCalculated] = useState(false);

  const merged = useMemo(() => ({ ...inp, unitSystem }), [inp, unitSystem]);
  const validation = useMemo(() => validateBoltShear(merged), [merged]);
  const out = useMemo(() => (calculated && validation.ok ? calcBoltShear(merged) : null), [calculated, validation.ok, merged]);

  const forceUnit = unitSystem === "EN" ? "lbf" : "kN";
  const lenUnit = unitSystem === "EN" ? "ft" : "m";
  const stressUnit = unitSystem === "EN" ? "psi" : "MPa";

  const setField = (k: keyof BoltShearInput, v: any) => setInp(prev => ({ ...prev, [k]: v }));

  const F_display = unitSystem === "EN" ? merged.F_lbf : lbf_to_kN(merged.F_lbf);
  const X_display = unitSystem === "EN" ? merged.X_ft : ft_to_m(merged.X_ft);
  const D_display = unitSystem === "EN" ? merged.D_ft : ft_to_m(merged.D_ft);

  const setF = (v: number) => setField("F_lbf", unitSystem === "EN" ? v : kN_to_lbf(v));
  const setX = (v: number) => setField("X_ft", unitSystem === "EN" ? v : m_to_ft(v));
  const setD = (v: number) => setField("D_ft", unitSystem === "EN" ? v : m_to_ft(v));

  const clear = () => {
    setInp({ ...DEFAULT });
    setCalculated(false);
    setUnitSystem("EN");
  };

  const statusChip = (s: "OK" | "WARN" | "FAIL") => {
    const map = {
      OK: { t: "✅ OK", bg: "#eaf7ee", br: "#b7e1c1" },
      WARN: { t: "⚠ High", bg: "#fff7e6", br: "#ffd59a" },
      FAIL: { t: "❌ FAIL", bg: "#fff0f0", br: "#ffb3b3" }
    } as const;
    const x = map[s];
    return <span style={{ padding: "4px 8px", borderRadius: 999, border: `1px solid ${x.br}`, background: x.bg, fontWeight: 700 }}>{x.t}</span>;
  };

  const dispStress = (psi: number) => (unitSystem === "EN" ? psi : psi_to_MPa(psi));

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
      <h2 style={{ marginTop: 0 }}>Bolt Shear Check — Support vs TLR Tie-In</h2>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>Units</div>
        <button onClick={() => setUnitSystem("EN")} style={{ ...uBtn, background: unitSystem === "EN" ? "#f3f4f6" : "white" }}>English</button>
        <button onClick={() => setUnitSystem("SI")} style={{ ...uBtn, background: unitSystem === "SI" ? "#f3f4f6" : "white" }}>Metric</button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontWeight: 700 }}>Safety Factor</div>
          <input type="number" value={merged.safetyFactor}
            onChange={(e) => setField("safetyFactor", e.target.value.trim() === "" ? 0 : Number(e.target.value))}
            style={{ width: 110, padding: 8 }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={card}>
          <div style={cardTitle}>Load & Geometry</div>

          <label style={lab}>Applied load at lifting point, F ({forceUnit})</label>
          <input type="number" value={merged.F_lbf === 0 ? "" : String(F_display)}
            onChange={(e) => setF(e.target.value.trim() === "" ? 0 : Number(e.target.value))}
            style={inpStyle} />

          <label style={lab}>Beam angle from horizontal, θ (deg)</label>
          <input type="number" value={merged.theta_deg === 0 ? "" : String(merged.theta_deg)}
            onChange={(e) => setField("theta_deg", e.target.value.trim() === "" ? 0 : Number(e.target.value))}
            style={inpStyle} />

          <label style={lab}>X = lifting point → TLR bolt group ({lenUnit})</label>
          <input type="number" value={merged.X_ft === 0 ? "" : String(X_display)}
            onChange={(e) => setX(e.target.value.trim() === "" ? 0 : Number(e.target.value))}
            style={inpStyle} />

          <label style={lab}>D = spacing between Support ↔ TLR groups ({lenUnit})</label>
          <input type="number" value={merged.D_ft === 0 ? "" : String(D_display)}
            onChange={(e) => setD(e.target.value.trim() === "" ? 0 : Number(e.target.value))}
            style={inpStyle} />

          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
            Vertical load split: <b>R_TLR = Fv·(X/D)</b>, <b>R_Support = Fv − R_TLR</b>.
          </div>
        </div>

        <div style={card}>
          <div style={cardTitle}>Bolt Groups</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Support</div>

              <label style={lab}>Bolt size</label>
              <select value={merged.support.boltKey} onChange={(e) => setField("support", { ...merged.support, boltKey: e.target.value })}
                style={inpStyle}>
                {BOLT_SIZES.map(b => <option key={b.key} value={b.key}>{b.key} (At {b.At_in2} in²)</option>)}
              </select>

              <label style={lab}>Material</label>
              <select value={merged.support.materialKey} onChange={(e) => setField("support", { ...merged.support, materialKey: e.target.value })}
                style={inpStyle}>
                {MATERIALS.map(m => <option key={m.key} value={m.key}>{m.key} (Sy {m.Sy_ksi} ksi)</option>)}
              </select>

              <label style={lab}>Number of bolts</label>
              <input type="number" value={merged.support.boltCount}
                onChange={(e) => setField("support", { ...merged.support, boltCount: e.target.value.trim() === "" ? 0 : Number(e.target.value) })}
                style={inpStyle} />
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>TLR Tie-in</div>

              <label style={lab}>Bolt size</label>
              <select value={merged.tlr.boltKey} onChange={(e) => setField("tlr", { ...merged.tlr, boltKey: e.target.value })}
                style={inpStyle}>
                {BOLT_SIZES.map(b => <option key={b.key} value={b.key}>{b.key} (At {b.At_in2} in²)</option>)}
              </select>

              <label style={lab}>Material</label>
              <select value={merged.tlr.materialKey} onChange={(e) => setField("tlr", { ...merged.tlr, materialKey: e.target.value })}
                style={inpStyle}>
                {MATERIALS.map(m => <option key={m.key} value={m.key}>{m.key} (Sy {m.Sy_ksi} ksi)</option>)}
              </select>

              <label style={lab}>Number of bolts</label>
              <input type="number" value={merged.tlr.boltCount}
                onChange={(e) => setField("tlr", { ...merged.tlr, boltCount: e.target.value.trim() === "" ? 0 : Number(e.target.value) })}
                style={inpStyle} />
            </div>
          </div>
        </div>
      </div>

      {calculated && !validation.ok && (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid #f5c2c7", background: "#fff4f4", borderRadius: 10 }}>
          <b>Fix these before trusting results:</b>
          <ul style={{ marginTop: 8 }}>
            {validation.errors.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={() => setCalculated(true)} style={{ padding: "10px 14px", fontWeight: 900, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
          Calculate
        </button>
        <button onClick={clear} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
          Clear
        </button>
        <div style={{ marginLeft: "auto", opacity: 0.85, alignSelf: "center" }}>
          {calculated ? (validation.ok ? "Status: ✅ Calculated" : "Status: ❌ Input errors") : "Status: Waiting for inputs"}
        </div>
      </div>

      {out && (
        <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 12 }}>
          <h3>Results</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={card}>
              <div style={cardTitle}>Resolved Load</div>
              <div><b>Fv (vertical):</b> {fmt(unitSystem === "EN" ? out.Fv_lbf : lbf_to_kN(out.Fv_lbf), unitSystem === "EN" ? 0 : 2)} {forceUnit}</div>
              <div><b>Fa (axial):</b> {fmt(unitSystem === "EN" ? out.Fa_lbf : lbf_to_kN(out.Fa_lbf), unitSystem === "EN" ? 0 : 2)} {forceUnit}</div>
              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                X−D: {fmt(unitSystem === "EN" ? out.XminusD_ft : ft_to_m(out.XminusD_ft), 3)} {lenUnit}
              </div>
            </div>

            <div style={card}>
              <div style={cardTitle}>Support Group</div>
              <div style={{ marginBottom: 6 }}>{statusChip(out.support.status)}</div>
              <div><b>Reaction (signed):</b> {fmt(unitSystem === "EN" ? out.support.reaction_lbf : lbf_to_kN(out.support.reaction_lbf), unitSystem === "EN" ? 0 : 2)} {forceUnit}</div>
              <div><b>|Reaction|:</b> {fmt(unitSystem === "EN" ? out.support.reactionAbs_lbf : lbf_to_kN(out.support.reactionAbs_lbf), unitSystem === "EN" ? 0 : 2)} {forceUnit}</div>
              <div><b>Shear / bolt:</b> {fmt(unitSystem === "EN" ? out.support.perBoltShear_lbf : lbf_to_kN(out.support.perBoltShear_lbf), unitSystem === "EN" ? 0 : 3)} {forceUnit}</div>
              <div><b>Shear stress:</b> {fmt(dispStress(out.support.shearStress_psi), unitSystem === "EN" ? 0 : 2)} {stressUnit}</div>
              <div><b>Allowable shear:</b> {fmt(dispStress(out.support.allowableShear_psi), unitSystem === "EN" ? 0 : 2)} {stressUnit}</div>
              <div><b>Utilization:</b> {fmt(out.support.utilization_percent, 1)}%</div>
            </div>

            <div style={card}>
              <div style={cardTitle}>TLR Tie-in Group</div>
              <div style={{ marginBottom: 6 }}>{statusChip(out.tlr.status)}</div>
              <div><b>Reaction (signed):</b> {fmt(unitSystem === "EN" ? out.tlr.reaction_lbf : lbf_to_kN(out.tlr.reaction_lbf), unitSystem === "EN" ? 0 : 2)} {forceUnit}</div>
              <div><b>|Reaction|:</b> {fmt(unitSystem === "EN" ? out.tlr.reactionAbs_lbf : lbf_to_kN(out.tlr.reactionAbs_lbf), unitSystem === "EN" ? 0 : 2)} {forceUnit}</div>
              <div><b>Shear / bolt:</b> {fmt(unitSystem === "EN" ? out.tlr.perBoltShear_lbf : lbf_to_kN(out.tlr.perBoltShear_lbf), unitSystem === "EN" ? 0 : 3)} {forceUnit}</div>
              <div><b>Shear stress:</b> {fmt(dispStress(out.tlr.shearStress_psi), unitSystem === "EN" ? 0 : 2)} {stressUnit}</div>
              <div><b>Allowable shear:</b> {fmt(dispStress(out.tlr.allowableShear_psi), unitSystem === "EN" ? 0 : 2)} {stressUnit}</div>
              <div><b>Utilization:</b> {fmt(out.tlr.utilization_percent, 1)}%</div>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
            Allowable shear = <b>0.5·Sy / SF</b>. Shear stress uses <b>At</b> (tensile stress area) as simplified shear area.
          </div>
        </div>
      )}
    </div>
  );
}

const uBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };
const card: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "white" };
const cardTitle: React.CSSProperties = { fontWeight: 900, marginBottom: 8 };
const lab: React.CSSProperties = { display: "block", fontWeight: 700, marginTop: 8, marginBottom: 4 };
const inpStyle: React.CSSProperties = { width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" };
