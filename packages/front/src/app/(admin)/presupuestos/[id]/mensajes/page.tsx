import ChatInbox from "@/components/messages/chat";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);
  return <>
    <ChatInbox tipoId={id} tipo={'presupuesto'} title={`Conversación del presupuesto ${id}`} />
  </>
}
