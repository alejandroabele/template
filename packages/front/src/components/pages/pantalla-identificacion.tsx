"use client";
import { useState } from "react";
import { Persona } from "@/types";
import { fetchPorDni } from "@/services/personas";

type Props = {
  onIdentificado: (persona: Persona) => void;
};

export default function PantallaIdentificacion({ onIdentificado }: Props) {
  const [dni, setDni] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleIngresar = async () => {
    if (!dni.trim()) return;
    setCargando(true);
    setError("");
    try {
      const persona = await fetchPorDni(dni.trim());
      onIdentificado(persona);
    } catch {
      setError("DNI no encontrado. Verificá el número ingresado.");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleIngresar();
  };

  return (
    <div className="min-h-svh h-full flex items-start justify-center bg-background p-6 pt-32">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Panel Operarios</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Ingresá tu DNI para continuar
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={dni}
            onChange={(e) => {
              setDni(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ej: 30123456"
            autoFocus
            className="w-full text-3xl font-mono text-center py-5 px-6 rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none"
          />

          {error && (
            <p className="text-center text-lg font-medium text-destructive">
              {error}
            </p>
          )}

          <button
            onClick={handleIngresar}
            disabled={!dni.trim() || cargando}
            className="w-full py-6 rounded-xl bg-primary text-primary-foreground text-2xl font-bold tracking-wide disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            {cargando ? "Verificando..." : "INGRESAR"}
          </button>
        </div>
      </div>
    </div>
  );
}
