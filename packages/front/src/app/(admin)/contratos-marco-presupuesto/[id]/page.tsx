"use client";

import Form from "@/components/forms/contrato-marco-presupuesto-form/";
import { PageTitle } from "@/components/ui/page-title";
import { useGetContratoMarcoPresupuestoByIdQuery } from "@/hooks/contrato-marco-presupuesto";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } =
    useGetContratoMarcoPresupuestoByIdQuery(id);
  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <PageTitle title="Editar Orden de Contrato Marco" />
      <Form data={data} contratoMarco={data?.contratoMarco} tipo={data?.tipo} />
    </>
  );
}
