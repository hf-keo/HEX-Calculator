import { BeamModule } from "./components/BeamModule";

export default function App() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 18, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>HEX Calculator</h1>
      <div style={{ opacity: 0.8, marginBottom: 18 }}>
        V1: Beam / I-Beam Cracking Calculator (dual units, manual calculate).
      </div>

      <BeamModule />

      <div style={{ marginTop: 22, fontSize: 12, opacity: 0.7 }}>
        Notes: This tool assumes a simply supported beam with a single point load.
        Always verify connections (studs/shackles/padeyes) and site constraints separately.
      </div>
    </div>
  );
}
