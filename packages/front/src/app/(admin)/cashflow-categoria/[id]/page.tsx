"use client";
import CashflowCategoriaForm from "@/components/forms/cashflow-categoria-form";
import { PageTitle } from "@/components/ui/page-title";
import { useGetCashflowCategoriaByIdQuery } from "@/hooks/cashflow-categoria";
import { useParams } from "next/navigation";

export default function EditarCashflowCategoria() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const { data, isLoading, error } = useGetCashflowCategoriaByIdQuery(id);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !data) {
    return <div>Error al cargar la categoría</div>;
  }

  return (
    <>
      <PageTitle title="Editar Categoría de Cashflow" />
      <div className="">
        <CashflowCategoriaForm data={data} />
      </div>
    </>
  );
}
