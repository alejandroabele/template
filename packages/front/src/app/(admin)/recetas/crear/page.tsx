import RecetasForm from "@/components/forms/recetas-form"
import { PageTitle } from "@/components/ui/page-title"

export default function page() {
    return <>
        <PageTitle title="Crear Receta" />
        <RecetasForm />
    </>
}