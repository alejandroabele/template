'use client'
import Presupuesto from "@/components/forms/presupuesto-form"
import { PageTitle } from "@/components/ui/page-title"
import { useGetPresupuestoByIdQuery } from '@/hooks/presupuestos'
import { useCreatePresupuestoLeidoMutation } from '@/hooks/presupuesto-leido'
import React from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading, isFetching } = useGetPresupuestoByIdQuery(id);
    const { mutateAsync } = useCreatePresupuestoLeidoMutation()

    React.useEffect(() => {
        if (data?.id && !data?.presupuestoLeido) {
            mutateAsync({ presupuestoId: Number(data.id) });
        }
    }, [data]);
    if (isLoading || isFetching) return <>Cargando...</>
    return <>
        <PageTitle title={"Presupuesto #" + id} />
        <Presupuesto data={data} />
    </>
}



