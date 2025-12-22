# HEX Calculator

A browser-based engineering calculator for **heat exchanger lock ring (TLR / breech-lock) field operations**.

This repo currently includes:
- **Gasket Stress & Bolt Torque (Reeves method)** — matches the Excel logic you provided.
- **Beam Calc (legacy)** — a simple beam model kept for reference.

---

## 🚀 Live Demo

https://hf-keo.github.io/HEX-Calculator/

---

## 🧪 Local Run

```bash
npm install
npm run dev
```

---

## 🧾 Deployment

This repo uses **GitHub Actions** to build and deploy to **GitHub Pages**.

If Actions fails on `npm ci`, make sure `package-lock.json` exists (commit it).

---

## 📜 Disclaimer

Engineering support tool only. Always verify with OEM procedures and a qualified engineer before field use.
