"use client";
import { useState, useEffect, useRef } from "react";
import { JornadaPersona, Persona } from "@/types";
import {
  useGetMisAsignacionesQuery,
  useIniciarAsignacionMutation,
  useFinalizarAsignacionMutation,
  useGetTrabajosOtQuery,
  useIniciarPorOtMutation,
} from "@/hooks/jornada";
import {
  useGetRefrigerioActivoQuery,
  useIniciarRefrigerioMutation,
  useFinalizarRefrigerioMutation,
} from "@/hooks/refrigerio";
import TarjetaTrabajo from "@/components/features/tarjeta-trabajo";
import { LogOut, Search, Coffee, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  persona: Persona;
  onSalir: () => void;
};

function getHoyArgentina(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

function calcularDiffSegundos(inicioStr: string): number {
  const d = new Date(inicioStr.replace(" ", "T") + "-03:00");
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
}

function BotonRefrigerio({ personaId }: { personaId: number }) {
  const { data: refrigerioActivo } = useGetRefrigerioActivoQuery(personaId);
  const iniciarRefrigerio = useIniciarRefrigerioMutation();
  const finalizarRefrigerio = useFinalizarRefrigerioMutation();
  const [segundos, setSegundos] = useState(0);
  const enRefrigerio = !!refrigerioActivo?.id;

  useEffect(() => {
    if (!enRefrigerio || !refrigerioActivo?.inicio) { setSegundos(0); return; }
    setSegundos(calcularDiffSegundos(refrigerioActivo.inicio));
    const interval = setInterval(() => setSegundos(calcularDiffSegundos(refrigerioActivo.inicio!)), 1000);
    return () => clearInterval(interval);
  }, [enRefrigerio, refrigerioActivo?.inicio]);

  const cargandoRefrigerio = iniciarRefrigerio.isPending || finalizarRefrigerio.isPending;

  if (enRefrigerio) {
    return (
      <button
        disabled={cargandoRefrigerio}
        onClick={() => finalizarRefrigerio.mutate({ id: refrigerioActivo!.id!, personaId })}
        className="flex items-center justify-center gap-2 w-[140px] h-[52px] shrink-0 rounded-xl bg-amber-500 text-white disabled:opacity-50 hover:bg-amber-600 transition-colors"
      >
        <Coffee className="w-5 h-5 shrink-0 animate-pulse" />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-bold leading-none">Refrigerio</span>
          <span className="text-[11px] opacity-80 leading-none mt-0.5">Toca para volver</span>
        </div>
      </button>
    );
  }

  return (
    <button
      disabled={cargandoRefrigerio}
      onClick={() => iniciarRefrigerio.mutate(personaId)}
      className="flex items-center justify-center gap-2 w-[140px] h-[52px] shrink-0 rounded-xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 disabled:opacity-50 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
    >
      <Coffee className="w-5 h-5 shrink-0" />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-sm font-bold leading-none">Refrigerio</span>
        <span className="text-[11px] opacity-60 leading-none mt-0.5">Toca para iniciar</span>
      </div>
    </button>
  );
}

function sumarDias(fecha: string, dias: number): string {
  const d = new Date(fecha + "T12:00:00");
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}

function formatearFechaDisplay(fecha: string): string {
  const hoy = getHoyArgentina();
  if (fecha === hoy) return "Hoy";
  const ayer = sumarDias(hoy, -1);
  if (fecha === ayer) return "Ayer";
  const d = new Date(fecha + "T12:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
}

function NavegadorFecha({ fecha, onChange }: { fecha: string; onChange: (f: string) => void }) {
  const hoy = getHoyArgentina();
  const esHoy = fecha === hoy;
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(sumarDias(fecha, -1))}
        className="flex items-center justify-center w-[52px] h-[52px] rounded-xl border-2 border-border bg-card hover:bg-muted transition-colors"
        aria-label="Día anterior"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={() => onChange(hoy)}
        disabled={esHoy}
        className="flex flex-col items-center justify-center h-[52px] w-[100px] shrink-0 rounded-xl border-2 border-border bg-card hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-default"
      >
        <span className="text-base font-bold leading-tight">{formatearFechaDisplay(fecha)}</span>
        {!esHoy && <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Ir a hoy</span>}
      </button>
      <button
        onClick={() => onChange(sumarDias(fecha, 1))}
        disabled={esHoy}
        className="flex items-center justify-center w-[52px] h-[52px] rounded-xl border-2 border-border bg-card hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-default"
        aria-label="Día siguiente"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
}

// ID virtual para diferenciar trabajos de OT buscada de los reales
const VIRTUAL_OT_PREFIX = "virtual-ot-";

function esTrabajoDeBusqueda(id: any): boolean {
  return typeof id === "string" && id.startsWith(VIRTUAL_OT_PREFIX);
}

function BuscadorOt({ onResultado, yaAsignado, sinDisponibles }: { onResultado: (otId: number | null, resultado: any | null) => void; yaAsignado: boolean; sinDisponibles: boolean }) {
  const [inputOt, setInputOt] = useState("");
  const [otIdBuscado, setOtIdBuscado] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data: resultadoOt, isLoading: buscando, isError } = useGetTrabajosOtQuery(otIdBuscado);

  useEffect(() => {
    if (resultadoOt && !isError) {
      onResultado(otIdBuscado, resultadoOt);
    } else if (isError) {
      onResultado(null, null);
    }
  }, [resultadoOt, isError, otIdBuscado]);

  const handleBuscar = () => {
    const num = parseInt(inputOt.trim(), 10);
    if (!num || isNaN(num)) return;
    if (num !== otIdBuscado) {
      onResultado(null, null);
      setOtIdBuscado(num);
    }
  };

  const handleLimpiar = () => {
    setInputOt("");
    setOtIdBuscado(null);
    onResultado(null, null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputOt}
            onChange={(e) => { setInputOt(e.target.value); if (!e.target.value.trim()) handleLimpiar(); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleBuscar(); }}
            placeholder="Buscar OT por número..."
            className="w-full text-xl py-4 pl-14 pr-5 rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none"
          />
        </div>
        <button
          onClick={handleBuscar}
          disabled={!inputOt.trim() || buscando}
          className="px-6 h-[64px] rounded-xl bg-primary text-primary-foreground text-lg font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors shrink-0"
        >
          {buscando ? "..." : "BUSCAR"}
        </button>
      </div>
      {isError && otIdBuscado && (
        <p className="text-xl font-semibold text-destructive text-center">
          OT #{otIdBuscado} no existe
        </p>
      )}
      {!isError && resultadoOt && resultadoOt.trabajos?.length === 0 && (
        <p className="text-xl font-semibold text-muted-foreground text-center">
          OT #{otIdBuscado} no tiene trabajos disponibles para realizar
        </p>
      )}
      {!isError && resultadoOt && resultadoOt.trabajos?.length > 0 && !sinDisponibles && (
        <p className="text-xl font-semibold text-green-600 dark:text-green-400 text-center">
          OT #{otIdBuscado} — {resultadoOt.trabajos.length} trabajo{resultadoOt.trabajos.length !== 1 ? "s" : ""} disponible{resultadoOt.trabajos.length !== 1 ? "s" : ""}
        </p>
      )}
      {!isError && resultadoOt && resultadoOt.trabajos?.length > 0 && yaAsignado && sinDisponibles && (
        <p className="text-xl font-semibold text-muted-foreground text-center">
          Ya tenés todos los trabajos de esta OT asignados
        </p>
      )}
    </div>
  );
}

export default function DashboardOperario({ persona, onSalir }: Props) {
  const hoy = getHoyArgentina();
  const [fecha, setFecha] = useState(hoy);
  const { data: asignaciones = [], isLoading } = useGetMisAsignacionesQuery(persona.dni, fecha);
  const iniciarMutation = useIniciarAsignacionMutation();
  const finalizarMutation = useFinalizarAsignacionMutation();
  const iniciarPorOtMutation = useIniciarPorOtMutation();

  const [otIdBuscado, setOtIdBuscado] = useState<number | null>(null);
  const [resultadoOt, setResultadoOt] = useState<any | null>(null);

  const cargando = iniciarMutation.isPending || finalizarMutation.isPending || iniciarPorOtMutation.isPending;

  // IDs de trabajos que el operario ya tiene activos hoy para esa OT
  const trabajosActivosEnOt = new Set(
    asignaciones
      .filter((a) => a.jornada?.presupuesto?.id === resultadoOt?.presupuesto?.id)
      .map((a) => a.produccionTrabajoId)
  );

  const yaAsignadoEnOt = resultadoOt ? trabajosActivosEnOt.size > 0 : false;

  // Construye JornadaPersona virtuales filtrando los trabajos que ya tiene activos
  const trabajosVirtuales: JornadaPersona[] = resultadoOt
    ? resultadoOt.trabajos
        .filter((pp: any) => !trabajosActivosEnOt.has(pp.trabajo.id))
        .map((pp: any) => ({
          id: `${VIRTUAL_OT_PREFIX}${pp.trabajo.id}` as any,
          produccionTrabajoId: pp.trabajo.id,
          produccionTrabajo: pp.trabajo,
          jornada: {
            presupuestoId: resultadoOt.presupuesto.id,
            presupuesto: resultadoOt.presupuesto,
          },
          estado: "sin_iniciar" as const,
        }))
    : [];

  const enProgreso = asignaciones.filter((a) => a.estado === "en_progreso");
  const sinIniciar = [
    ...asignaciones.filter((a) => a.estado === "sin_iniciar"),
    ...trabajosVirtuales,
  ];
  const completadas = asignaciones.filter((a) => a.estado === "completada");

  const handleIniciar = async (id: number | string) => {
    if (esTrabajoDeBusqueda(id)) {
      // Extraer produccionTrabajoId del id virtual
      const virtual = trabajosVirtuales.find((v) => v.id === id);
      if (!virtual || !otIdBuscado) return;
      await iniciarPorOtMutation.mutateAsync({
        otId: otIdBuscado,
        produccionTrabajoId: virtual.produccionTrabajoId!,
        personaDni: persona.dni,
      });
      setResultadoOt(null);
      setOtIdBuscado(null);
    } else {
      iniciarMutation.mutate(id as number);
    }
  };

  const handleFinalizar = (id: number) => finalizarMutation.mutate(id);

  return (
    <div className="min-h-svh flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-medium">Operario</span>
          <span className="text-2xl font-bold">
            {persona.nombre} {persona.apellido}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <NavegadorFecha fecha={fecha} onChange={setFecha} />
          <BotonRefrigerio personaId={persona.id!} />
          <button
            onClick={onSalir}
            className="flex items-center gap-2 text-lg px-5 h-[52px] rounded-xl bg-muted hover:bg-muted/80 font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="px-6 py-4 border-b bg-card">
        <BuscadorOt
          onResultado={(otId, resultado) => {
            setOtIdBuscado(otId);
            setResultadoOt(resultado);
          }}
          yaAsignado={yaAsignadoEnOt}
          sinDisponibles={trabajosVirtuales.length === 0}
        />
      </div>

      {/* Lista */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-xl text-muted-foreground">
            Cargando trabajos...
          </div>
        ) : asignaciones.length === 0 && sinIniciar.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-xl text-muted-foreground text-center">
            No hay trabajos asignados para esta fecha
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* En progreso */}
            {enProgreso.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-base uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  En progreso ({enProgreso.length})
                </div>
                <div className="flex flex-col gap-3">
                  {enProgreso.map((asignacion) => (
                    <TarjetaTrabajo
                      key={asignacion.id}
                      trabajo={asignacion}
                      onIniciar={handleIniciar}
                      onFinalizar={handleFinalizar}
                      cargando={cargando}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Disponibles (asignadas + virtuales de OT buscada) */}
            {sinIniciar.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-base uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Disponibles ({sinIniciar.length})
                </div>
                <div className="flex flex-col gap-3">
                  {sinIniciar.map((asignacion) => (
                    <TarjetaTrabajo
                      key={asignacion.id}
                      trabajo={asignacion}
                      onIniciar={handleIniciar}
                      onFinalizar={handleFinalizar}
                      cargando={cargando}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completadas */}
            {completadas.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-base uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  Completadas ({completadas.length})
                </div>
                <div className="flex flex-col gap-3 opacity-60">
                  {completadas.map((asignacion) => (
                    <TarjetaTrabajo
                      key={asignacion.id}
                      trabajo={asignacion}
                      onIniciar={handleIniciar}
                      onFinalizar={handleFinalizar}
                      cargando={cargando}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
