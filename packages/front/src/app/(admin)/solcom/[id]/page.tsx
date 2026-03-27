"use client";

import SolcomPage from "@/components/pages/solcom";
import { useGetSolcomByIdQuery } from "@/hooks/solcom";
import { useMarcarRegistroLeidoMutation } from "@/hooks/registro-leido";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data, isLoading, isFetching } = useGetSolcomByIdQuery(Number(id));
  const { mutateAsync } = useMarcarRegistroLeidoMutation();

  React.useEffect(() => {
    if (data?.id && !(data as { registroLeido?: boolean }).registroLeido) {
      mutateAsync({ modelo: "solcom", modeloId: Number(data.id) });
    }
  }, [data, mutateAsync]);

  if (isLoading || isFetching) return <>Cargando...</>;
  return <SolcomPage data={data} />;
}
