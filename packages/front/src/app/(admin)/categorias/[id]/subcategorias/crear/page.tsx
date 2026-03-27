"use client";

import Form from "@/components/forms/inventario-subcategorias-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <>
      <PageTitle title="Crear Subcategoría" />
      <Form
        data={{
          inventarioCategoriaId: parseInt(id),
        }}
      />
    </>
  );
}
