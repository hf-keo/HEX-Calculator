# HEX Calculator

Browser-based calculator for Heat Exchanger (Breech-lock / TLR) field operations.

Modules:
- **Gasket Stress & Bolt Torque (Reeves method)**
- **Bolt Shear Check (Support vs TLR tie-in)** ✅
- Beam Calc (legacy)

## Local run
```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)
This repo includes a GitHub Actions workflow that deploys `dist/` to Pages.

If the workflow fails on `npm ci`, ensure `package-lock.json` is committed.
