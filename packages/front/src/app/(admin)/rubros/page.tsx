import { ProveedoresRubroTable } from "@/components/tables/proveedores-rubro-table"
import { PageTitle } from "@/components/ui/page-title"

export default function ProveedoresRubro() {
    return <>
        <PageTitle title="Rubros de proveedores" />
        <ProveedoresRubroTable />
    </>
}