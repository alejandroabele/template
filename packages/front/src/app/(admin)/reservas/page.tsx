import { ReservasTable } from "@/components/tables/reservas-table";
import { PageTitle } from "@/components/ui/page-title";

export default function ReservasPage() {
    return (
        <>
            <PageTitle title="Reservas de Inventario" />
            <ReservasTable />
        </>
    );
}
