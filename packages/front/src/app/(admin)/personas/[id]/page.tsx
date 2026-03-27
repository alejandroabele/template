"use client";

import PersonasForm from "@/components/forms/personas-form";
import { PageTitle } from "@/components/ui/page-title";
import { useGetPersonaByIdQuery } from "@/hooks/persona";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetPersonaByIdQuery(Number(id));
  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <PersonasForm data={data} />
    </>
  );
}
