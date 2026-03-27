"use client";
import { useEffect, useState } from "react";
import { JornadaPersona } from "@/types";
import { Play, Square, Timer, Building2, Hash } from "lucide-react";
import { getTime } from "@/utils/date";

type Props = {
  trabajo: JornadaPersona;
  onIniciar: (jornadaPersonaId: number | string) => void;
  onFinalizar: (jornadaPersonaId: number) => void;
  cargando: boolean;
};

function calcularDiff(inicioStr: string): number {
  // El string es "YYYY-MM-DD HH:mm:ss" en hora Argentina (UTC-3)
  const d = new Date(inicioStr.replace(" ", "T") + "-03:00");
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
}

function formatearSegundos(diff: number): string {
  const horas = Math.floor(diff / 3600);
  const minutos = Math.floor((diff % 3600) / 60);
  const segundos = diff % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return horas > 0 ? `${horas}:${pad(minutos)}:${pad(segundos)}` : `${pad(minutos)}:${pad(segundos)}`;
}

export default function TarjetaTrabajo({ trabajo, onIniciar, onFinalizar, cargando }: Props) {
  const enProgreso = trabajo.estado === "en_progreso";
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!enProgreso || !trabajo.inicio) { setSegundos(0); return; }
    setSegundos(calcularDiff(trabajo.inicio));
    const interval = setInterval(() => setSegundos(calcularDiff(trabajo.inicio!)), 1000);
    return () => clearInterval(interval);
  }, [enProgreso, trabajo.inicio]);

  const nombreTrabajo = trabajo.produccionTrabajo?.nombre ?? trabajo.jornada?.detalle ?? "Trabajo";
  const numeroOt = trabajo.jornada?.presupuesto?.id ? `${trabajo.jornada.presupuesto.id}` : "";
  const cliente = trabajo.jornada?.presupuesto?.cliente?.nombre ?? "";
  const color = trabajo.produccionTrabajo?.color ?? "#888";

  const completado = trabajo.estado === "completada";

  return (
    <div className={`rounded-2xl bg-card border-2 border-border flex transition-all ${completado ? "opacity-60" : ""}`}>
      {/* Contenido */}
      <div className="flex-1 p-5 flex items-center gap-4 min-w-0">
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Nombre trabajo con dot de color */}
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-2xl font-bold tracking-tight uppercase leading-tight truncate">
              {nombreTrabajo}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-muted-foreground font-medium">
            {numeroOt && (
              <span className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                OT {numeroOt}
              </span>
            )}
            {cliente && (
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {cliente}
              </span>
            )}
            {enProgreso && trabajo.inicio && (
              <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
                <Timer className="w-4 h-4 shrink-0" />
                Iniciado a las{" "}
                <span className="font-mono font-bold">{getTime(trabajo.inicio)}</span>
                {/* {segundos > 0 && (
                  <span className="ml-2 font-mono font-bold">· {formatearSegundos(segundos)}</span>
                )} */}
              </span>
            )}
          </div>
        </div>

        {/* Botón acción */}
        {!completado && (
          <button
            disabled={cargando}
            onClick={() => enProgreso ? onFinalizar(trabajo.id!) : onIniciar(trabajo.id!)}
            className="shrink-0 flex flex-col items-center justify-center gap-2 rounded-xl py-5 text-lg font-bold tracking-wide transition-colors disabled:opacity-50 w-36"
            style={
              enProgreso
                ? { background: "#dc2626", color: "#fff" }
                : { background: "#16a34a", color: "#fff" }
            }
          >
            {enProgreso
              ? <><Square className="w-7 h-7" fill="currentColor" /><span>FINALIZAR</span></>
              : <><Play className="w-7 h-7" fill="currentColor" /><span>INICIAR</span></>
            }
          </button>
        )}

        {completado && (
          <div className="shrink-0 flex flex-col items-center justify-center gap-1 w-36 text-muted-foreground">
            <span className="text-2xl">✓</span>
            <span className="text-xs font-bold uppercase tracking-wide">Completado</span>
          </div>
        )}
      </div>
    </div>
  );
}
