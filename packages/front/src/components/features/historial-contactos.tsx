"use client";

import { useState } from "react";
import { ContactoDialog } from "@/components/dialogs/contacto-dialog";
import { useGetContactosQuery } from "@/hooks/contacto";
import { Contacto } from "@/types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { DynamicIcon } from "@/components/ui/icon";
import { formatTime } from "@/utils/date";

interface HistorialContactosProps {
  casoId: number;
}

export function HistorialContactos({ casoId }: HistorialContactosProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(
    null
  );

  const { data: contactos = [], isLoading } = useGetContactosQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [{ id: "casoId", value: casoId }],
    sorting: [{ id: "fecha", desc: true }],
  });

  const handleOpenDialog = (contacto?: Contacto) => {
    setSelectedContacto(contacto || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedContacto(null);
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="text-center text-sm text-muted-foreground py-8">
          Cargando contactos...
        </div>
      )}

      {!isLoading && contactos.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          No hay contactos registrados
        </div>
      )}

      <div className="space-y-4">
        {contactos.map((contacto: Contacto) => {
          const borderColor = contacto.tipo?.color || "#6B7280"; // gray-500 por defecto

          return (
            <div
              key={contacto.id}
              className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors relative cursor-pointer"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: borderColor,
              }}
              onClick={() => handleOpenDialog(contacto)}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
                style={{
                  backgroundColor: `${borderColor}20`,
                  color: borderColor,
                }}
              >
                <DynamicIcon name={contacto.tipo?.icono} className="w-6 h-6" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">
                        {contacto.tipo?.nombre}
                      </span>
                      {contacto.fecha && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(contacto.fecha)}
                        </span>
                      )}
                      {contacto.vendedor?.nombre && (
                        <span className="text-xs text-muted-foreground">
                          • {contacto.vendedor.nombre}
                        </span>
                      )}
                    </div>
                    {contacto.descripcion && (
                      <p className="text-sm mt-1">{contacto.descripcion}</p>
                    )}
                    {contacto.resultado && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Resultado:
                        </span>
                        <p className="text-sm">{contacto.resultado}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ContactoDialog
        open={isDialogOpen}
        setOpen={handleCloseDialog}
        casoId={casoId}
        data={selectedContacto}
      />
    </div>
  );
}
