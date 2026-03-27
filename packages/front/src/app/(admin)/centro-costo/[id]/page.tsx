"use client";

import CentroCostoForm from "@/components/forms/centro-costo-form";
import { PageTitle } from "@/components/ui/page-title";
import { useGetCentroCostoByIdQuery } from "@/hooks/centro-costo";
import React from "react";

export default function EditCentroCostoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetCentroCostoByIdQuery(
    Number(id)
  );

  if (isLoading || isFetching) return <>Cargando...</>;

  return (
    <>
      <PageTitle title="Editar Centro de Costo" />
      <CentroCostoForm data={data} />
    </>
  );
}
