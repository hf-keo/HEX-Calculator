import { useMemo, useState } from "react";
import { BeamModule } from "./components/BeamModule";
import { GasketStressModule } from "./components/GasketStressModule";

type Page = "beam" | "gasket";

export default function App() {
  const [page, setPage] = useState<Page>("gasket");

  const title = useMemo(() => {
    if (page === "beam") return "Beam / I-Beam Cracking";
    return "Gasket Stress & Bolt Torque";
  }, [page]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 18, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>HEX Calculator</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <button
          onClick={() => setPage("gasket")}
          style={{
            padding: "10px 14px",
            fontWeight: 700,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: page === "gasket" ? "#f3f4f6" : "white",
            cursor: "pointer"
          }}
        >
          Gasket Stress
        </button>
        <button
          onClick={() => setPage("beam")}
          style={{
            padding: "10px 14px",
            fontWeight: 700,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: page === "beam" ? "#f3f4f6" : "white",
            cursor: "pointer"
          }}
        >
          Beam Calc (legacy)
        </button>

        <div style={{ marginLeft: "auto", opacity: 0.75, alignSelf: "center" }}>
          {title}
        </div>
      </div>

      {page === "gasket" ? <GasketStressModule /> : <BeamModule />}

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.7 }}>
        Notes: Engineering support tool. Always verify with OEM procedures and a qualified engineer before field use.
      </div>
    </div>
  );
}
