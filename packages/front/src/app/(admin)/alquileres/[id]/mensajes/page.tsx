'use client'
import ChatInbox from "@/components/messages/chat"
import React from "react"
import { useGetAlquilerByIdQuery } from '@/hooks/alquiler'

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params)
  const { data, isLoading, isFetching } = useGetAlquilerByIdQuery(id);
  if (isLoading || isFetching) return 'Cargando...'
  const recurso = data?.alquilerRecurso?.codigo || "-"
  return (
    <ChatInbox tipoId={id} tipo={"alquiler"} title={`Conversación del Alquiler ${id} - Recurso: ${recurso}
    `} />

  )
}

