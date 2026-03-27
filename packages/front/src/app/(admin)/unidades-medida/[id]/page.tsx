'use client'

import AreasForm from "@/components/forms/unidades-medida-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetUnidadMedidaByIdQuery } from '@/hooks/unidad-medida'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetUnidadMedidaByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Unidad de Medida" />
            <AreasForm data={data} />
        </>
    );
}
