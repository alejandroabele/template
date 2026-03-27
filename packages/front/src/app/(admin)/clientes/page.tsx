import { ClientesTable } from "@/components/tables/clientes-table"
import { PageTitle } from "@/components/ui/page-title"

export default function Areas() {
    return <>
        <PageTitle title="Clientes" />
        <ClientesTable />
    </>
}