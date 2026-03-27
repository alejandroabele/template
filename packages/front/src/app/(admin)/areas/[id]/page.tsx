'use client'

import AreasForm from "@/components/forms/areas-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetAreaByIdQuery } from '@/hooks/area'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetAreaByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Area" />
            <AreasForm data={data} />
        </>
    );
}
