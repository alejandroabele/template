'use client'

import TrailerForm from "@/components/forms/trailer-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetTrailerByIdQuery } from '@/hooks/trailer'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetTrailerByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Trailer" />
            <TrailerForm data={data} />
        </>
    );
}
