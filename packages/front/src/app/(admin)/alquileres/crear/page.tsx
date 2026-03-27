import Alquiler from "@/components/pages/alquiler"
import { PageTitle } from "@/components/ui/page-title"
import { Suspense } from 'react'

function PageContent() {
    return <>
        <PageTitle title="Crear Alquiler" />
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
