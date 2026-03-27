import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteDatoMutation } from "@/hooks/datos";
import { useEditPresupuestoProduccionMutation } from "@/hooks/presupuesto-produccion";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  PlayCircle,
  Trash2,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import React from "react";
import { PresupuestoProduccion } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CellColumn } from "@/components/ui/cell-column";
import { formatDate, today } from "@/utils/date";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const baseUrl = "presupuestos";

const DataTableRowActions = ({ data }: { data: PresupuestoProduccion }) => {
  const { mutate, isPending } = useDeleteDatoMutation();
  const { toast } = useToast();

  return (
    <TooltipProvider>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <Link href={`/${baseUrl}/${data.presupuestoId}`} className="w-full">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver presupuesto
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export const columns: ColumnDef<PresupuestoProduccion>[] = [
  {
    id: "acciones",
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  },
  {
    accessorKey: "presupuestoId",
    header: "N°",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <CellColumn>
        <Badge variant="outline" className="font-mono px-2 py-0.5">
          {row.original.presupuestoId}
        </Badge>
      </CellColumn>
    ),
  },
  {
    accessorKey: "trabajo.nombre",
    header: () => (
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        <span>Trabajo</span>
      </div>
    ),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <CellColumn className="flex gap-2 items-center">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 border"
          style={{ backgroundColor: row.original.trabajo?.color || "#e2e8f0" }}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium truncate max-w-[180px]">
                {row.original.trabajo?.nombre || "Sin asignar"}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {row.original.trabajo?.nombre || "Sin asignar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CellColumn>
    ),
  },
  {
    accessorKey: "presupuesto.descripcionCorta",
    header: "Descripcion",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <CellColumn>{row.original.presupuesto?.descripcionCorta}</CellColumn>
    ),
  },
  {
    accessorKey: "presupuesto.cliente.nombre",
    header: () => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>Cliente</span>
      </div>
    ),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <CellColumn>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate max-w-[180px] block">
                {row.original.presupuesto?.cliente?.nombre || "Sin cliente"}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {row.original.presupuesto?.cliente?.nombre || "Sin cliente"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CellColumn>
    ),
  },
  {
    id: "progreso",
    accessorKey: "progreso",
    header: "Progreso",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const progreso = row.original.presupuesto?.progreso || 0;

      // Determine color based on progress
      let progressColor = "#f59e0b"; // Default amber
      if (progreso === 100) {
        progressColor = "#10b981"; // Green for completed
      } else if (progreso < 25) {
        progressColor = "#ef4444"; // Red for low progress
      }

      return (
        <CellColumn className="w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Progress
                    value={progreso}
                    max={100}
                    className="h-2.5 w-[100px]"
                    style={
                      {
                        backgroundColor: "#e2e8f0",
                        "--progress-background": progressColor,
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-xs font-medium">{progreso}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {progreso === 0
                  ? "Sin progreso"
                  : progreso === 100
                    ? "Completado"
                    : `${progreso}% completado`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const { mutateAsync: edit, isPending } =
        useEditPresupuestoProduccionMutation();
      const { toast } = useToast();

      const handleAction = async () => {
        if (
          row.original.trabajo?.tipo === "producto" &&
          !row.original.presupuesto?.fechaVerificacionAlmacen
        ) {
          toast({
            title: "Error",
            description:
              "No se pudo iniciar el trabajo, ya que no fue verificado por almacen",
          });
          return;
        }
        if (
          row.original.trabajo?.tipo === "servicio" &&
          !row.original.presupuesto?.fechaVerificacionServicio
        ) {
          toast({
            title: "Error",
            description:
              "No se pudo iniciar el trabajo, ya que no fue verificado por el encargado de servicio",
          });
          return;
        }
        try {
          const isStarting = !row.original.iniciado && !row.original.terminado;
          const isFinishing = row.original.iniciado && !row.original.terminado;
          if (row.original.id) {
            const updateData: any = {
              trabajoId: row.original.trabajoId,
              presupuestoId: row.original.presupuestoId,
            };

            if (isStarting) {
              updateData.iniciado = 1;
              if (!row.original.fechaIniciado) {
                updateData.fechaIniciado = today();
              }
            } else if (isFinishing) {
              updateData.terminado = 1;
              if (!row.original.fechaTerminado) {
                updateData.fechaTerminado = today();
              }
            }

            await edit({
              id: row.original.id,
              data: updateData,
            });
          }

          toast({
            title: "Estado actualizado",
            variant: "success",
            description: isStarting
              ? "Producción iniciada correctamente"
              : "Producción finalizada correctamente",
          });
        } catch (error: any) {
          toast({
            title: "Error",
            description: error?.message || "No se pudo actualizar el estado",
          });
        }
      };

      if (row.original.terminado) {
        return (
          <CellColumn>
            <Badge variant="success" className="gap-1 ">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Finalizado</span>
            </Badge>
          </CellColumn>
        );
      }

      if (row.original.iniciado) {
        return (
          <CellColumn>
            <Button
              size="sm"
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 gap-1.5 px-3"
              onClick={handleAction}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Procesando</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Finalizar</span>
                </>
              )}
            </Button>
          </CellColumn>
        );
      }

      return (
        <CellColumn>
          <Button
            size="sm"
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 gap-1.5 px-3"
            onClick={handleAction}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Procesando</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-3.5 w-3.5" />
                <span>Iniciar</span>
              </>
            )}
          </Button>
        </CellColumn>
      );
    },
  },
  {
    accessorKey: "fechas",
    header: () => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>Fechas</span>
      </div>
    ),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const fechaInicio = formatDate(row.original.fechaIniciado);
      const fechaFin = formatDate(row.original.fechaTerminado);

      return (
        <CellColumn>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span
                className={
                  !fechaInicio
                    ? "text-muted-foreground italic text-xs"
                    : "text-xs"
                }
              >
                {fechaInicio || "No iniciado"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              <span
                className={
                  !fechaFin ? "text-muted-foreground italic text-xs" : "text-xs"
                }
              >
                {fechaFin || "No finalizado"}
              </span>
            </div>
          </div>
        </CellColumn>
      );
    },
  },
];
