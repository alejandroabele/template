import Presupuesto from "@/components/forms/presupuesto-form"
import { PageTitle } from "@/components/ui/page-title"
import { Suspense } from 'react'

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PageContent />
        </Suspense>
    )
}
function PageContent() {
    return <>
        <PageTitle title="Crear Presupuesto" />
        <Presupuesto />
    </>
}
