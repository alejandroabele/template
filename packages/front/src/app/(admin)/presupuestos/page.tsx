import { PresupuestosTable } from "@/components/tables/presupuestos-table"
import { PageTitle } from "@/components/ui/page-title"

export default function Page() {
    return <>
        <PageTitle title="Presupuestos" />
        <PresupuestosTable />
    </>
}