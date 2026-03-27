"use client";

import { PageTitle } from "@/components/ui/page-title";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Inicio" />
      <p className="text-muted-foreground">
        Bienvenido al sistema. Seleccioná una opción del menú para comenzar.
      </p>
    </div>
  );
}
