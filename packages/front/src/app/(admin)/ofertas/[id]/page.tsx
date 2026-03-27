"use client";

import OfertaPage from "@/components/pages/oferta";
import { useGetOfertaByIdQuery } from "@/hooks/oferta";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const {
    data: oferta,
    isLoading,
    isFetching,
  } = useGetOfertaByIdQuery(Number(id));

  if (isLoading || isFetching) return <>Cargando...</>;

  return <OfertaPage oferta={oferta} />;
}
