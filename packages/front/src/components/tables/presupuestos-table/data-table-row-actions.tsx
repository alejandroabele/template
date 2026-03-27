import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import {
  useDeletePresupuestoMutation,
  useDownloadPresupuestosPdf,
} from "@/hooks/presupuestos";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { hasPermission } from "@/hooks/use-access";
import { PresupuestoDiseñoDialog } from "@/components/dialogs/presupuesto-diseño-dialog";
import { PresupuestoAlmacenDialog } from "@/components/dialogs/presupuesto-almacen-dialog";
import { PresupuestoFechaEntregaDialog } from "@/components/dialogs/presupuesto-fecha-entrega-dialog";
import { PresupuestoFechaFabricacionDialog } from "@/components/dialogs/presupuesto-fecha-fabricacion-dialog";
import { PresupuestoConfirmarEntregaDialog } from "@/components/dialogs/presupuesto-confirmar-entrega-dialog";
import { PresupuestoOrdenServicioDialog } from "@/components/dialogs/presupuesto-orden-servicio-dialog";
import { Presupuesto } from "@/types";
import { PresupuestoCertificacionDialog } from "@/components/dialogs/presupuesto-certificacion-dialog";
import { PERMISOS } from "@/constants/permisos";

const baseUrl = "presupuestos";
export const DataTableRowActions = ({ data }: { data: Presupuesto }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDiseño, setOpenDiseño] = React.useState(false);
  const [openAlmacen, setOpenAlmacen] = React.useState(false);
  const [openFechaDeEntrega, setOpenFechaDeEntrega] = React.useState(false);
  const [openFechaDeFabricacion, setOpenFechaDeFabricacion] =
    React.useState(false);
  const [openConfirmarEntrega, setOpenConfirmarEntrega] = React.useState(false);
  const [openOrdenServicio, setOpenOrdenServicio] = React.useState(false);
  const [openCertificacion, setOpenCertificacion] = React.useState(false);

  const { mutate } = useDeletePresupuestoMutation();
  const { mutate: mutatePdf } = useDownloadPresupuestosPdf();
  const handleWhatsappClick = (telefono: string) => {
    // Asumiendo que el número de teléfono está en `data.cliente.telefono`
    const whatsappUrl = `https://wa.me/${telefono}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <DeleteDialog
        onDelete={() => {
          mutate(data.id);
          setOpenDelete(false);
        }}
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
      />

      {openDiseño && (
        <PresupuestoDiseñoDialog
          open={openDiseño}
          setOpen={setOpenDiseño}
          id={data.id}
        />
      )}
      {openAlmacen && (
        <PresupuestoAlmacenDialog
          open={openAlmacen}
          setOpen={setOpenAlmacen}
          id={data.id}
        />
      )}
      {openFechaDeEntrega && (
        <PresupuestoFechaEntregaDialog
          open={openFechaDeEntrega}
          setOpen={setOpenFechaDeEntrega}
          id={data.id}
        />
      )}
      {openFechaDeFabricacion && (
        <PresupuestoFechaFabricacionDialog
          open={openFechaDeFabricacion}
          setOpen={setOpenFechaDeFabricacion}
          id={data.id}
        />
      )}
      {openConfirmarEntrega && (
        <PresupuestoConfirmarEntregaDialog
          open={openConfirmarEntrega}
          setOpen={setOpenConfirmarEntrega}
          id={data.id}
        />
      )}
      {openOrdenServicio && (
        <PresupuestoOrdenServicioDialog
          open={openOrdenServicio}
          setOpen={setOpenOrdenServicio}
          id={data.id}
        />
      )}
      {openCertificacion && (
        <PresupuestoCertificacionDialog
          open={openCertificacion}
          setOpen={setOpenCertificacion}
          id={data.id}
        />
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only"> Abrir menú </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones </DropdownMenuLabel>
          <Link className="" href={`/${baseUrl}/${data.id}`}>
            <DropdownMenuItem onClick={() => {}}>Ver</DropdownMenuItem>
          </Link>
          {hasPermission(PERMISOS.PRESUPUESTOS_EXPORTAR_PDF) && (
            <DropdownMenuItem
              onClick={() => mutatePdf({ id: data.id, type: "presupuesto" })}
              disabled={data?.costeoComercialEstatus !== "completo"}
            >
              Ver Presupuesto PDF
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_CARGAR_DISENO) && (
            <DropdownMenuItem onClick={() => setOpenDiseño(true)}>
              Cargar diseño
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_VERIFICAR_ALMACEN) && (
            <DropdownMenuItem
              onClick={() => setOpenAlmacen(true)}
              disabled={!!data.fechaVerificacionAlmacen}
            >
              Verificar almacen
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_APROBAR_SERVICIO) && (
            <DropdownMenuItem
              onClick={() => setOpenOrdenServicio(true)}
              disabled={!!data.fechaVerificacionServicio}
            >
              Aprobar Orden Servicio
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.JORNADA_VER) && (
            <Link className="" href={`/${baseUrl}/jornadas?presupuestoId=${data.id}`}>
              <DropdownMenuItem>Planificar</DropdownMenuItem>
            </Link>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_ACTUALIZAR_FECHA_ENTREGA) && (
            <DropdownMenuItem onClick={() => setOpenFechaDeEntrega(true)}>
              Actualizar fecha de entrega
            </DropdownMenuItem>
          )}
          {hasPermission(
            PERMISOS.PRESUPUESTOS_ACTUALIZAR_FECHA_FABRICACION
          ) && (
            <DropdownMenuItem onClick={() => setOpenFechaDeFabricacion(true)}>
              Actualizar fecha de fabricación
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_CONFIRMAR_ENTREGA) && (
            <DropdownMenuItem onClick={() => setOpenConfirmarEntrega(true)}>
              Confirmar Entrega
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_CERTIFICAR) && (
            <DropdownMenuItem onClick={() => setOpenCertificacion(true)}>
              Cargar Certificacion
            </DropdownMenuItem>
          )}
          <Link className="" href={`/${baseUrl}/${data.id}`}>
            <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
          </Link>
          <Link className="" href={`/${baseUrl}/${data.id}/mensajes`}>
            <DropdownMenuItem>Mensajes</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          {hasPermission(PERMISOS.CLIENTES_VER) && (
            <DropdownMenuItem
              onClick={() => handleWhatsappClick(data.cliente?.telefono || "")}
            >
              Hablar por WhatsApp Cliente
            </DropdownMenuItem>
          )}
          {hasPermission(PERMISOS.CLIENTES_VER) && (
            <DropdownMenuItem
              onClick={() =>
                handleWhatsappClick(data.cliente?.telefonoContacto || "")
              }
            >
              Hablar por WhatsApp Contacto
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {hasPermission(PERMISOS.PRESUPUESTO_PRODUCCION_VER) && (
            <Link href={`/presupuestos/${data.id}/produccion`} passHref>
              <DropdownMenuItem>Ver trabajos a realizar</DropdownMenuItem>
            </Link>
          )}
          {hasPermission(PERMISOS.PRESUPUESTOS_EXPORTAR_ORDEN_PDF) && (
            <DropdownMenuItem
              onClick={() => mutatePdf({ id: data.id, type: "orden" })}
              disabled={data?.costeoEstatus !== "completo"}
            >
              Ver orden de trabajo PDF
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          {hasPermission(PERMISOS.PRESUPUESTOS_ELIMINAR) && (
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              Eliminar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
