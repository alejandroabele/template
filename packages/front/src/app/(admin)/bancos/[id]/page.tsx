"use client";

import { useGetBancoByIdQuery } from "@/hooks/banco";
import BancoForm from "@/components/forms/banco-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

interface BancoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BancoPage({ params }: BancoPageProps) {
  const { id } = React.use(params);
  const bancoId = parseInt(id);
  const { data: banco, isLoading, error } = useGetBancoByIdQuery(bancoId);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !banco) {
    return <div>Error al cargar el banco</div>;
  }

  return (
    <>
      <PageTitle title="Editar Banco" />
      <BancoForm data={banco} />
    </>
  );
}
