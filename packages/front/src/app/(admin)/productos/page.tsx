import { InventarioTable } from "@/components/tables/inventario-table"
import { PageTitle } from "@/components/ui/page-title"

export default function Page() {
    return <>
        <PageTitle title="Productos" />
        <InventarioTable />
    </>
}