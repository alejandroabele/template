"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  useCreateJornadaMutation,
  useEditJornadaMutation,
  useDeleteJornadaMutation,
} from "@/hooks/jornada";
import { Equipamiento, Jornada } from "@/types";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
import { PresupuestoSelector } from "@/components/selectors/presupuesto-selector";
import { ProduccionTrabajoSelector } from "@/components/selectors/produccion-trabajo-selector";
import { PersonaSelector } from "@/components/selectors/persona-selector";
import {
  ExternalLink,
  Plus,
  X,
  User,
  Calendar as CalendarIcon,
  Users,
  Trash2,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { format, eachDayOfInterval } from "date-fns";
import { DatePicker } from "@/components/form-helpers/date-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import { CancelarJornadaDialog } from "@/components/dialogs/cancelar-jornada-dialog";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useGetPersonasQuery } from "@/hooks/persona";
import { FlotaSelector } from "@/components/selectors/flota-selector";
import { useGetFlotasQuery } from "@/hooks/flota";
import { EquipamientoSelector } from "@/components/selectors/equipamiento-selector";
import { useGetEquipamientosQuery } from "@/hooks/equipamiento";

// ============= SCHEMAS =============

const flotaAsignacionSchema = z.object({
  flotaId: z.number(),
  personaResponsableId: z.number().optional(),
});

const equipamientoAsignacionSchema = z.object({
  equipamientoId: z.number(),
  personaResponsableId: z.number().optional(),
});

const personaTrabajoSchema = z.object({
  personaId: z.number(),
  produccionTrabajoId: z.number().optional(),
});

const jornadaSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  presupuestoId: z.number().optional(),
  tipo: z.enum(["producto", "servicio", "mantenimiento"]).optional(),
  personasTrabajos: z.array(personaTrabajoSchema).optional(),
  flotas: z.array(flotaAsignacionSchema).optional(),
  equipamientos: z.array(equipamientoAsignacionSchema).optional(),
  detalle: z.string().optional(),
  anotaciones: z.string().optional(),
});

const planificacionSchema = z.object({
  rangoFechas: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Debe seleccionar un rango de fechas",
    }),
  tipo: z.enum(["producto", "servicio", "mantenimiento"]),
  presupuestoId: z.number().optional(),
  personasTrabajos: z.array(personaTrabajoSchema).optional(),
  flotas: z.array(flotaAsignacionSchema).optional(),
  equipamientos: z.array(equipamientoAsignacionSchema).optional(),
  detalle: z.string().optional(),
  anotaciones: z.string().optional(),
});

type JornadaFormValues = z.infer<typeof jornadaSchema>;
type PlanificacionFormValues = z.infer<typeof planificacionSchema>;

// ============= COMPONENTES COMPARTIDOS =============

const PersonaAvatar = () => {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
      <User className="h-4 w-4 text-primary" />
    </div>
  );
};

interface PersonasSectionProps {
  personasTrabajos: Array<{ personaId: number; produccionTrabajoId?: number }>;
  personaSeleccionada: number | undefined;
  setPersonaSeleccionada: (personaId: number | undefined) => void;
  agregarPersona: () => void;
  removePersona: (id: number) => void;
  setTrabajoPersona: (personaId: number, trabajoId: number | undefined) => void;
  canEditar: boolean;
  cancelado?: number;
  tipo?: string; // Tipo de planificación para filtrar trabajos
}

const PersonasSection = ({
  personasTrabajos,
  personaSeleccionada,
  setPersonaSeleccionada,
  agregarPersona,
  removePersona,
  setTrabajoPersona,
  canEditar,
  cancelado,
  tipo,
}: PersonasSectionProps) => {
  const { data: todasPersonas = [] } = useGetPersonasQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [{ id: "nombre", desc: false }],
    globalFilter: "",
  });

  const personasIds = personasTrabajos.map((pt) => pt.personaId);
  const personasSeleccionadas = todasPersonas.filter((p) =>
    personasIds.includes(p.id!)
  );

  const showControls = canEditar && cancelado !== 1;

  return (
    <div className="space-y-3">
      <FormLabel>Personas Asignadas</FormLabel>

      {showControls && (
        <div className="flex gap-2">
          <div className="flex-1">
            <PersonaSelector
              value={personaSeleccionada}
              onValueChange={setPersonaSeleccionada}
              placeholder="Seleccionar persona..."
            />
          </div>
          <Button
            type="button"
            onClick={agregarPersona}
            disabled={!personaSeleccionada}
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      )}

      {personasSeleccionadas.length > 0 ? (
        <div className="space-y-2">
          {personasSeleccionadas.map((persona) => {
            const personaTrabajo = personasTrabajos.find(
              (pt) => pt.personaId === persona.id
            );

            return (
              <div
                key={persona.id}
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group"
              >
                <PersonaAvatar />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {persona.nombre} {persona.apellido}
                  </p>
                </div>

                {/* Selector de trabajo compacto */}
                {showControls && (
                  <div className="w-48">
                    <ProduccionTrabajoSelector
                      value={
                        personaTrabajo?.produccionTrabajoId
                          ? String(personaTrabajo.produccionTrabajoId)
                          : ""
                      }
                      compact
                      tipo={tipo}
                      onChange={(value) =>
                        setTrabajoPersona(
                          persona.id!,
                          value ? Number(value) : undefined
                        )
                      }
                    />
                  </div>
                )}

                {/* Mostrar trabajo en modo solo lectura */}
                {!showControls && personaTrabajo?.produccionTrabajoId && (
                  <div className="text-xs text-muted-foreground px-2">
                    Trabajo: {personaTrabajo.produccionTrabajoId}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    href={`/personas/${persona.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  {showControls && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removePersona(persona.id!)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          No hay personas asignadas
        </div>
      )}
    </div>
  );
};

// ============= SECCIÓN DE FLOTA =============

interface FlotaSectionProps {
  flotas: Array<{
    flotaId: number;
    personaResponsableId?: number;
  }>;
  flotaSeleccionada: number | undefined;
  setFlotaSeleccionada: (flotaId: number | undefined) => void;
  agregarFlota: () => void;
  removeFlota: (id: number) => void;
  setPersonaResponsable: (
    flotaId: number,
    personaId: number | undefined
  ) => void;
  canEditar: boolean;
  cancelado?: number;
  personasIds: number[];
}

const FlotaSection = ({
  flotas,
  flotaSeleccionada,
  setFlotaSeleccionada,
  agregarFlota,
  removeFlota,
  setPersonaResponsable,
  canEditar,
  cancelado,
  personasIds,
}: FlotaSectionProps) => {
  const { data: todaFlota = [] } = useGetFlotasQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [],
    globalFilter: "",
  });

  const { data: todasPersonas = [] } = useGetPersonasQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [{ id: "nombre", desc: false }],
    globalFilter: "",
  });

  // Filtrar solo las personas que están asignadas a esta jornada
  const personasDisponibles = todasPersonas.filter((p) =>
    personasIds.includes(p.id!)
  );

  const flotasAsignadas = todaFlota
    .map((e) => {
      const asignacion = flotas.find((f) => f.flotaId === e.id);
      if (!asignacion) return null;

      const personaResponsable = asignacion.personaResponsableId
        ? todasPersonas.find((p) => p.id === asignacion.personaResponsableId)
        : undefined;

      return {
        ...e,
        personaResponsableId: asignacion.personaResponsableId,
        personaResponsable,
      };
    })
    .filter((e) => e !== null);

  const showControls = canEditar && cancelado !== 1;

  return (
    <div className="space-y-3">
      <FormLabel>Flota Asignada</FormLabel>

      {showControls && (
        <div className="flex gap-2">
          <div className="flex-1">
            <FlotaSelector
              value={flotaSeleccionada}
              onValueChange={setFlotaSeleccionada}
              placeholder="Seleccionar vehículo..."
            />
          </div>
          <Button
            type="button"
            onClick={agregarFlota}
            disabled={!flotaSeleccionada}
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      )}

      {flotasAsignadas.length > 0 ? (
        <div className="space-y-2">
          {flotasAsignadas.map((vehiculo) => (
            <div
              key={vehiculo.id}
              className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <Wrench className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {vehiculo.recurso?.codigo}
                  {vehiculo.patente && (
                    <span className="text-primary font-semibold ml-1.5">
                      [{vehiculo.patente}]
                    </span>
                  )}
                </p>
                {vehiculo.tipo && (
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {vehiculo.tipo}
                  </p>
                )}
              </div>

              {/* Selector de persona responsable compacto */}
              {showControls && personasDisponibles.length > 0 && (
                <div className="w-48">
                  <Select
                    value={
                      vehiculo.personaResponsableId?.toString() ||
                      "sin-responsable"
                    }
                    onValueChange={(value) =>
                      setPersonaResponsable(
                        vehiculo.id!,
                        value === "sin-responsable" ? undefined : Number(value)
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Sin responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-responsable">
                        Sin responsable
                      </SelectItem>
                      {personasDisponibles.map((persona) => (
                        <SelectItem
                          key={persona.id}
                          value={persona.id!.toString()}
                        >
                          {persona.nombre} {persona.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Mostrar responsable en modo solo lectura */}
              {!showControls && vehiculo.personaResponsable && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>
                    {vehiculo.personaResponsable.nombre}{" "}
                    {vehiculo.personaResponsable.apellido}
                  </span>
                </div>
              )}

              {showControls && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFlota(vehiculo.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          No hay vehículos asignados
        </div>
      )}
    </div>
  );
};

// ============= SECCIÓN DE EQUIPAMIENTO =============

interface EquipamientosSectionProps {
  equipamientos: Array<{
    equipamientoId: number;
    personaResponsableId?: number;
  }>;
  equipamientoSeleccionado: Equipamiento | undefined;
  setEquipamientoSeleccionado: (equipamiento: Equipamiento | undefined) => void;
  agregarEquipamiento: () => void;
  removeEquipamiento: (id: number) => void;
  setPersonaResponsableEquipamiento: (
    equipamientoId: number,
    personaId: number | undefined
  ) => void;
  canEditar: boolean;
  cancelado?: number;
  personasIds: number[];
}

const EquipamientosSection = ({
  equipamientos,
  equipamientoSeleccionado,
  setEquipamientoSeleccionado,
  agregarEquipamiento,
  removeEquipamiento,
  setPersonaResponsableEquipamiento,
  canEditar,
  cancelado,
  personasIds,
}: EquipamientosSectionProps) => {
  const { data: todosEquipamientos = [] } = useGetEquipamientosQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [],
    globalFilter: "",
  });

  const { data: todasPersonas = [] } = useGetPersonasQuery({
    pagination: { pageIndex: 0, pageSize: 100 },
    columnFilters: [],
    sorting: [{ id: "nombre", desc: false }],
    globalFilter: "",
  });

  const personasDisponibles = todasPersonas.filter((p) =>
    personasIds.includes(p.id!)
  );

  const equipamientosAsignados = todosEquipamientos
    .map((e) => {
      const asignacion = equipamientos.find((eq) => eq.equipamientoId === e.id);
      if (!asignacion) return null;

      const personaResponsable = asignacion.personaResponsableId
        ? todasPersonas.find((p) => p.id === asignacion.personaResponsableId)
        : undefined;

      return {
        ...e,
        personaResponsableId: asignacion.personaResponsableId,
        personaResponsable,
      };
    })
    .filter((e) => e !== null);

  const showControls = canEditar && cancelado !== 1;

  return (
    <div className="space-y-3">
      <FormLabel>Equipamiento Asignado</FormLabel>

      {showControls && (
        <div className="flex gap-2">
          <div className="flex-1">
            <EquipamientoSelector
              value={equipamientoSeleccionado}
              onChange={setEquipamientoSeleccionado}
              placeholder="Seleccionar equipamiento..."
            />
          </div>
          <Button
            type="button"
            onClick={agregarEquipamiento}
            disabled={!equipamientoSeleccionado}
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      )}

      {equipamientosAsignados.length > 0 ? (
        <div className="space-y-2">
          {equipamientosAsignados.map((equip) => (
            <div
              key={equip.id}
              className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <Wrench className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  <span className="text-primary font-semibold mr-1.5">[{equip.recurso?.codigo}]</span>
                  {equip.nombre}
                </p>
                {equip.modelo && (
                  <p className="text-xs text-muted-foreground truncate">
                    {equip.modelo}
                  </p>
                )}
              </div>

              {showControls && personasDisponibles.length > 0 && (
                <div className="w-48">
                  <Select
                    value={equip.personaResponsableId?.toString() || "sin-responsable"}
                    onValueChange={(value) =>
                      setPersonaResponsableEquipamiento(
                        equip.id!,
                        value === "sin-responsable" ? undefined : Number(value)
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Sin responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-responsable">Sin responsable</SelectItem>
                      {personasDisponibles.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id!.toString()}>
                          {persona.nombre} {persona.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!showControls && equip.personaResponsable && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>
                    {equip.personaResponsable.nombre}{" "}
                    {equip.personaResponsable.apellido}
                  </span>
                </div>
              )}

              {showControls && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeEquipamiento(equip.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          No hay equipamiento asignado
        </div>
      )}
    </div>
  );
};

// ============= COMPONENTE TIPO JORNADA SELECTOR =============

interface TipoJornadaSelectorProps {
  control: any;
  label?: string;
  name: string;
  idPrefix: string;
}

const TipoJornadaSelector = ({
  control,
  label = "Tipo",
  name,
  idPrefix,
}: TipoJornadaSelectorProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid grid-cols-3 gap-4"
            >
              <FormItem>
                <FormControl>
                  <Field orientation="horizontal">
                    <RadioGroupItem
                      value="producto"
                      id={`${idPrefix}-producto`}
                    />
                    <FieldLabel htmlFor={`${idPrefix}-producto`}>
                      <FieldContent>
                        <FieldTitle>Producto</FieldTitle>
                        <FieldDescription>
                          Trabajos de fabricación de productos
                        </FieldDescription>
                      </FieldContent>
                    </FieldLabel>
                  </Field>
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <Field orientation="horizontal">
                    <RadioGroupItem
                      value="servicio"
                      id={`${idPrefix}-servicio`}
                    />
                    <FieldLabel htmlFor={`${idPrefix}-servicio`}>
                      <FieldContent>
                        <FieldTitle>Servicio</FieldTitle>
                        <FieldDescription>
                          Trabajos de prestación de servicios
                        </FieldDescription>
                      </FieldContent>
                    </FieldLabel>
                  </Field>
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <Field orientation="horizontal">
                    <RadioGroupItem
                      value="mantenimiento"
                      id={`${idPrefix}-mantenimiento`}
                    />
                    <FieldLabel htmlFor={`${idPrefix}-mantenimiento`}>
                      <FieldContent>
                        <FieldTitle>Mantenimiento</FieldTitle>
                        <FieldDescription>
                          Trabajos de mantenimiento
                        </FieldDescription>
                      </FieldContent>
                    </FieldLabel>
                  </Field>
                </FormControl>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// ============= HOOK COMPARTIDO PARA PERSONAS =============

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePersonasManagement = (form: any) => {
  const [personaSeleccionada, setPersonaSeleccionada] = useState<
    number | undefined
  >();

  const agregarPersona = () => {
    if (!personaSeleccionada) return;
    const current = form.getValues("personasTrabajos") || [];
    if (!current.some((pt: any) => pt.personaId === personaSeleccionada)) {
      form.setValue("personasTrabajos", [
        ...current,
        { personaId: personaSeleccionada, produccionTrabajoId: undefined },
      ]);
    }
    setPersonaSeleccionada(undefined);
  };

  const removePersona = (personaId: number) => {
    const current = form.getValues("personasTrabajos") || [];
    form.setValue(
      "personasTrabajos",
      current.filter((pt: any) => pt.personaId !== personaId)
    );
  };

  const setTrabajoPersona = (
    personaId: number,
    trabajoId: number | undefined
  ) => {
    const current = form.getValues("personasTrabajos") || [];
    form.setValue(
      "personasTrabajos",
      current.map((pt: any) =>
        pt.personaId === personaId
          ? { ...pt, produccionTrabajoId: trabajoId }
          : pt
      )
    );
  };

  return {
    personaSeleccionada,
    setPersonaSeleccionada,
    agregarPersona,
    removePersona,
    setTrabajoPersona,
  };
};

// ============= HOOK COMPARTIDO PARA FLOTA =============

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFlotaManagement = (form: any) => {
  const [flotaSeleccionada, setFlotaSeleccionada] = useState<number | undefined>();

  const agregarFlota = () => {
    if (!flotaSeleccionada) return;
    const current = form.getValues("flotas") || [];
    if (!current.some((e: any) => e.flotaId === flotaSeleccionada)) {
      form.setValue("flotas", [
        ...current,
        { flotaId: flotaSeleccionada, personaResponsableId: undefined },
      ]);
    }
    setFlotaSeleccionada(undefined);
  };

  const removeFlota = (flotaId: number) => {
    const current = form.getValues("flotas") || [];
    form.setValue("flotas", current.filter((e: any) => e.flotaId !== flotaId));
  };

  const setPersonaResponsable = (flotaId: number, personaId: number | undefined) => {
    const current = form.getValues("flotas") || [];
    form.setValue(
      "flotas",
      current.map((e: any) =>
        e.flotaId === flotaId ? { ...e, personaResponsableId: personaId } : e
      )
    );
  };

  return { flotaSeleccionada, setFlotaSeleccionada, agregarFlota, removeFlota, setPersonaResponsable };
};

// ============= HOOK COMPARTIDO PARA EQUIPAMIENTO =============

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useEquipamientosManagement = (form: any) => {
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<Equipamiento | undefined>();

  const agregarEquipamiento = () => {
    if (!equipamientoSeleccionado?.id) return;
    const current = form.getValues("equipamientos") || [];
    if (!current.some((e: any) => e.equipamientoId === equipamientoSeleccionado.id)) {
      form.setValue("equipamientos", [
        ...current,
        { equipamientoId: equipamientoSeleccionado.id, personaResponsableId: undefined },
      ]);
    }
    setEquipamientoSeleccionado(undefined);
  };

  const removeEquipamiento = (equipamientoId: number) => {
    const current = form.getValues("equipamientos") || [];
    form.setValue("equipamientos", current.filter((e: any) => e.equipamientoId !== equipamientoId));
  };

  const setPersonaResponsableEquipamiento = (equipamientoId: number, personaId: number | undefined) => {
    const current = form.getValues("equipamientos") || [];
    form.setValue(
      "equipamientos",
      current.map((e: any) =>
        e.equipamientoId === equipamientoId ? { ...e, personaResponsableId: personaId } : e
      )
    );
  };

  return { equipamientoSeleccionado, setEquipamientoSeleccionado, agregarEquipamiento, removeEquipamiento, setPersonaResponsableEquipamiento };
};

// ============= JORNADA FORM (UNA SOLA JORNADA) =============

interface JornadaFormProps {
  jornada?: Jornada;
  onSuccess?: () => void;
  presupuestoId?: number;
  selectedDate?: Date;
}

const JornadaForm = ({
  jornada,
  onSuccess,
  presupuestoId,
  selectedDate,
}: JornadaFormProps) => {
  const { toast } = useToast();
  const canEditar = hasPermission(PERMISOS.JORNADA_EDITAR);
  const canEliminar = hasPermission(PERMISOS.JORNADA_ELIMINAR);
  const [showCancelarDialog, setShowCancelarDialog] = React.useState(false);

  const createMutation = useCreateJornadaMutation();
  const editMutation = useEditJornadaMutation();
  const deleteMutation = useDeleteJornadaMutation();

  const defaultValues: JornadaFormValues = {
    fecha:
      jornada?.fecha ||
      (selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""),
    presupuestoId: jornada?.presupuestoId || presupuestoId,
    tipo: jornada?.tipo || "producto",
    personasTrabajos:
      jornada?.jornadaPersonas?.map((jp) => ({
        personaId: jp.personaId!,
        produccionTrabajoId: jp.produccionTrabajoId,
      })) || [],
    flotas:
      jornada?.jornadaFlotas?.map((je) => ({
        flotaId: je.flotaId!,
        personaResponsableId: je.personaResponsableId,
      })) || [],
    equipamientos:
      jornada?.jornadaEquipamientos?.map((je) => ({
        equipamientoId: je.equipamientoId!,
        personaResponsableId: je.personaResponsableId,
      })) || [],
    detalle: jornada?.detalle || "",
    anotaciones: jornada?.anotaciones || "",
  };

  const form = useForm<JornadaFormValues>({
    resolver: zodResolver(jornadaSchema),
    defaultValues,
  });

  const personasTrabajos = form.watch("personasTrabajos") || [];
  const flotas = form.watch("flotas") || [];
  const equipamientos = form.watch("equipamientos") || [];
  const tipo = form.watch("tipo");
  const personasManagement = usePersonasManagement(form);
  const flotaManagement = useFlotaManagement(form);
  const equipamientosManagement = useEquipamientosManagement(form);
  const personasIds = personasTrabajos.map((pt) => pt.personaId);

  const onSubmit = async (data: JornadaFormValues) => {
    try {
      if (jornada?.id) {
        await editMutation.mutateAsync({ id: jornada.id, data });
        toast({
          description: "Jornada actualizada exitosamente",
        });
      } else {
        await createMutation.mutateAsync(data);
        toast({
          description: "Jornada creada exitosamente",
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error al guardar jornada:", error);
      toast({
        description: "Error al guardar la jornada",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!jornada?.id) return;

    if (!confirm("¿Estás seguro de que deseas eliminar esta jornada?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(jornada.id);
      toast({
        description: "Jornada eliminada exitosamente",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error al eliminar jornada:", error);
      toast({
        description: "Error al eliminar la jornada",
        variant: "destructive",
      });
    }
  };

  const isLoading =
    createMutation.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner de cancelación */}
          {jornada?.cancelado === 1 && (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-destructive">
                  Jornada Cancelada
                </p>
                {jornada.motivoCancelacion && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Motivo: {jornada.motivoCancelacion}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Fecha */}
          <DatePicker
            label="Fecha *"
            form={form}
            name="fecha"
            fromYear={2026}
          />

          {/* Presupuesto */}
          <FormField
            control={form.control}
            name="presupuestoId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Presupuesto (OT)</FormLabel>
                  {field.value && (
                    <Link
                      href={`/presupuestos/${field.value}`}
                      target="_blank"
                      className="text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
                <FormControl>
                  <PresupuestoSelector
                    selectedResult={
                      field.value
                        ? {
                            id: field.value,
                            descripcionCorta: `#${field.value}`,
                          }
                        : undefined
                    }
                    onSelectResult={(result) => field.onChange(result.id)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de Jornada */}
          <TipoJornadaSelector
            control={form.control}
            name="tipo"
            label="Tipo de Jornada"
            idPrefix="jornada"
          />

          <Separator />

          {/* Sección de Personas */}
          <PersonasSection
            personasTrabajos={personasTrabajos}
            personaSeleccionada={personasManagement.personaSeleccionada}
            setPersonaSeleccionada={personasManagement.setPersonaSeleccionada}
            agregarPersona={personasManagement.agregarPersona}
            removePersona={personasManagement.removePersona}
            setTrabajoPersona={personasManagement.setTrabajoPersona}
            canEditar={canEditar}
            cancelado={jornada?.cancelado}
            tipo={tipo}
          />

          <Separator />

          {/* Sección de Flota */}
          <FlotaSection
            flotas={flotas}
            flotaSeleccionada={flotaManagement.flotaSeleccionada}
            setFlotaSeleccionada={flotaManagement.setFlotaSeleccionada}
            agregarFlota={flotaManagement.agregarFlota}
            removeFlota={flotaManagement.removeFlota}
            setPersonaResponsable={flotaManagement.setPersonaResponsable}
            canEditar={canEditar}
            cancelado={jornada?.cancelado}
            personasIds={personasIds}
          />

          <Separator />

          {/* Sección de Equipamiento */}
          <EquipamientosSection
            equipamientos={equipamientos}
            equipamientoSeleccionado={equipamientosManagement.equipamientoSeleccionado}
            setEquipamientoSeleccionado={equipamientosManagement.setEquipamientoSeleccionado}
            agregarEquipamiento={equipamientosManagement.agregarEquipamiento}
            removeEquipamiento={equipamientosManagement.removeEquipamiento}
            setPersonaResponsableEquipamiento={equipamientosManagement.setPersonaResponsableEquipamiento}
            canEditar={canEditar}
            cancelado={jornada?.cancelado}
            personasIds={personasIds}
          />

          <Separator />

          {/* Detalle y Anotaciones */}
          <FormField
            control={form.control}
            name="detalle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detalle</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anotaciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anotaciones</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones de acción */}
          <div className="flex gap-2 justify-between pt-4">
            <div className="flex gap-2">
              {jornada?.id && canEliminar && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {jornada?.id && canEditar && jornada.cancelado !== 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowCancelarDialog(true)}
                  disabled={isLoading}
                >
                  Cancelar Jornada
                </Button>
              )}
              {canEditar && jornada?.cancelado !== 1 && (
                <LoadingButton type="submit" loading={isLoading}>
                  {jornada?.id ? "Actualizar" : "Crear"}
                </LoadingButton>
              )}
            </div>
          </div>
        </form>
      </Form>

      {jornada?.id && (
        <CancelarJornadaDialog
          open={showCancelarDialog}
          onOpenChange={setShowCancelarDialog}
          jornadaId={jornada.id}
          onSuccess={() => {
            setShowCancelarDialog(false);
            onSuccess?.();
          }}
        />
      )}
    </>
  );
};

export default JornadaForm;

// ============= PLANIFICACION JORNADAS FORM (MÚLTIPLES JORNADAS) =============

interface PlanificacionJornadasFormProps {
  onSuccess?: () => void;
  presupuestoId?: number;
}

export const PlanificacionJornadasForm = ({
  onSuccess,
  presupuestoId,
}: PlanificacionJornadasFormProps) => {
  const { toast } = useToast();
  const canCrear = hasPermission(PERMISOS.JORNADA_CREAR);

  const createMutation = useCreateJornadaMutation();

  const form = useForm<PlanificacionFormValues>({
    resolver: zodResolver(planificacionSchema),
    defaultValues: {
      rangoFechas: null,
      tipo: "producto",
      presupuestoId,
      personasTrabajos: [],
      flotas: [],
      equipamientos: [],
      detalle: "",
      anotaciones: "",
    },
  });

  const rangoFechas = form.watch("rangoFechas");
  const tipo = form.watch("tipo");
  const personasTrabajos = form.watch("personasTrabajos") ?? [];
  const flotas = form.watch("flotas") ?? [];
  const equipamientos = form.watch("equipamientos") ?? [];
  const personasManagement = usePersonasManagement(form);
  const flotaManagement = useFlotaManagement(form);
  const equipamientosManagement = useEquipamientosManagement(form);
  const personasIds = personasTrabajos.map((pt) => pt.personaId);

  const diasEnRango = React.useMemo(() => {
    if (!rangoFechas?.from || !rangoFechas?.to) return [];

    const parseLocal = (s: string) => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d);
    };

    return eachDayOfInterval({
      start: parseLocal(rangoFechas.from),
      end: parseLocal(rangoFechas.to),
    });
  }, [rangoFechas]);

  const totalJornadas = diasEnRango.length;

  const onSubmit = async (data: PlanificacionFormValues) => {
    if (!canCrear) {
      toast({
        description: "No tienes permisos para crear jornadas",
        variant: "destructive",
      });
      return;
    }

    try {
      let creadas = 0;

      for (const dia of diasEnRango) {
        const fecha = format(dia, "yyyy-MM-dd");

        await createMutation.mutateAsync({
          fecha,
          tipo: data.tipo,
          presupuestoId: data.presupuestoId,
          personasTrabajos: data.personasTrabajos,
          flotas: data.flotas,
          equipamientos: data.equipamientos,
          detalle: data.detalle,
          anotaciones: data.anotaciones,
        });

        creadas++;
      }

      toast({
        description: `${creadas} jornada${
          creadas > 1 ? "s" : ""
        } creada${creadas > 1 ? "s" : ""} exitosamente`,
      });

      form.reset();
      onSuccess?.();
    } catch {
      toast({
        description: "Error al crear las jornadas",
        variant: "destructive",
      });
    }
  };

  const isLoading = createMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rangoFechas"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateRangePicker
                  label="Rango de Fechas *"
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="presupuestoId"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Presupuesto (OT)</FormLabel>
                {field.value && (
                  <Link
                    href={`/presupuestos/${field.value}`}
                    target="_blank"
                    className="text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              <FormControl>
                <PresupuestoSelector
                  selectedResult={
                    field.value
                      ? {
                          id: field.value,
                          descripcionCorta: `#${field.value}`,
                        }
                      : undefined
                  }
                  onSelectResult={(result) => field.onChange(result.id)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TipoJornadaSelector
          control={form.control}
          name="tipo"
          label="Tipo de Planificación *"
          idPrefix="planificacion"
        />

        <Separator />

        <PersonasSection
          personasTrabajos={personasTrabajos}
          personaSeleccionada={personasManagement.personaSeleccionada}
          setPersonaSeleccionada={personasManagement.setPersonaSeleccionada}
          agregarPersona={personasManagement.agregarPersona}
          removePersona={personasManagement.removePersona}
          setTrabajoPersona={personasManagement.setTrabajoPersona}
          canEditar={canCrear}
          tipo={tipo}
        />

        <Separator />

        {/* Sección de Flota */}
        <FlotaSection
          flotas={flotas}
          flotaSeleccionada={flotaManagement.flotaSeleccionada}
          setFlotaSeleccionada={flotaManagement.setFlotaSeleccionada}
          agregarFlota={flotaManagement.agregarFlota}
          removeFlota={flotaManagement.removeFlota}
          setPersonaResponsable={flotaManagement.setPersonaResponsable}
          canEditar={canCrear}
          personasIds={personasIds}
        />

        <Separator />

        {/* Sección de Equipamiento */}
        <EquipamientosSection
          equipamientos={equipamientos}
          equipamientoSeleccionado={
            equipamientosManagement.equipamientoSeleccionado
          }
          setEquipamientoSeleccionado={
            equipamientosManagement.setEquipamientoSeleccionado
          }
          agregarEquipamiento={equipamientosManagement.agregarEquipamiento}
          removeEquipamiento={equipamientosManagement.removeEquipamiento}
          setPersonaResponsableEquipamiento={
            equipamientosManagement.setPersonaResponsableEquipamiento
          }
          canEditar={canCrear}
          personasIds={personasIds}
        />

        <Separator />

        <FormField
          control={form.control}
          name="detalle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalle</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anotaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anotaciones</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {totalJornadas > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {diasEnRango.length} días
              </div>
              ×
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {personasIds.length} personas
              </div>
            </div>
            <div className="font-semibold">= {totalJornadas}</div>
          </div>
        )}

        <div className="flex justify-end">
          {canCrear && (
            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={totalJornadas === 0}
            >
              Crear {totalJornadas} Jornada
              {totalJornadas !== 1 && "s"}
            </LoadingButton>
          )}
        </div>
      </form>
    </Form>
  );
};
