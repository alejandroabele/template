import { RecetasTable } from "@/components/tables/recetas-table"
import { PageTitle } from "@/components/ui/page-title"

export default function page() {
    return <>
        <PageTitle title="Recetas" />
        <RecetasTable />
    </>
}