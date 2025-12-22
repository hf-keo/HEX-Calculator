import { useMemo, useState } from "react";
import { UnitToggle } from "./UnitToggle";
import { STUD_SPECS } from "../data/studs";
import { calculateRow, validateRow } from "../calc/gasketStress";
import { GasketCalcParams, GasketRowInput, GasketRowResult, UnitSystem } from "../types/gasket";
import { in_to_mm, mm_to_in, psi_to_MPa, MPa_to_psi } from "../calc/units";

const DEFAULT_ROWS: GasketRowInput[] = [
  { id: "internal_flange", name: "Internal Flange Bolt", studKey: "1-1/2-8UN", studStress_psi: 0, studCount: 0, gasketOD_in: 0, gasketID_in: 0, designPressure_psi: 0, tlrOD_in: 0, gasketType: "KAG" },
  { id: "partition_cover", name: "1/2 Circle Partition Cover Bolt", studKey: "5/8-11UNC", studStress_psi: 0, studCount: 0, gasketOD_in: 0, gasketID_in: 0, designPressure_psi: 0, tlrOD_in: 0, gasketType: "" },
  { id: "tlr", name: "TLR Bolt", studKey: "1-1/2-8UN", studStress_psi: 0, studCount: 0, gasketOD_in: 0, gasketID_in: 0, designPressure_psi: 0, tlrOD_in: 0, gasketType: "KAG" },
  { id: "channel_cover", name: "Channel Cover Bolt", studKey: "1-1/2-8UN", studStress_psi: 0, studCount: 0, gasketOD_in: 0, gasketID_in: 0, designPressure_psi: 0, tlrOD_in: 0, gasketType: "KAG" }
];

const K_OPTIONS = [0.117, 0.15, 0.17];

function fmt(x: number, digits = 0) {
  if (!Number.isFinite(x)) return "—";
  return x.toFixed(digits);
}

type RowState = {
  row: GasketRowInput;
  valid: { ok: boolean; errors: string[] };
  result: GasketRowResult | null;
};

export function GasketStressModule() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("EN");
  const [kFactor, setKFactor] = useState<number>(0.117);
  const [rows, setRows] = useState<GasketRowInput[]>(DEFAULT_ROWS);
  const [calculated, setCalculated] = useState<boolean>(false);

  const params: GasketCalcParams = useMemo(() => ({ kFactor, unitSystem }), [kFactor, unitSystem]);

  const rowStates: RowState[] = useMemo(() => {
    return rows.map(r => {
      const isTLR = r.id === "tlr";
      const valid = validateRow(r, isTLR);
      const result = calculated && valid.ok ? calculateRow(r, params) : null;
      return { row: r, valid, result };
    });
  }, [rows, params, calculated]);

  const anyErrors = rowStates.some(s => !s.valid.ok);

  const updateRow = (idx: number, patch: Partial<GasketRowInput>) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const clearAll = () => {
    setRows(DEFAULT_ROWS.map(r => ({ ...r, studStress_psi: 0, studCount: 0, gasketOD_in: 0, gasketID_in: 0, designPressure_psi: 0, tlrOD_in: 0 })));
    setCalculated(false);
  };

  const toDisplayLen = (inches: number) => (unitSystem === "EN" ? inches : in_to_mm(inches));
  const fromDisplayLen = (v: number) => (unitSystem === "EN" ? v : mm_to_in(v));

  const toDisplayStress = (psi: number) => (unitSystem === "EN" ? psi : psi_to_MPa(psi));
  const fromDisplayStress = (v: number) => (unitSystem === "EN" ? v : MPa_to_psi(v));

  const lenUnit = unitSystem === "EN" ? "in" : "mm";
  const stressUnit = unitSystem === "EN" ? "psi" : "MPa";
  const torqueUnit = unitSystem === "EN" ? "ft·lbf" : "N·m";

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
      <h2 style={{ marginTop: 0 }}>Gasket Stress & Bolt Torque (Reeves Method)</h2>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
        <UnitToggle value={unitSystem} onChange={(v) => setUnitSystem(v)} />

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontWeight: 700 }}>Nut factor K</div>
          <select value={String(kFactor)} onChange={(e) => setKFactor(Number(e.target.value))}
            style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}>
            {K_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            0.117 (breech lock/lock ring studs), 0.15–0.17 (typical bolting)
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
          <thead>
            <tr>
              <th style={th}>Connection</th>
              <th style={th}>Stud Spec</th>
              <th style={th}>Stud Stress ({stressUnit})</th>
              <th style={th}>Stud Count</th>
              <th style={th}>Gasket OD ({lenUnit})</th>
              <th style={th}>Gasket ID ({lenUnit})</th>
              <th style={th}>Design P ({stressUnit})</th>
              <th style={th}>TLR OD / Plug Dia ({lenUnit})</th>

              <th style={thOut}>At (in²)</th>
              <th style={thOut}>Load/Stud (lbf)</th>
              <th style={thOut}>Total Bolt Load (lbf)</th>
              <th style={thOut}>Pressure Load (lbf)</th>
              <th style={thOut}>Gasket Stress ({stressUnit})</th>
              <th style={thOut}>Torque ({torqueUnit})</th>
            </tr>
          </thead>
          <tbody>
            {rowStates.map((s, idx) => {
              const r = s.row;
              const isTLR = r.id === "tlr";
              const result = s.result;

              const rowStyle = !calculated ? {} : (s.valid.ok ? {} : { background: "#fff4f4" });

              return (
                <tr key={r.id} style={rowStyle}>
                  <td style={td}><b>{r.name}</b></td>

                  <td style={td}>
                    <select value={r.studKey} onChange={(e) => updateRow(idx, { studKey: e.target.value })}
                      style={{ width: "100%", padding: 6 }}>
                      {STUD_SPECS.map(s => <option key={s.key} value={s.key}>{s.key}</option>)}
                    </select>
                  </td>

                  <td style={td}>
                    <input type="number"
                      value={r.studStress_psi === 0 ? "" : String(toDisplayStress(r.studStress_psi))}
                      onChange={(e) => updateRow(idx, { studStress_psi: e.target.value.trim() === "" ? 0 : fromDisplayStress(Number(e.target.value)) })}
                      style={inp} />
                  </td>

                  <td style={td}>
                    <input type="number"
                      value={r.studCount === 0 ? "" : String(r.studCount)}
                      onChange={(e) => updateRow(idx, { studCount: e.target.value.trim() === "" ? 0 : Number(e.target.value) })}
                      style={inp} />
                  </td>

                  <td style={td}>
                    <input type="number"
                      value={r.gasketOD_in === 0 ? "" : String(toDisplayLen(r.gasketOD_in))}
                      onChange={(e) => updateRow(idx, { gasketOD_in: e.target.value.trim() === "" ? 0 : fromDisplayLen(Number(e.target.value)) })}
                      style={inp} />
                  </td>

                  <td style={td}>
                    <input type="number"
                      value={r.gasketID_in === 0 ? "" : String(toDisplayLen(r.gasketID_in))}
                      onChange={(e) => updateRow(idx, { gasketID_in: e.target.value.trim() === "" ? 0 : fromDisplayLen(Number(e.target.value)) })}
                      style={inp} />
                  </td>

                  <td style={td}>
                    <input type="number"
                      value={r.designPressure_psi === 0 ? "" : String(toDisplayStress(r.designPressure_psi))}
                      onChange={(e) => updateRow(idx, { designPressure_psi: e.target.value.trim() === "" ? 0 : fromDisplayStress(Number(e.target.value)) })}
                      style={inp} />
                  </td>

                  <td style={td}>
                    <input type="number"
                      disabled={!isTLR}
                      value={r.tlrOD_in === 0 ? "" : String(toDisplayLen(r.tlrOD_in))}
                      onChange={(e) => updateRow(idx, { tlrOD_in: e.target.value.trim() === "" ? 0 : fromDisplayLen(Number(e.target.value)) })}
                      style={{ ...inp, background: isTLR ? "white" : "#f5f5f5" }}
                      placeholder={isTLR ? "" : "—"} />
                  </td>

                  <td style={tdOut}>{result ? fmt(result.tensileArea_in2, 3) : "—"}</td>
                  <td style={tdOut}>{result ? fmt(result.loadPerStud_lbf, 0) : "—"}</td>
                  <td style={tdOut}>{result ? fmt(result.totalBoltLoad_lbf, 0) : "—"}</td>
                  <td style={tdOut}>{result ? fmt(result.pressureLoad_lbf, 0) : "—"}</td>
                  <td style={tdOut}>
                    {result ? fmt(toDisplayStress(result.gasketStress_psi), unitSystem === "EN" ? 0 : 2) : "—"}
                  </td>
                  <td style={tdOut}>
                    {result ? (unitSystem === "EN" ? fmt(result.torque_ftlbf, 0) : fmt(result.torque_Nm, 0)) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {calculated && anyErrors && (
        <div style={{ marginTop: 10, padding: 10, border: "1px solid #f5c2c7", background: "#fff4f4", borderRadius: 10 }}>
          <b>Fix these before trusting results:</b>
          <ul style={{ marginTop: 8 }}>
            {rowStates.flatMap((s) => (!s.valid.ok ? s.valid.errors.map((e, i) => (
              <li key={s.row.id + "-" + i}><b>{s.row.name}:</b> {e}</li>
            )) : []))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={() => setCalculated(true)}
          style={{ padding: "10px 14px", fontWeight: 800, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
          Calculate
        </button>
        <button onClick={clearAll}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
          Clear
        </button>
        <div style={{ marginLeft: "auto", opacity: 0.8, alignSelf: "center" }}>
          {calculated ? (anyErrors ? "Status: ❌ Fix input errors" : "Status: ✅ Calculated") : "Status: Waiting for inputs"}
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: 8, borderBottom: "1px solid #ddd", background: "#fafafa", position: "sticky", top: 0 };
const thOut: React.CSSProperties = { ...th, background: "#f2f2f2" };
const td: React.CSSProperties = { padding: 8, borderBottom: "1px solid #eee", verticalAlign: "top" };
const tdOut: React.CSSProperties = { ...td, background: "#fcfcfc", fontVariantNumeric: "tabular-nums" };
const inp: React.CSSProperties = { width: "100%", padding: 6 };
