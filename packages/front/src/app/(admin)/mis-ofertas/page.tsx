import { MisOfertasTable } from "@/components/tables/mis-ofertas-table";
import { PageTitle } from "@/components/ui/page-title";

export default function MisOfertas() {
  return (
    <>
      <PageTitle title="Mis presupuestos" />
      <MisOfertasTable />
    </>
  );
}
