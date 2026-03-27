"use client";
import { useState } from "react";
import { Persona } from "@/types";
import PantallaIdentificacion from "@/components/pages/pantalla-identificacion";
import DashboardOperario from "@/components/dashboards/dashboard-operario";

export default function OperariosPage() {
  const [persona, setPersona] = useState<Persona | null>(null);

  if (!persona) {
    return <PantallaIdentificacion onIdentificado={setPersona} />;
  }

  return (
    <DashboardOperario
      persona={persona}
      onSalir={() => setPersona(null)}
    />
  );
}
