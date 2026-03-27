'use client'

import Form from "@/components/forms/comisiones-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetComisionByIdQuery } from '@/hooks/comisiones'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetComisionByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Comisión" />
            <Form data={data} />
        </>
    );
}
