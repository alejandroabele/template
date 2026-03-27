import Alquiler from "@/components/pages/alquiler-recurso"
import { Suspense } from 'react'
import { PageTitle } from "@/components/ui/page-title"

function PageContent() {
    return <>
        <PageTitle title="Crear recurso" />
        <Alquiler />
    </>
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PageContent />
        </Suspense>
    )
}
