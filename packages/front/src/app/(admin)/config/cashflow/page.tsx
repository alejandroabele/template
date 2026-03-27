import CashflowForm from "@/components/forms/config/cashflow-form";
import { PageTitle } from "@/components/ui/page-title";

export default function CashflowConfigPage() {
  return (
    <>
      <PageTitle title="Configuración de Cashflow" />
      <CashflowForm />
    </>
  );
}
