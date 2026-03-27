"use client";

import EgresoMasivoForm from "@/components/forms/egreso-masivo-form";
import { PageTitle } from "@/components/ui/page-title";

export default function EgresoMasivoPage() {
  return (
    <>
      <PageTitle title="Egreso inventario" />
      <EgresoMasivoForm />
    </>
  );
}
