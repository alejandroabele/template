"use client";

import { useGetBancoSaldoByIdQuery } from "@/hooks/banco-saldo";
import BancoSaldoForm from "@/components/forms/banco-saldo-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

interface EditarSaldoPageProps {
  params: Promise<{
    id: string;
    saldoId: string;
  }>;
}

export default function EditarSaldoPage({ params }: EditarSaldoPageProps) {
  const { id, saldoId } = React.use(params);
  const bancoId = parseInt(id);
  const saldoIdNum = parseInt(saldoId);
  const {
    data: saldo,
    isLoading,
    error,
  } = useGetBancoSaldoByIdQuery(saldoIdNum);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !saldo) {
    return <div>Error al cargar el saldo</div>;
  }

  return (
    <>
      <PageTitle title="Editar Saldo" />
      <BancoSaldoForm data={saldo} defaultBancoId={bancoId} />
    </>
  );
}
