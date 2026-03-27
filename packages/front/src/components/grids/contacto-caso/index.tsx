"use client";
import { GenericGrid } from "@/components/ui/data-grid";
import { useGetContactoCasosQuery } from "@/hooks/contacto-caso";
import { Item } from "./item";
import { Content } from "./content";
import { ContactoCasoDialog } from "@/components/dialogs/contacto-caso-dialog";
import { useState } from "react";

export function ContactoCasoGrid() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <GenericGrid
        useQuery={useGetContactoCasosQuery}
        renderCard={(item) => <Item data={item} />}
        renderContent={(item) => <Content id={item.id!} />}
        getId={(item) => item.id!}
        filterField="titulo"
        sortableFields={[
          { id: "id", label: "ID" },
          { id: "titulo", label: "Título" },
          { id: "nombreContacto", label: "Contacto" },
        ]}
        defaultSorting={[{ id: "id", desc: true }]}
        onCreate={() => setIsCreateModalOpen(true)}
      />

      <ContactoCasoDialog
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />
    </>
  );
}
