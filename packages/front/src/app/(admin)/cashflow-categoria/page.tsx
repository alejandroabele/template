import { CashflowCategoriaTable } from "@/components/tables/cashflow-categoria-table";
import { PageTitle } from "@/components/ui/page-title";

export default function CashflowCategoria() {
  return (
    <>
      <PageTitle title="Categorías de Cashflow" />
      <CashflowCategoriaTable />
    </>
  );
}
