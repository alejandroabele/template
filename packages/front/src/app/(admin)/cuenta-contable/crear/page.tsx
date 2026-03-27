"use client";

import { PageTitle } from "@/components/ui/page-title";
import CuentaContableForm from "@/components/forms/cuenta-contable-form";

export default function Page() {
  return (
    <>
      <PageTitle title="Crear Cuenta Contable" />
      <CuentaContableForm />
    </>
  );
}
