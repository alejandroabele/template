'use client'

import Form from "@/components/forms/categorias-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetCategoriaByIdQuery } from '@/hooks/categorias'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetCategoriaByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Familia Producto" />
            <Form data={data} />
        </>
    );
}
