"use client";

import { Button } from "@/components/ui/button";
import { BancoTable } from "@/components/tables/banco-table";
import { PageTitle } from "@/components/ui/page-title";

export default function BancosPage() {
  return (
    <>
      <PageTitle title="Gestión de Bancos" />
      <BancoTable />
    </>
  );
}
