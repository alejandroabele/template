import { PlazoPagoTable } from "@/components/tables/plazo-pago-table";
import { PageTitle } from "@/components/ui/page-title";

export default function PlazoPago() {
  return (
    <>
      <PageTitle title="Plazos de Pago" />
      <PlazoPagoTable />
    </>
  );
}
