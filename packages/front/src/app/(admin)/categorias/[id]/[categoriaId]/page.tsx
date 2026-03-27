'use client'

import Form from "@/components/forms/inventario-categorias-form"
import { PageTitle } from "@/components/ui/page-title"
import React from 'react'
import { useGetInventarioCategoriaByIdQuery } from '@/hooks/inventario-categoria'

export default function Page({ params }: { params: Promise<{ id: string, categoriaId: string }> }) {
    const { categoriaId } = React.use(params);
    const { data, isLoading, isFetching } = useGetInventarioCategoriaByIdQuery(parseInt(categoriaId));
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar categoria Producto" />
            <Form data={data}
            />
        </>
    );
}
