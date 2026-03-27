import { CentroCostosTable } from "@/components/tables/centro-costo-table";
import { PageTitle } from "@/components/ui/page-title";

export default function CentroCostosPage() {
  return (
    <>
      <PageTitle title="Centros de Costos" />
      <CentroCostosTable />
    </>
  );
}
