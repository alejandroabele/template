'use client'

import FlotaForm from "@/components/forms/flota-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetFlotaByIdQuery } from "@/hooks/flota"
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading } = useGetFlotaByIdQuery(Number(id));

    if (isLoading) return null;

    return (
        <>
            <PageTitle title="Editar vehículo" />
            <FlotaForm data={data} />
        </>
    );
}
