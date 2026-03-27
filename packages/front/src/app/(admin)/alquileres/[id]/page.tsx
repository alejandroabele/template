'use client'

import Alquileres from "@/components/pages/alquiler"
import { PageTitle } from "@/components/ui/page-title"
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    return (
        <>
            <PageTitle title="Editar Alquiler" />
            <Alquileres id={id} />
        </>
    );
}
