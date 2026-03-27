"use client";
import { useEffect, useState } from "react";
import { JornadaPersona, Refrigerio } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, User, Wrench, Hash, Coffee, Square } from "lucide-react";
import { useFinalizarAsignacionMutation } from "@/hooks/jornada";

type Props = {
  sesiones: JornadaPersona[];
  refrigerios?: Refrigerio[];
};

function calcularDiff(inicioStr?: string): number {
  if (!inicioStr) return 0;
  const d = new Date(inicioStr.replace(" ", "T") + "-03:00");
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
}

function formatSegs(segs: number): string {
  const h = Math.floor(segs / 3600);
  const m = Math.floor((segs % 3600) / 60);
  const s = segs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}h ${mm}:${ss}` : `${mm}:${ss}`;
}

export default function DashboardEnCurso({ sesiones, refrigerios = [] }: Props) {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);
  const finalizarMutation = useFinalizarAsignacionMutation();

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (sesiones.length === 0 && refrigerios.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No hay operarios trabajando en este momento</p>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {sesiones.map((sesion) => {
        const segs = mounted ? calcularDiff(sesion.inicio) : 0;
        return (
          <Card key={sesion.id}>
            <CardContent className="p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="bg-green-50 dark:bg-green-950 p-1.5 rounded-md">
                    <User className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {sesion.persona?.nombre} {sesion.persona?.apellido}
                  </span>
                </div>
                <span className="flex items-center gap-1 font-mono text-sm font-semibold">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatSegs(segs)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench className="h-3 w-3 shrink-0" />
                <span className="truncate">{sesion.produccionTrabajo?.nombre ?? sesion.jornada?.detalle}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Hash className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  OT #{sesion.jornada?.presupuesto?.id} · {sesion.jornada?.presupuesto?.cliente?.nombre}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => finalizarMutation.mutate(sesion.id as number)}
                disabled={finalizarMutation.isPending}
                className="mt-0.5 h-6 px-2 self-end text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Square className="h-3 w-3" fill="currentColor" />
                Finalizar
              </Button>
            </CardContent>
          </Card>
        );
      })}
      {refrigerios.map((r) => {
        const segs = mounted ? calcularDiff(r.inicio) : 0;
        return (
          <Card key={`ref-${r.id}`}>
            <CardContent className="p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="bg-amber-50 dark:bg-amber-950 p-1.5 rounded-md">
                    <User className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {r.persona?.nombre} {r.persona?.apellido}
                  </span>
                </div>
                <span className="flex items-center gap-1 font-mono text-sm font-semibold text-amber-600">
                  <Timer className="h-3.5 w-3.5" />
                  {formatSegs(segs)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Coffee className="h-3 w-3 shrink-0" />
                <span>Refrigerio</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
