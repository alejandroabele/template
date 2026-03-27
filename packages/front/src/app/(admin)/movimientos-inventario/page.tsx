import { MovimientosInventarioTable } from "@/components/tables/movimientos-inventario-table"
import { PageTitle } from "@/components/ui/page-title"

export default function Page() {
    return <>
        <PageTitle title="Movimientos Inventario" />
        <MovimientosInventarioTable />
    </>
}