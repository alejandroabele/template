import { ComisionesTable } from "@/components/tables/comisiones-table"
import { PageTitle } from "@/components/ui/page-title"

export default function Page() {
    return <>
        <PageTitle title="Comisiones" />
        <ComisionesTable />
    </>
}