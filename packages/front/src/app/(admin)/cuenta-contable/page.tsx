import CuentaContableTable from "@/components/tables/cuenta-contable-table";
import { PageTitle } from "@/components/ui/page-title";

export default function Page() {
  return (
    <>
      <PageTitle title="Cuentas Contables" />
      <CuentaContableTable />
    </>
  );
}
