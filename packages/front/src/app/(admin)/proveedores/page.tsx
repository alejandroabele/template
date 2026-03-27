import { ProveedoresTable } from "@/components/tables/proveedores-table"
import { PageTitle } from "@/components/ui/page-title"

export default function Proveedores() {
    return <>
        <PageTitle title="Proveedores" />
        <ProveedoresTable />
    </>
}