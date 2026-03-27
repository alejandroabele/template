"use client";

import React, { Suspense } from "react";
import { CalendarioJornadas } from "@/components/calendars/jornadas";
import { useSearchParams } from "next/navigation";

function JornadasContent() {
  const searchParams = useSearchParams();
  const presupuestoIdParam = searchParams.get("presupuestoId");
  const presupuestoId = presupuestoIdParam ? Number(presupuestoIdParam) : undefined;

  return <CalendarioJornadas presupuestoId={presupuestoId} />;
}

export default function JornadasPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <JornadasContent />
      </Suspense>
    </div>
  );
}
