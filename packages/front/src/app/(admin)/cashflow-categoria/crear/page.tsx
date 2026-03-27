import CashflowCategoriaForm from "@/components/forms/cashflow-categoria-form";
import { PageTitle } from "@/components/ui/page-title";

export default function CrearCashflowCategoria() {
  return (
    <>
      <PageTitle title="Crear Categoría de Cashflow" />
      <div className="">
        <CashflowCategoriaForm />
      </div>
    </>
  );
}
