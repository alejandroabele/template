'use client'

import Form from "@/components/forms/inventario-subcategorias-form"
import { PageTitle } from "@/components/ui/page-title"
import React from 'react'
import { useGetInventarioSubcategoriaByIdQuery } from '@/hooks/inventario-subcategoria'

export default function Page({ params }: { params: Promise<{ id: string, subcategoriaId: string }> }) {
    const { subcategoriaId } = React.use(params);
    const { data, isLoading, isFetching } = useGetInventarioSubcategoriaByIdQuery(parseInt(subcategoriaId));
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Subcategoría" />
            <Form data={data} />
        </>
    );
}
