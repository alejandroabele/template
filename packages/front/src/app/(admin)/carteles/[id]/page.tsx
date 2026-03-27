'use client'

import CartelForm from "@/components/forms/cartel-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetCartelByIdQuery } from '@/hooks/cartel'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetCartelByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Cartel" />
            <CartelForm data={data} />
        </>
    );
}
