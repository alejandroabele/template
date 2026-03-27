"use client";

import Form from "@/components/forms/contrato-marco-talonario-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";
import { useGetContratoMarcoByIdQuery } from "@/hooks/contrato-marco";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetContratoMarcoByIdQuery(
    parseInt(id)
  );
  if (isLoading || isFetching) return <>Cargando...</>;

  return (
    <>
      <PageTitle title="Crear Talonario" />
      <Form
        data={{
          contratoMarcoId: parseInt(id),
          contratoMarco: data,
        }}
      />
    </>
  );
}
