'use client'

import ProveedoresRubroForm from "@/components/forms/proveedor-rubro-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetProveedorRubroByIdQuery } from '@/hooks/proveedor-rubro'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetProveedorRubroByIdQuery(id);
    if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar Rubro" />
            <ProveedoresRubroForm data={data} />
        </>
    );
}
