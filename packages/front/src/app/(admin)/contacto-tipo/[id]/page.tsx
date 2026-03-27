"use client";

import ContactoTipoForm from "@/components/forms/contacto-tipo-form";
import { PageTitle } from "@/components/ui/page-title";
import { useGetContactoTipoByIdQuery } from "@/hooks/contacto-tipo";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetContactoTipoByIdQuery(Number(id));

  if (isLoading || isFetching) return <>Cargando...</>;

  return (
    <>
      <PageTitle title="Editar Tipo de Contacto" />
      <ContactoTipoForm data={data} />
    </>
  );
}
