'use client'
import ChatInbox from "@/components/messages/chat"
import React from "react"
import { useGetSolcomByIdQuery } from '@/hooks/solcom'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { data, isLoading, isFetching } = useGetSolcomByIdQuery(Number(id));
  if (isLoading || isFetching) return 'Cargando...'
  return (
    <ChatInbox
      tipoId={Number(id)}
      tipo={"solcom"}
      title={`Conversación de la Solicitud de Compra ${id}`}
    />
  )
}
