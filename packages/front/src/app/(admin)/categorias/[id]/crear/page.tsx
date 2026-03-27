"use client";

import Form from "@/components/forms/inventario-categorias-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; categoriaId: string }>;
}) {
  const { id, categoriaId } = React.use(params);
  return (
    <>
      <PageTitle title="Crear categoria Producto" />
      <Form
        data={{
          inventarioFamiliaId: parseInt(id),
        }}
      />
    </>
  );
}
