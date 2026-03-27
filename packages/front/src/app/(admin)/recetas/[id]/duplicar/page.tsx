'use client'

import RecetasForm from "@/components/forms/recetas-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetRecetaByIdQuery } from '@/hooks/receta'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetRecetaByIdQuery(parseInt(id));
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Duplicar Receta" />
            <RecetasForm data={data} duplicar />
        </>
    );
}
