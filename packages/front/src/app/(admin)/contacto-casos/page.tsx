"use client";

import React from "react";
import { ContactoCasoGrid } from "@/components/grids/contacto-caso";

export default function ContactoCasoGridPage() {
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <div className="-m-6 h-[calc(100vh-5rem)]">
        <ContactoCasoGrid />
      </div>
    </React.Suspense>
  );
}
