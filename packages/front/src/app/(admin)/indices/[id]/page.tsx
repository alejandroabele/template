'use client'

import Form from "@/components/forms/indices-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetIndiceByIdQuery } from '@/hooks/indice'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetIndiceByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Indice" />
            <Form data={data} />
        </>
    );
}
