import CashflowRubroForm from "@/components/forms/cashflow-rubro-form";
import { PageTitle } from "@/components/ui/page-title";

export default function CrearCashflowRubro() {
  return (
    <>
      <PageTitle title="Crear Rubro de Cashflow" />
      <div className="">
        <CashflowRubroForm />
      </div>
    </>
  );
}
