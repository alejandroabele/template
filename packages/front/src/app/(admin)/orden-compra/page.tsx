import { OrdenCompraTable } from "@/components/tables/orden-compra-table";
import { PageTitle } from "@/components/ui/page-title";

export default function OrdenCompra() {
  return (
    <>
      <PageTitle title="Órdenes de Compra" />
      <OrdenCompraTable />
    </>
  );
}
