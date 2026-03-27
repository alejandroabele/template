import { MetodoPagoTable } from "@/components/tables/metodo-pago-table";
import { PageTitle } from "@/components/ui/page-title";

export default function MetodoPago() {
  return (
    <>
      <PageTitle title="Métodos de Pago" />
      <MetodoPagoTable />
    </>
  );
}
