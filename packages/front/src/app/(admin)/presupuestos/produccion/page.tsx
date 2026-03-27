'use client'
import { PresupuestoProduccionTable } from "@/components/tables/presupuesto-produccion-table"
import { PageTitle } from "@/components/ui/page-title"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
export default function Page() {
    return (
        <Suspense fallback={null}>
            <PageContent />
        </Suspense>
    )
}

function PageContent() {
    const searchParams = useSearchParams()
    const trabajoId = searchParams.get('trabajoId') || ""

    return (
        <>
            <PageTitle title="Producción" />
            <PresupuestoProduccionTable trabajoId={trabajoId} activos />
        </>
    )
}
