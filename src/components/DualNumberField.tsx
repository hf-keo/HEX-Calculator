import React from "react";

type Props = {
  label: string;
  enUnit: string;
  siUnit: string;

  baseValue: number;
  setBaseValue: (v: number) => void;

  fromBaseToEN: (base: number) => number;
  fromBaseToSI: (base: number) => number;
  toBaseFromEN: (en: number) => number;
  toBaseFromSI: (si: number) => number;

  decimals?: number;
};

export function DualNumberField(props: Props) {
  const d = props.decimals ?? 3;

  const enVal = props.baseValue === 0 ? "" : props.fromBaseToEN(props.baseValue).toFixed(d);
  const siVal = props.baseValue === 0 ? "" : props.fromBaseToSI(props.baseValue).toFixed(d);

  const onChangeEN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === "") {
      props.setBaseValue(0);
      return;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) return;
    props.setBaseValue(props.toBaseFromEN(num));
  };

  const onChangeSI = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === "") {
      props.setBaseValue(0);
      return;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) return;
    props.setBaseValue(props.toBaseFromSI(num));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 12, alignItems: "center", marginBottom: 10 }}>
      <div style={{ fontWeight: 600 }}>{props.label}</div>

      <div>
        <input type="number" inputMode="decimal" value={enVal} onChange={onChangeEN} style={{ width: "100%", padding: 8 }} />
        <div style={{ fontSize: 12, opacity: 0.7 }}>{props.enUnit}</div>
      </div>

      <div>
        <input type="number" inputMode="decimal" value={siVal} onChange={onChangeSI} style={{ width: "100%", padding: 8 }} />
        <div style={{ fontSize: 12, opacity: 0.7 }}>{props.siUnit}</div>
      </div>
    </div>
  );
}
