"use client";

import Form from "@/components/forms/oferta-form";
import { useGetOfertaByIdQuery } from "@/hooks/oferta";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetOfertaByIdQuery(id);
  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <Form data={data} duplicar />
    </>
  );
}
