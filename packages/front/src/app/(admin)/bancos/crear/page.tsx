"use client";

import BancoForm from "@/components/forms/banco-form";
import { PageTitle } from "@/components/ui/page-title";

export default function CrearBancoPage() {
  return (
    <>
      <PageTitle title="Crear Banco" />
      <BancoForm />
    </>
  );
}
