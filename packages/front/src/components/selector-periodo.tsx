"use client";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";

export type RangoFecha = { from: string; to: string } | null;

type Props = {
  value: RangoFecha;
  onChange: (r: RangoFecha) => void;
};

function hoyBsAs(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function lunesBsAs(): string {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })
  );
  const diasDesdelunes = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diasDesdelunes);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

function primeroDelMes(): string {
  return hoyBsAs().slice(0, 7) + "-01";
}

function ultimoDiaMes(): string {
  const hoy = hoyBsAs();
  const [y, m] = hoy.split("-").map(Number);
  const ultimo = new Date(y, m, 0).getDate();
  return `${hoy.slice(0, 7)}-${String(ultimo).padStart(2, "0")}`;
}

const PRESETS = [
  { label: "Hoy", desde: () => hoyBsAs(), hasta: () => hoyBsAs() },
  { label: "Esta semana", desde: lunesBsAs, hasta: hoyBsAs },
  { label: "Este mes", desde: primeroDelMes, hasta: ultimoDiaMes },
];

export function SelectorPeriodo({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => {
        const from = p.desde();
        const to = p.hasta();
        const activo = value?.from === from && value?.to === to;
        return (
          <Button
            key={p.label}
            variant={activo ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ from, to })}
          >
            {p.label}
          </Button>
        );
      })}
      <DateRangePicker
        label=""
        onChange={onChange}
        defaultValue={value}
      />
    </div>
  );
}
