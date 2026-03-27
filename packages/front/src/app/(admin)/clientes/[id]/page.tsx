"use client";

import ClientesForm from "@/components/forms/clientes-form";
import { useGetClienteByIdQuery } from "@/hooks/clientes";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetClienteByIdQuery(id);
  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <ClientesForm data={data} />
    </>
  );
}
