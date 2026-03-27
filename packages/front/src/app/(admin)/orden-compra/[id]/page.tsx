"use client";

import { useGetOrdenCompraByIdQuery } from "@/hooks/orden-compra";
import React from "react";
import OrdenCompraPage from "@/components/pages/orden-compra";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const {
    data: ordenCompra,
    isLoading,
    isFetching,
  } = useGetOrdenCompraByIdQuery(Number(id));

  if (isLoading || isFetching) return <div>Cargando...</div>;
  if (!ordenCompra) return <div>No se encontró la orden de compra</div>;

  return (
    <>
      <OrdenCompraPage data={ordenCompra} />
    </>
  );
}
