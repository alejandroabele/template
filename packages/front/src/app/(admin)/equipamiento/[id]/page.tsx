'use client'

import EquipamientoForm from "@/components/forms/equipamiento-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetEquipamientoByIdQuery } from "@/hooks/equipamiento"
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading } = useGetEquipamientoByIdQuery(Number(id));

    if (isLoading) return null;

    return (
        <>
            <PageTitle title="Editar equipamiento" />
            <EquipamientoForm data={data} />
        </>
    );
}
