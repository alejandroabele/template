'use client'

import UbicacionForm from "@/components/forms/ubicacion-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetUbicacionByIdQuery } from "@/hooks/ubicacion"
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading } = useGetUbicacionByIdQuery(Number(id));

    if (isLoading) return null;

    return (
        <>
            <PageTitle title="Editar ubicación" />
            <UbicacionForm data={data} />
        </>
    );
}
