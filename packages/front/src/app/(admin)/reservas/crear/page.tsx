import ReservaForm from "@/components/forms/reserva-form";
import { PageTitle } from "@/components/ui/page-title";

export default function CrearReservaPage() {
    return (
        <>
            <PageTitle title="Nueva Reserva" />
            <ReservaForm />
        </>
    );
}
