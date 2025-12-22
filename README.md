# HEX Calculator

A browser-based engineering calculator for **heat exchanger lock ring (TLR / breech-lock) field operations**.

This project currently focuses on a **Beam / I-Beam cracking calculator**, used to estimate:
- Generated torque at the lock ring
- Support reactions
- Beam bending stress and utilization
- Beam deflection under applied load

The tool is designed to replicate **engineering hand-calculation logic** commonly found in Excel sheets used during maintenance and opening of large heat exchangers.

---

## 🔧 Current Features (V1)

### Beam / I-Beam Cracking Calculator
Assumes a **simply supported beam with a single point load**.

**Inputs (user-defined):**
- Lever radius (center of lock ring → applied force point)
- Support span (distance between supports)
- Load position along the beam
- Applied force (chain block / jack / winch)
- Beam properties:
  - Young’s modulus (E)
  - Section modulus (S)
  - Moment of inertia (I)
- Allowable bending stress

**Outputs:**
- Generated torque at lock ring
- Support reactions (RA, RB)
- Maximum bending moment
- Bending stress
- Bending utilization (%)
- Deflection at load point

**Status Indicators:**
- ✅ OK (< 80%)
- ⚠ WARNING (80–100%)
- ❌ FAIL (> 100%)

---

## 📐 Units

- **Internal calculation base units:**
  - Length: inches
  - Force: lbf
  - Stress: psi

- **Displayed units:**
  - Length: in / mm
  - Force: lbf / kN
  - Stress: psi / MPa
  - Torque: ft·lbf / N·m

English and Metric inputs are shown **side-by-side** for every relevant field.

---

## ⚙️ Assumptions & Limitations

- Beam is **simply supported**
- Single point load only
- Linear elastic behavior
- No dynamic effects
- No connection checks (studs, shackles, padeyes not included yet)

⚠ **This tool does NOT replace detailed engineering verification.**  
All results must be reviewed by a qualified engineer before field use.

---

## 🧠 Intended Use

This calculator is intended for:
- Field planning and sanity checks
- Comparing beam sizes and lever arm configurations
- Understanding how changes in geometry or load affect stresses and deflection

It mirrors the type of calculations typically done in **OEM / senior engineer Excel sheets**, but in a transparent, browser-based format.

---

## 🚀 Live Demo

https://hf-keo.github.io/HEX-Calculator/

---

## 🛠 Tech Stack

- React + TypeScript
- Vite
- Client-side only (no backend)
- GitHub Pages (CI/CD via GitHub Actions)

---

## 📂 Project Structure

```
src/
  calc/
    units.ts
    beamCalc.ts
  components/
    BeamModule.tsx
    DualNumberField.tsx
  types/
    beam.ts
  App.tsx
  main.tsx
```

---

## 🔜 Planned Enhancements

- Beam section dropdown (W-beam / UB / IPE)
- Connection checks (stud shear, pin shear, padeye)
- Multiple load points (dual chain blocks / jacks)
- Lock ring thread shear module
- Push bolt / jack screw module
- Export results to PDF / JSON

---

## 📜 Disclaimer

This tool is provided for **engineering support only**.
The author assumes no liability for field execution based solely on this calculator.

Always follow:
- OEM procedures
- Site-specific method statements
- Applicable codes and standards
