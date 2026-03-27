'use client'

// import Form from "@/components/forms/alquiler-recurso-form"
import { PageTitle } from "@/components/ui/page-title"
import Alquiler from "@/components/pages/alquiler-recurso"
import React from 'react'


export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    // const { data, isLoading, isFetching } = useGetAlquilerRecursoByIdQuery(id);
    // if (isLoading || isFetching) return <>Cargando...</>
    return (
        <>
            <PageTitle title="Editar recurso" />
            <Alquiler id={id} />
        </>
    );
}
