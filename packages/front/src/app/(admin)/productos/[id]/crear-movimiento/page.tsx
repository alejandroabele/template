'use client'

import Form from "@/components/forms/movimiento-inventario-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetInventarioByIdQuery } from '@/hooks/inventario'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetInventarioByIdQuery(id)

    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Registrar Movimiento" />
            <Form data={data} />
        </>
    );
}
