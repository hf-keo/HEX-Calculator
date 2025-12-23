import { useMemo, useState } from "react";
import { BeamModule } from "./components/BeamModule";
import { GasketStressModule } from "./components/GasketStressModule";
import { BoltShearModule } from "./components/BoltShearModule";

type Page = "gasket" | "boltShear" | "beam";

export default function App() {
  const [page, setPage] = useState<Page>("boltShear");

  const title = useMemo(() => {
    if (page === "beam") return "Beam / I-Beam Cracking (legacy)";
    if (page === "gasket") return "Gasket Stress & Bolt Torque";
    return "Bolt Shear Check (Support vs TLR)";
  }, [page]);

  const btn = (key: Page, label: string) => (
    <button
      onClick={() => setPage(key)}
      style={{
        padding: "10px 14px",
        fontWeight: 700,
        borderRadius: 10,
        border: "1px solid #ddd",
        background: page === key ? "#f3f4f6" : "white",
        cursor: "pointer"
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: 18, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>HEX Calculator</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        {btn("boltShear", "Bolt Shear")}
        {btn("gasket", "Gasket Stress")}
        {btn("beam", "Beam (legacy)")}

        <div style={{ marginLeft: "auto", opacity: 0.75, alignSelf: "center" }}>{title}</div>
      </div>

      {page === "boltShear" ? <BoltShearModule /> : page === "gasket" ? <GasketStressModule /> : <BeamModule />}

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.7 }}>
        Engineering support tool only. Always verify with OEM procedures and a qualified engineer before field use.
      </div>
    </div>
  );
}
