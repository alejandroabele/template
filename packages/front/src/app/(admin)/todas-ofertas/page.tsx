import { OfertaTable } from "@/components/tables/oferta-table";
import { PageTitle } from "@/components/ui/page-title";

export default function TodasOfertasPage() {
  return (
    <>
      <PageTitle title="Todas las ofertas" />
      <OfertaTable />
    </>
  );
}
