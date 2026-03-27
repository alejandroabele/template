"use client";

import Form from "@/components/forms/inventario-subcategorias-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; categoriaId: string }>;
}) {
  const { categoriaId } = React.use(params);
  return (
    <>
      <PageTitle title="Crear Subcategoría" />
      <Form
        data={{
          inventarioCategoriaId: parseInt(categoriaId),
        }}
      />
    </>
  );
}
