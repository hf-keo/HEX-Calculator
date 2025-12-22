import { UnitSystem } from "../types/gasket";

export function UnitToggle(props: { value: UnitSystem; onChange: (v: UnitSystem) => void }) {
  const { value, onChange } = props;
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ fontWeight: 700 }}>Units</div>
      <button
        onClick={() => onChange("EN")}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: value === "EN" ? "#f3f4f6" : "white",
          cursor: "pointer"
        }}
      >
        English (in, psi, ft·lbf)
      </button>
      <button
        onClick={() => onChange("SI")}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: value === "SI" ? "#f3f4f6" : "white",
          cursor: "pointer"
        }}
      >
        Metric (mm, MPa, N·m)
      </button>
    </div>
  );
}
