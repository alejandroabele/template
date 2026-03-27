"use client";

import ContratosMarcoPage from "@/components/pages/contrato-marco";
import { PageTitle } from "@/components/ui/page-title";
import { useGetContratoMarcoByIdQuery } from "@/hooks/contrato-marco";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetContratoMarcoByIdQuery(id);
  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <PageTitle title="Editar Contrato Marco" />
      <ContratosMarcoPage data={data} />
    </>
  );
}
