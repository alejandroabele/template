"use client";
import CashflowRubroForm from "@/components/forms/cashflow-rubro-form";
import { PageTitle } from "@/components/ui/page-title";
import { useGetCashflowRubroByIdQuery } from "@/hooks/cashflow-rubro";
import { useParams } from "next/navigation";

export default function EditarCashflowRubro() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const { data, isLoading, error } = useGetCashflowRubroByIdQuery(id);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !data) {
    return <div>Error al cargar el rubro</div>;
  }

  return (
    <>
      <PageTitle title="Editar Rubro de Cashflow" />
      <div className="">
        <CashflowRubroForm data={data} />
      </div>
    </>
  );
}
