"use client";

import { PageTitle } from "@/components/ui/page-title";
import CuentaContableForm from "@/components/forms/cuenta-contable-form";
import { useGetCuentaContableByIdQuery } from "@/hooks/cuenta-contable";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading } = useGetCuentaContableByIdQuery(Number(id));

  if (isLoading) return <>Cargando...</>;

  return (
    <>
      <PageTitle title={`Editar Cuenta Contable #${id}`} />
      <CuentaContableForm data={data} />
    </>
  );
}
