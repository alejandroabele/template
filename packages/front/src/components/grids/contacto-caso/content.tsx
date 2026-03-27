"use client";
import React, { useState } from "react";
import { useGetContactoCasoByIdQuery } from "@/hooks/contacto-caso";
import Form from "@/components/forms/contacto-caso-form";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { HistorialContactos } from "@/components/features/historial-contactos";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { isFuture } from "date-fns";
import { useGetContactoProximosQuery } from "@/hooks/contacto-proximo";
import { formatTime } from "@/utils/date";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { ContactoProximoTable } from "@/components/tables/contacto-proximo-table";
import { PresupuestosCasoTable } from "@/components/tables/presupuestos-caso-table";
import { ContactoDialog } from "@/components/dialogs/contacto-dialog";
import { Plus } from "lucide-react";

interface Props {
  id: number;
}
export function Content({ id }: Props) {
  const { data, isLoading, isFetching } = useGetContactoCasoByIdQuery(id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactoDialogOpen, setIsContactoDialogOpen] = useState(false);
  const canCreatePresupuesto = hasPermission(PERMISOS.PRESUPUESTOS_CREAR);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener el tab inicial de los query params o usar 'contactos' por defecto
  const initialTab = searchParams.get("tab") || "contactos";
  const [tabValue, setTabValue] = React.useState(initialTab);

  // Obtener próximo contacto no vencido
  const { data: proximosContactos = [] } = useGetContactoProximosQuery({
    pagination: { pageIndex: 0, pageSize: 1 },
    columnFilters: [{ id: "casoId", value: id }],
    sorting: [{ id: "fecha", desc: false }],
  });

  // Filtrar solo los contactos futuros
  const proximoContacto = proximosContactos.find(
    (c) => c.fecha && isFuture(c.fecha)
  );

  // Función para manejar el cambio de tab y actualizar la URL
  const handleTabChange = (newTab: string) => {
    setTabValue(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading || isFetching) return <SkeletonChart />;
  if (!data) return <>No encontrado</>;

  return (
    <div className="space-y-6">
      {/* Header con título y botón editar */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{data.titulo}</h2>
          {data.createdAt && (
            <p className="text-sm text-muted-foreground mt-1">
              Creado el {formatTime(data.createdAt)}{" "}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsContactoDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Contacto
          </Button>
          {canCreatePresupuesto && (
            <Link href={`/presupuestos/crear?casoId=${id}`}>
              <Button size="sm" variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Crear Presupuesto
              </Button>
            </Link>
          )}
          <Button onClick={() => setIsEditDialogOpen(true)} size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
      {/* Próximo contacto destacado */}
      {proximoContacto && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-blue-900">
                  Próximo Contacto
                </h3>
                <Badge variant="default" className="bg-blue-600">
                  {proximoContacto.tipo?.nombre}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Calendar className="w-4 h-4" />
                <span>{formatTime(proximoContacto.fecha!)}</span>
              </div>
              {proximoContacto.nota && (
                <p className="text-sm text-blue-800 mt-2">
                  {proximoContacto.nota}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Información del caso - Siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del contacto */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <h3 className="text-lg font-semibold mb-4">
            Información del contacto
          </h3>
          <dl className="space-y-3">
            {
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 font-medium text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  Empresa
                </dt>
                <dd className="text-right font-medium">
                  {data?.cliente?.nombre}
                </dd>
              </div>
            }
            {
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 font-medium text-muted-foreground">
                  <User className="w-4 h-4" />
                  Contacto
                </dt>
                <dd className="text-right font-medium">
                  {data.nombreContacto}
                </dd>
              </div>
            }
            {
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 font-medium text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email
                </dt>
                <dd className="text-right">
                  <a
                    href={`mailto:${data.emailContacto}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.emailContacto}
                  </a>
                </dd>
              </div>
            }
            {
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 font-medium text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </dt>
                <dd className="text-right">
                  <a
                    href={`tel:${data.telefonoContacto}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.telefonoContacto}
                  </a>
                </dd>
              </div>
            }
          </dl>
        </div>
        {/* Notas */}
        {
          <div className="bg-secondary p-4 rounded-lg border border-neutral">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notas
            </h3>
            <p className="text-sm whitespace-pre-wrap">{data.notas}</p>
          </div>
        }
      </div>

      {/* Tabs */}
      <Tabs value={tabValue} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contactos" className="text-center flex gap-2">
            <span className="hidden sm:inline">Contactos</span>
            <Clock className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger
            value="proximos-contactos"
            className="text-center flex gap-2"
          >
            <span className="hidden sm:inline">Próximos Contactos</span>
            <Clock className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="presupuestos" className="text-center flex gap-2">
            <span className="hidden sm:inline">Presupuestos</span>
            <FileSpreadsheet className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contactos" className="mt-4">
          <HistorialContactos casoId={id} />
        </TabsContent>

        <TabsContent value="proximos-contactos" className="mt-4">
          <ContactoProximoTable casoId={id} />
        </TabsContent>

        <TabsContent value="presupuestos" className="mt-4">
          <PresupuestosCasoTable contactoCasoId={id} />
        </TabsContent>
      </Tabs>
      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar caso</DialogTitle>
          </DialogHeader>
          <Form data={data} onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog de registrar contacto */}
      <ContactoDialog
        open={isContactoDialogOpen}
        setOpen={setIsContactoDialogOpen}
        casoId={id}
      />
    </div>
  );
}
