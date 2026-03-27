import { CashflowRubroTable } from "@/components/tables/cashflow-rubro-table";
import { PageTitle } from "@/components/ui/page-title";

export default function CashflowRubro() {
  return (
    <>
      <PageTitle title="Rubros de Cashflow" />
      <CashflowRubroTable />
    </>
  );
}
