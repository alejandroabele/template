import CentroCostoForm from "@/components/forms/centro-costo-form";
import { PageTitle } from "@/components/ui/page-title";

export default function CreateCentroCostoPage() {
    return (
        <>
            <PageTitle title="Crear Centro de Costo" />
            <CentroCostoForm />
        </>
    );
}
