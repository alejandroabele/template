"use client";

import BancoSaldoForm from "@/components/forms/banco-saldo-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

interface CrearSaldoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CrearSaldoPage({ params }: CrearSaldoPageProps) {
  const { id } = React.use(params);
  const bancoId = parseInt(id);

  return (
    <>
      <PageTitle title="Crear Saldo" />
      <BancoSaldoForm defaultBancoId={bancoId} />
    </>
  );
}
