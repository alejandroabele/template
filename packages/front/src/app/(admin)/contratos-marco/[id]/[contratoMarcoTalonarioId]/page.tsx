"use client";

import Form from "@/components/forms/contrato-marco-talonario-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";
import { useGetContratoMarcoTalonarioByIdQuery } from "@/hooks/contrato-marco-talonario";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();

  const contratoMarcoTalonarioId = params?.contratoMarcoTalonarioId;
  const porcentaje = searchParams.get("porcentaje");

  const { data, isLoading, isFetching } = useGetContratoMarcoTalonarioByIdQuery(
    parseInt(contratoMarcoTalonarioId as string)
  );

  if (isLoading || isFetching) return <>Cargando...</>;
  return (
    <>
      <PageTitle title="Editar Talonario" />
      {porcentaje && (
        <div className="text-sm text-muted-foreground mb-4">
          Aplicando actualización de precios con un{" "}
          <span className="font-medium text-primary">{porcentaje}%</span> de
          incremento
        </div>
      )}
      <Form
        data={{
          ...data,
          items: data.items.map((item) => ({
            ...item,
            precio: porcentaje
              ? parseFloat(item.precio) * (1 + parseFloat(porcentaje) / 100) +
                ""
              : item.precio,
          })),
        }}
        porcentaje={porcentaje}
      />{" "}
    </>
  );
}
