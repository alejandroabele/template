"use client";

import Form from "@/components/forms/plazo-pago-form";
import { PageTitle } from "@/components/ui/page-title";
import { useGetPlazoPagoByIdQuery } from "@/hooks/plazo-pago";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetPlazoPagoByIdQuery(Number(id));
  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <PageTitle title="Editar Plazo de Pago" />
      <Form data={data} />
    </>
  );
}
