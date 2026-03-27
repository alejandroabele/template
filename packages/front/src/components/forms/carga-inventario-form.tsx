import { Trabajo, Inventario, InventarioConversion } from "@/types";
import {
  Package,
  Hammer,
  Plus,
  Trash2,
  AlertCircle,
  ShoppingCart,
  Users,
  HardHat,
  Paintbrush,
  Fuel,
  PenTool,
  Anvil,
  Stamp,
  CircleCheckBig,
  TrafficCone,
  TrainTrack,
  LucideIcon,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputMoney } from "@/components/input-money";
import { InventarioSelector } from "@/components/selectors/inventario-selector";
import { UnidadMedidaInventarioSelector } from "@/components/selectors/unidad-medida-inventario-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISOS } from "@/constants/permisos";
import { hasPermission } from "@/hooks/use-access";

type CargaInventarioFormProps = {
  produccionTrabajos: any;
  setProduccionTrabajos: (data: any) => void;
  trabajos: any;
  receta?: boolean;
  trabajosSeleccionados?: number[];
};

/**
 * Formulario principal para carga de inventario en presupuestos.
 * Maneja la asignación de materiales, suministros y mano de obra a trabajos de producción y servicio.
 */
export default function CargaInventarioForm({
  produccionTrabajos,
  setProduccionTrabajos,
  trabajos,
  receta,
  trabajosSeleccionados,
}: CargaInventarioFormProps) {
  const categorias = trabajos ? Object.keys(trabajos) : [];

  const tabConfig = [
    {
      category: "producto",
      icon: Hammer,
      label: "PRODUCTO",
    },
    {
      category: "servicio",
      icon: HardHat,
      label: "SERVICIO",
    },
    {
      category: "mantenimiento",
      icon: TrafficCone,
      label: "MANTENIMIENTO",
    },
  ];

  return (
    <Tabs defaultValue={categorias[0] || ""}>
      <TabsList className="w-full">
        {tabConfig.map(({ category, icon, label }) => (
          <TabCategoria
            key={category}
            category={category}
            icon={icon}
            label={label}
            produccionTrabajos={produccionTrabajos}
          />
        ))}
      </TabsList>

      {categorias.map((categoria) => (
        <TabsContent key={categoria} value={categoria}>
          <TrabajosTab
            categoria={categoria}
            data={trabajos && trabajos[categoria]}
            produccionTrabajos={produccionTrabajos}
            setProduccionTrabajos={setProduccionTrabajos}
            receta={receta}
            trabajosSeleccionados={trabajosSeleccionados}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

type TabCategoriaProps = {
  category: string;
  icon: LucideIcon;
  label: string;
  produccionTrabajos: any;
};

/**
 * Tab individual para categoría (Producto o Servicio).
 * Muestra badge con cantidad total de items.
 */
const TabCategoria = ({
  category,
  icon: Icon,
  label,
  produccionTrabajos,
}: TabCategoriaProps) => {
  const trabajosCategoria = produccionTrabajos?.[category] || [];
  const cantidadTotal = trabajosCategoria.reduce(
    (acc: number, trabajo: any) => {
      return (
        acc +
        ["materiales", "suministros", "manoDeObra"].reduce(
          (subAcc, subcat) => subAcc + (trabajo?.[subcat]?.length || 0),
          0
        )
      );
    },
    0
  );

  return (
    <TabsTrigger
      className="w-full flex gap-2 items-center justify-center"
      value={category}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      {cantidadTotal > 0 && (
        <Badge variant="default" className="ml-1">
          {cantidadTotal}
        </Badge>
      )}
    </TabsTrigger>
  );
};

type TrabajosTabProps = {
  data?: Trabajo;
  categoria: string;
  produccionTrabajos: any;
  setProduccionTrabajos: (data: any) => void;
  receta?: boolean;
  trabajosSeleccionados?: number[];
};

type ConfiguracionTrabajo = {
  nombre: string;
  icono: LucideIcon;
};

/**
 * Tab que muestra los diferentes trabajos de producción (PINTURA, METALURGICA, etc.)
 * dentro de una categoría (producto o servicio).
 */
const TrabajosTab = ({
  data,
  categoria,
  produccionTrabajos,
  setProduccionTrabajos,
  receta,
  trabajosSeleccionados,
}: TrabajosTabProps) => {
  const configuracionTrabajos: ConfiguracionTrabajo[] = [
    { nombre: "PINTURA", icono: Paintbrush },
    { nombre: "METALURGICA", icono: Anvil },
    { nombre: "GRAFICA", icono: PenTool },
    { nombre: "PLOTEO", icono: Stamp },
    { nombre: "TERMINACIONES", icono: CircleCheckBig },
    { nombre: "MONTAJE", icono: TrainTrack },
    { nombre: "SERVICIO PETROLERO", icono: Fuel },
    { nombre: "OBRA", icono: TrafficCone },
  ];

  if (!data || data.length === 0) return null;

  return (
    <Tabs defaultValue={data[0].id}>
      <TabsList className="w-full">
        {data.map((trabajo: any) => (
          <TabTrabajo
            key={trabajo.id}
            trabajo={trabajo}
            categoria={categoria}
            produccionTrabajos={produccionTrabajos}
            configuracionTrabajos={configuracionTrabajos}
            trabajosSeleccionados={trabajosSeleccionados}
          />
        ))}
      </TabsList>

      {data.map((trabajo: any) => (
        <TabsContent key={trabajo.id} value={trabajo.id}>
          <TrabajoInventarioContent
            data={(produccionTrabajos[categoria] ?? []).find(
              (e: any) => e.id === trabajo.id
            )}
            produccionTrabajos={produccionTrabajos}
            setProduccionTrabajos={setProduccionTrabajos}
            categoria={categoria}
            receta={receta}
            trabajosSeleccionados={trabajosSeleccionados}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

type TabTrabajoProps = {
  trabajo: any;
  categoria: string;
  produccionTrabajos: any;
  configuracionTrabajos: ConfiguracionTrabajo[];
  trabajosSeleccionados?: number[];
};

/**
 * Tab individual para un trabajo específico (PINTURA, METALURGICA, etc.).
 */
const TabTrabajo = ({
  trabajo,
  categoria,
  produccionTrabajos,
  configuracionTrabajos,
  trabajosSeleccionados,
}: TabTrabajoProps) => {
  const config = configuracionTrabajos.find(
    (config) => config.nombre === trabajo.nombre
  );

  const trabajoData = produccionTrabajos[categoria]?.find(
    (e: any) => e.id === trabajo.id
  );

  const cantidadTotal = ["materiales", "suministros", "manoDeObra"].reduce(
    (acc, subcat) => acc + (trabajoData?.[subcat]?.length || 0),
    0
  );

  return (
    <TabsTrigger
      className="w-full flex gap-2 items-center justify-center"
      value={trabajo.id}
      disabled={
        trabajosSeleccionados !== undefined &&
        !trabajosSeleccionados.includes(trabajo.id)
      }
    >
      {config?.icono && <config.icono className="h-4 w-4" />}
      <span className="hidden sm:inline">{trabajo.nombre}</span>
      {cantidadTotal > 0 && (
        <Badge variant="success" className="ml-1">
          {cantidadTotal}
        </Badge>
      )}
    </TabsTrigger>
  );
};

type Subcategoria = "materiales" | "suministros" | "manoDeObra";

type TrabajoInventarioContentProps = {
  data: any;
  produccionTrabajos: any;
  setProduccionTrabajos: (data: any) => void;
  categoria: string;
  receta?: boolean;
  trabajosSeleccionados?: number[];
};

/**
 * Contenido principal de un trabajo de producción.
 * Muestra las tres subcategorías: materiales, suministros y mano de obra.
 */
const TrabajoInventarioContent = ({
  data,
  produccionTrabajos,
  setProduccionTrabajos,
  categoria,
  receta,
  trabajosSeleccionados,
}: TrabajoInventarioContentProps) => {
  const estaHabilitado =
    trabajosSeleccionados === undefined ||
    trabajosSeleccionados.includes(data?.id);

  const puedeEditar = hasPermission(PERMISOS.PRESUPUESTOS_COSTEO_TECNICO_CREAR);
  const puedeVerPrecios = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTOS_MATERIALES_VER
  );

  const subcategoriasConfig: Record<
    Subcategoria,
    { nombre: string; icon: React.ReactNode }
  > = {
    materiales: { nombre: "Materiales", icon: <Package className="h-5 w-5" /> },
    suministros: {
      nombre: "Suministros",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    manoDeObra: { nombre: "Mano de obra", icon: <Users className="h-5 w-5" /> },
  };

  const indexProduccionTrabajo = produccionTrabajos[categoria].findIndex(
    (e: any) => data && e.id === data.id
  );

  const calcularTotalTrabajo = () => {
    return ["materiales", "suministros", "manoDeObra"].reduce(
      (totalSum, subcat) => {
        const subcatSubtotal =
          produccionTrabajos[categoria][indexProduccionTrabajo]?.[
            subcat
          ]?.reduce(
            (sum: number, item: any) => sum + Number(item.importe),
            0
          ) || 0;
        return totalSum + subcatSubtotal;
      },
      0
    );
  };

  const calcularTotalGeneral = () => {
    const categorias = Object.keys(produccionTrabajos);
    return categorias.reduce((totalSum, cat) => {
      const procesos = produccionTrabajos[cat];
      return procesos.reduce((categoriaSum: number, proceso: any) => {
        const subcategorias: Subcategoria[] = [
          "materiales",
          "suministros",
          "manoDeObra",
        ];
        return subcategorias.reduce((procesoSum, subcategoria) => {
          const productos = proceso[subcategoria] || [];
          const subtotal = productos.reduce(
            (sum: number, item: any) => sum + Number(item.importe),
            0
          );
          return procesoSum + subtotal;
        }, categoriaSum);
      }, totalSum);
    }, 0);
  };

  // =============================
  // Handlers de productos
  // =============================
  const handleAddProducto = (subcategoria: Subcategoria, np: any) => {
    const updated = { ...produccionTrabajos };
    const listaActual =
      updated[categoria][indexProduccionTrabajo][subcategoria] || [];

    if (np.modo === "inventario") {
      if (!np.inventario || !np.inventarioId) return;

      const cantidad = Number(np.cantidad || 0);
      const punit = Number(np.inventario?.punit || 0);
      const item = {
        inventario: np.inventario,
        inventarioId: np.inventarioId,
        cantidad,
        punit,
        importe: Number((cantidad * punit).toFixed(2)),
        inventarioConversion: np.inventarioConversion || null,
        inventarioConversionId: np.inventarioConversion?.id || null,
      };
      updated[categoria][indexProduccionTrabajo][subcategoria] = [
        ...listaActual,
        item,
      ];
    } else {
      if (!np.concepto?.trim()) return;
      const cantidad = Number(np.cantidad || 0);
      const punit = Number(np.punit || 0);
      const item = {
        inventario: null,
        inventarioId: null,
        concepto: np.concepto.trim(),
        cantidad,
        punit,
        importe: Number((cantidad * punit).toFixed(2)),
        inventarioConversion: null,
        inventarioConversionId: null,
      };
      updated[categoria][indexProduccionTrabajo][subcategoria] = [
        ...listaActual,
        item,
      ];
    }

    setProduccionTrabajos(updated);
  };

  const handleRemoveProducto = (subcategoria: Subcategoria, index: number) => {
    const updatedProduccionTrabajos = { ...produccionTrabajos };
    const nuevosProductos = updatedProduccionTrabajos[categoria][
      indexProduccionTrabajo
    ][subcategoria].filter((_: any, i: number) => i !== index);
    updatedProduccionTrabajos[categoria][indexProduccionTrabajo][subcategoria] =
      nuevosProductos;
    setProduccionTrabajos(updatedProduccionTrabajos);
  };

  const handleUpdateProducto = (
    subcategoria: Subcategoria,
    index: number,
    field: string,
    value: any
  ) => {
    const updated = { ...produccionTrabajos };
    const item =
      updated[categoria][indexProduccionTrabajo][subcategoria][index];

    (item as any)[field] = value;

    if (field === "inventario") {
      item.inventarioId = value?.id || 0;
      item.punit = Number(value?.punit || 0);
      item.concepto = "";
    }

    if (field === "inventarioConversion") {
      item.inventarioConversion = value;
      item.inventarioConversionId = value?.id || null;
    }

    if (field === "cantidad" || field === "punit") {
      item.cantidad = item.cantidad;
      item.punit = Number(item.punit || 0);
    }

    const punitEfectivo = item.inventario
      ? Number(item.punit || 0)
      : Number(item.inventario?.punit || 0).toFixed(2);
    item.importe = Number(
      (Number(item.cantidad || 0) * punitEfectivo).toFixed(2)
    );

    setProduccionTrabajos(updated);
  };

  if (!estaHabilitado) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
        <AlertCircle className="h-6 w-6" />
        <p className="text-sm">
          Para habilitar esto, seleccioná el trabajo en{" "}
          <span className="font-semibold">Trabajos</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        defaultValue={["materiales", "suministros", "manoDeObra"]}
        className="space-y-2"
      >
        <SubcategoriaInventarioSection
          subcategoria="materiales"
          config={subcategoriasConfig.materiales}
          productos={data?.materiales || []}
          onAddProducto={(np) => handleAddProducto("materiales", np)}
          onRemoveProducto={(index) =>
            handleRemoveProducto("materiales", index)
          }
          onUpdateProducto={(index, field, value) =>
            handleUpdateProducto("materiales", index, field, value)
          }
          puedeEditar={puedeEditar}
          puedeVerPrecios={puedeVerPrecios}
          receta={receta}
        />
        <SubcategoriaInventarioSection
          subcategoria="suministros"
          config={subcategoriasConfig.suministros}
          productos={data?.suministros || []}
          onAddProducto={(np) => handleAddProducto("suministros", np)}
          onRemoveProducto={(index) =>
            handleRemoveProducto("suministros", index)
          }
          onUpdateProducto={(index, field, value) =>
            handleUpdateProducto("suministros", index, field, value)
          }
          puedeEditar={puedeEditar}
          puedeVerPrecios={puedeVerPrecios}
          receta={receta}
        />
        <SubcategoriaInventarioSection
          subcategoria="manoDeObra"
          config={subcategoriasConfig.manoDeObra}
          productos={data?.manoDeObra || []}
          onAddProducto={(np) => handleAddProducto("manoDeObra", np)}
          onRemoveProducto={(index) =>
            handleRemoveProducto("manoDeObra", index)
          }
          onUpdateProducto={(index, field, value) =>
            handleUpdateProducto("manoDeObra", index, field, value)
          }
          puedeEditar={puedeEditar}
          puedeVerPrecios={puedeVerPrecios}
          receta={receta}
        />
      </Accordion>

      {puedeEditar && (
        <TotalesSummary
          nombreTrabajo={data?.nombre}
          totalTrabajo={calcularTotalTrabajo()}
          totalGeneral={calcularTotalGeneral()}
        />
      )}
    </div>
  );
};

type TotalesSummaryProps = {
  nombreTrabajo: string;
  totalTrabajo: number;
  totalGeneral: number;
};

/**
 * Resumen de totales del trabajo y total general.
 */
const TotalesSummary = ({
  nombreTrabajo,
  totalTrabajo,
  totalGeneral,
}: TotalesSummaryProps) => {
  return (
    <div className="mt-8 flex justify-end gap-2">
      <div className="w-full max-w-xs bg-muted/20 p-4 rounded-lg border shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg flex items-center gap-2">
            Total {nombreTrabajo}
          </span>
          <span className="text-xl font-bold text-primary">
            $
            {totalTrabajo.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg flex items-center gap-2">
            Total Trabajo
          </span>
          <span className="text-xl font-bold text-primary">
            $
            {totalGeneral.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
};

type SubcategoriaInventarioSectionProps = {
  subcategoria: Subcategoria;
  config: { nombre: string; icon: React.ReactNode };
  productos: any[];
  onAddProducto: (nuevoProducto: any) => void;
  onRemoveProducto: (index: number) => void;
  onUpdateProducto: (index: number, field: string, value: any) => void;
  puedeEditar: boolean;
  puedeVerPrecios: boolean;
  receta?: boolean;
};

/**
 * Sección de acordeón para una subcategoría (materiales, suministros o mano de obra).
 * Contiene el formulario para agregar productos y la lista de productos existentes.
 */
const SubcategoriaInventarioSection = ({
  subcategoria,
  config,
  productos,
  onAddProducto,
  onRemoveProducto,
  onUpdateProducto,
  puedeEditar,
  puedeVerPrecios,
  receta,
}: SubcategoriaInventarioSectionProps) => {
  const [nuevoProducto, setNuevoProducto] = React.useState<NuevoProducto>({
    modo: "inventario",
    inventario: null,
    inventarioId: null,
    concepto: "",
    cantidad: 1,
    punit: 0,
    inventarioConversion: null,
  });

  const calcularSubtotal = () => {
    return productos.reduce(
      (sum: number, item: any) => sum + Number(item.importe),
      0
    );
  };

  const resetNuevoProducto = () => {
    setNuevoProducto({
      modo: "inventario",
      inventario: null,
      inventarioId: null,
      concepto: "",
      cantidad: 1,
      punit: 0,
      inventarioConversion: null,
    });
  };

  return (
    <AccordionItem value={subcategoria} className="border rounded-md px-1 mb-4">
      <AccordionTrigger className="hover:no-underline px-3">
        <SubcategoriaHeader
          config={config}
          cantidadProductos={productos.length}
          subtotal={calcularSubtotal()}
          puedeEditar={puedeEditar}
        />
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2">
        <TablaHeader puedeEditar={puedeEditar} />

        {puedeEditar && (
          <NuevoProductoInventarioForm
            nuevoProducto={nuevoProducto}
            setNuevoProducto={setNuevoProducto}
            onAdd={() => {
              onAddProducto(nuevoProducto);
              resetNuevoProducto();
            }}
            receta={receta}
          />
        )}

        {productos.length > 0 && (
          <div className="my-3">
            <Separator />
          </div>
        )}

        {productos.length === 0 ? (
          <ListaVacia nombreSubcategoria={config.nombre} />
        ) : (
          <div className="space-y-3">
            {productos.map((producto: any, index: number) => (
              <ProductoInventarioRow
                key={producto.inventarioId ?? index}
                producto={producto}
                index={index}
                onUpdate={(field, value) =>
                  onUpdateProducto(index, field, value)
                }
                onRemove={() => onRemoveProducto(index)}
                puedeEditar={puedeEditar}
                puedeVerPrecios={puedeVerPrecios}
              />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

type SubcategoriaHeaderProps = {
  config: { nombre: string; icon: React.ReactNode };
  cantidadProductos: number;
  subtotal: number;
  puedeEditar: boolean;
};

/**
 * Header del acordeón de subcategoría.
 */
const SubcategoriaHeader = ({
  config,
  cantidadProductos,
  subtotal,
  puedeEditar,
}: SubcategoriaHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {config.icon}
        <h3 className="text-lg font-medium">{config.nombre}</h3>
        <Badge variant="outline">{cantidadProductos}</Badge>
      </div>
      {puedeEditar && (
        <div className="text-sm font-medium">
          Subtotal: $
          {subtotal.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
        </div>
      )}
    </div>
  );
};

type TablaHeaderProps = {
  puedeEditar: boolean;
};

/**
 * Header de la tabla de productos.
 */
const TablaHeader = ({ puedeEditar }: TablaHeaderProps) => {
  return (
    <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-muted-foreground px-2 hidden sm:grid">
      <div className="col-span-3">Producto</div>
      <div className="col-span-2">Unidad</div>
      <div className="col-span-2">Cant.</div>
      {puedeEditar && <div className="col-span-2">P.Unit</div>}
      {puedeEditar && <div className="col-span-2">Valor</div>}
      <div className="col-span-1"></div>
    </div>
  );
};

type ListaVaciaProps = {
  nombreSubcategoria: string;
};

/**
 * Estado vacío cuando no hay productos en la subcategoría.
 */
const ListaVacia = ({ nombreSubcategoria }: ListaVaciaProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
      <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
      <p className="text-sm">
        No hay {nombreSubcategoria.toLowerCase()} agregados
      </p>
    </div>
  );
};

type NuevoProducto = {
  modo: "inventario" | "manual";
  inventario: Inventario | null;
  inventarioId: null | number;
  concepto: string;
  cantidad: number;
  punit: number;
  inventarioConversion: InventarioConversion | null;
};

type NuevoProductoInventarioFormProps = {
  nuevoProducto: NuevoProducto;
  setNuevoProducto: React.Dispatch<React.SetStateAction<NuevoProducto>>;
  onAdd: () => void;
  receta?: boolean;
};

/**
 * Formulario para agregar un nuevo producto a una subcategoría.
 * Permite cargar desde inventario o manualmente.
 */
const NuevoProductoInventarioForm = ({
  nuevoProducto,
  setNuevoProducto,
  onAdd,
  receta,
}: NuevoProductoInventarioFormProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-4 items-center bg-primary/5 p-3 rounded-md border-2 border-primary/20">
      {!receta && (
        <CheckboxCargaManual
          checked={nuevoProducto.modo === "manual"}
          onCheckedChange={(checked) => {
            const manual = Boolean(checked);
            setNuevoProducto((prev) => ({
              ...prev,
              modo: manual ? "manual" : "inventario",
              inventario: manual ? null : prev.inventario,
              inventarioId: manual ? null : prev.inventarioId,
              concepto: manual ? prev.concepto : "",
              punit: manual ? prev.punit : prev.inventario?.punit || 0,
            }));
          }}
        />
      )}

      <CampoProducto
        modo={nuevoProducto.modo}
        concepto={nuevoProducto.concepto}
        onInventarioChange={(value) => {
          setNuevoProducto((prev) => ({
            ...prev,
            inventario: value,
            inventarioId: value?.id || null,
            punit: value?.punit || 0,
            concepto: "",
            inventarioConversion: null,
            cantidad: 1,
          }));
        }}
        onConceptoChange={(value) => {
          setNuevoProducto((prev) => ({
            ...prev,
            concepto: value,
          }));
        }}
      />

      <CampoUnidad
        modo={nuevoProducto.modo}
        inventarioId={nuevoProducto.inventarioId}
        conversionId={nuevoProducto.inventarioConversion?.id}
        unidadBase={nuevoProducto.inventario?.unidadMedida}
        onSelect={(conversion) => {
          setNuevoProducto((prev) => ({
            ...prev,
            inventarioConversion: conversion || null,
          }));
        }}
      />

      <CampoCantidad
        cantidad={nuevoProducto.cantidad}
        conversion={nuevoProducto.inventarioConversion}
        unidadBase={nuevoProducto.inventario?.unidadMedida}
        onChange={(cantidadBase) => {
          setNuevoProducto((prev) => ({
            ...prev,
            cantidad: cantidadBase,
          }));
        }}
      />

      <CampoPrecioUnitario
        modo={nuevoProducto.modo}
        punit={nuevoProducto.punit}
        onChange={(value) => {
          setNuevoProducto((prev) => ({
            ...prev,
            punit: Number(value),
          }));
        }}
      />

      <CampoValorTotal
        cantidad={nuevoProducto.cantidad}
        punit={nuevoProducto.punit}
      />

      <BotonAgregar onAdd={onAdd} />
    </div>
  );
};

type CheckboxCargaManualProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/**
 * Checkbox para activar modo de carga manual.
 */
const CheckboxCargaManual = ({
  checked,
  onCheckedChange,
}: CheckboxCargaManualProps) => {
  return (
    <div className="flex items-center gap-3 col-span-12">
      <Checkbox
        id="cargar-manual"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <label htmlFor="cargar-manual" className="text-sm">
        Cargar manualmente
      </label>
    </div>
  );
};

type CampoProductoProps = {
  modo: "inventario" | "manual";
  concepto: string;
  onInventarioChange: (value: Inventario | null) => void;
  onConceptoChange: (value: string) => void;
};

/**
 * Campo para seleccionar producto desde inventario o ingresar concepto manualmente.
 */
const CampoProducto = ({
  modo,
  concepto,
  onInventarioChange,
  onConceptoChange,
}: CampoProductoProps) => {
  return (
    <div className="sm:col-span-3 mb-2 sm:mb-0">
      {modo === "inventario" ? (
        <InventarioSelector onChange={onInventarioChange} />
      ) : (
        <Input
          placeholder="Ingrese concepto"
          value={concepto}
          onChange={(e) => onConceptoChange(e.target.value)}
          className="border-primary/30 focus:border-primary"
        />
      )}
    </div>
  );
};

type CampoUnidadProps = {
  modo: "inventario" | "manual";
  inventarioId: number | null;
  conversionId?: string | number;
  unidadBase?: string;
  onSelect: (conversion: InventarioConversion | null) => void;
};

/**
 * Campo para seleccionar unidad de medida con conversiones.
 */
const CampoUnidad = ({
  modo,
  inventarioId,
  conversionId,
  unidadBase,
  onSelect,
}: CampoUnidadProps) => {
  if (modo !== "inventario" || !inventarioId) {
    return <div className="hidden sm:block sm:col-span-2"></div>;
  }

  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">Unidad</label>
      <UnidadMedidaInventarioSelector
        id={inventarioId}
        value={conversionId || ""}
        unidadBase={unidadBase}
        onSelect={onSelect}
      />
    </div>
  );
};

type CampoCantidadProps = {
  cantidad: number;
  conversion: InventarioConversion | null;
  unidadBase?: string;
  onChange: (cantidadBase: number) => void;
};

/**
 * Campo para ingresar cantidad con conversión automática de unidades.
 */
const CampoCantidad = ({
  cantidad,
  conversion,
  unidadBase,
  onChange,
}: CampoCantidadProps) => {
  const valorMostrado =
    conversion && conversion.id !== 0
      ? cantidad * Number(conversion.cantidad || 1)
      : cantidad;

  const handleChange = (valorIngresado: number) => {
    let cantidadBase = valorIngresado;

    if (conversion && conversion.id !== 0) {
      const cantidadConversion = Number(conversion.cantidad || 1);
      cantidadBase = valorIngresado / cantidadConversion;
    }

    onChange(cantidadBase);
  };

  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Cantidad
      </label>
      <Input
        placeholder="0"
        value={valorMostrado}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9.,]/g, "")
            .replace(",", ".");
        }}
        onChange={(e) => handleChange(Number(e.target.value || 0))}
        className="border-primary/30 focus:border-primary"
      />
      {conversion && conversion.id !== 0 && (
        <div className="text-xs text-muted-foreground mt-1 pl-3">
          = {cantidad.toFixed(2)} {unidadBase || ""}
        </div>
      )}
    </div>
  );
};

type CampoPrecioUnitarioProps = {
  modo: "inventario" | "manual";
  punit: number;
  onChange: (value: string) => void;
};

/**
 * Campo para precio unitario (readonly en modo inventario).
 */
const CampoPrecioUnitario = ({
  modo,
  punit,
  onChange,
}: CampoPrecioUnitarioProps) => {
  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Precio Unitario
      </label>
      <Input
        type="string"
        placeholder="0.00"
        readOnly={modo === "inventario"}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9.,]/g, "")
            .replace(",", ".");
        }}
        className={modo === "inventario" ? "bg-muted" : ""}
        value={punit}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

type CampoValorTotalProps = {
  cantidad: number;
  punit: number;
};

/**
 * Campo readonly que muestra el valor total calculado.
 */
const CampoValorTotal = ({ cantidad, punit }: CampoValorTotalProps) => {
  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Valor Total
      </label>
      <Input
        readOnly
        className="bg-muted"
        value={Number(cantidad) * Number(punit)}
      />
    </div>
  );
};

type BotonAgregarProps = {
  onAdd: () => void;
};

/**
 * Botón para agregar el producto a la lista.
 */
const BotonAgregar = ({ onAdd }: BotonAgregarProps) => {
  return (
    <div className="sm:col-span-1">
      <Button
        onClick={onAdd}
        type="button"
        size="icon"
        className="w-full bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

type ProductoInventarioRowProps = {
  producto: any;
  index: number;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  puedeEditar: boolean;
  puedeVerPrecios: boolean;
};

/**
 * Fila individual de producto en la tabla de inventario.
 * Muestra y permite editar un producto existente.
 */
const ProductoInventarioRow = ({
  producto,
  onUpdate,
  onRemove,
  puedeEditar,
  puedeVerPrecios,
}: ProductoInventarioRowProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center hover:bg-muted/20 rounded-md transition-colors border border-transparent hover:border-muted">
      <CampoProductoRow
        producto={producto}
        puedeEditar={puedeEditar}
        onUpdate={onUpdate}
      />

      <CampoUnidadRow
        producto={producto}
        puedeEditar={puedeEditar}
        onUpdate={onUpdate}
      />

      <CampoCantidadRow
        producto={producto}
        puedeEditar={puedeEditar}
        onUpdate={onUpdate}
      />

      {puedeVerPrecios && (
        <>
          <CampoPrecioUnitarioRow
            producto={producto}
            puedeEditar={puedeEditar}
            onUpdate={onUpdate}
          />

          <CampoValorTotalRow producto={producto} />

          <BotonEliminarRow puedeEditar={puedeEditar} onRemove={onRemove} />

          {(producto.inventario?.manejaStock ||
            (producto.inventarioConversion &&
              producto.inventarioConversion.id !== 0)) && (
            <StockDisponibleInfo producto={producto} />
          )}
        </>
      )}
    </div>
  );
};

type CampoProductoRowProps = {
  producto: any;
  puedeEditar: boolean;
  onUpdate: (field: string, value: any) => void;
};

/**
 * Campo de producto en fila existente.
 */
const CampoProductoRow = ({
  producto,
  puedeEditar,
  onUpdate,
}: CampoProductoRowProps) => {
  return (
    <div className="sm:col-span-3 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Producto
      </label>
      {producto.inventario ? (
        <InventarioSelector
          disabled={!puedeEditar}
          onChange={(value) => onUpdate("inventario", value)}
          value={producto.inventario}
        />
      ) : (
        <Input
          value={producto.concepto || ""}
          disabled={!puedeEditar}
          onChange={(e) => onUpdate("concepto", e.target.value)}
        />
      )}
    </div>
  );
};

type CampoUnidadRowProps = {
  producto: any;
  puedeEditar: boolean;
  onUpdate: (field: string, value: any) => void;
};

/**
 * Campo de unidad en fila existente.
 */
const CampoUnidadRow = ({
  producto,
  puedeEditar,
  onUpdate,
}: CampoUnidadRowProps) => {
  if (!producto.inventario) {
    return <div className="hidden sm:block sm:col-span-2"></div>;
  }

  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">Unidad</label>
      <UnidadMedidaInventarioSelector
        id={producto.inventarioId}
        value={producto.inventarioConversion?.id || ""}
        unidadBase={producto.inventario?.unidadMedida}
        disabled={!puedeEditar}
        onSelect={(conversion) => {
          if (!puedeEditar) return;
          onUpdate("inventarioConversion", conversion || null);
        }}
      />
    </div>
  );
};

type CampoCantidadRowProps = {
  producto: any;
  puedeEditar: boolean;
  onUpdate: (field: string, value: any) => void;
};

/**
 * Campo de cantidad en fila existente.
 */
const CampoCantidadRow = ({
  producto,
  puedeEditar,
  onUpdate,
}: CampoCantidadRowProps) => {
  const valorMostrado =
    producto.inventarioConversion && producto.inventarioConversion.id !== 0
      ? producto.cantidad * Number(producto.inventarioConversion.cantidad || 1)
      : producto.cantidad;

  const handleChange = (valorIngresado: number) => {
    let cantidadBase = valorIngresado;

    if (
      producto.inventarioConversion &&
      producto.inventarioConversion.id !== 0
    ) {
      const cantidadConversion = Number(
        producto.inventarioConversion.cantidad || 1
      );
      cantidadBase = valorIngresado / cantidadConversion;
    }

    onUpdate("cantidad", cantidadBase);
  };

  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Cantidad
      </label>
      <Input
        value={valorMostrado}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9.,]/g, "")
            .replace(",", ".");
        }}
        disabled={!puedeEditar}
        onChange={(e) => handleChange(Number(e.target.value || 0))}
      />
    </div>
  );
};

type CampoPrecioUnitarioRowProps = {
  producto: any;
  puedeEditar: boolean;
  onUpdate: (field: string, value: any) => void;
};

/**
 * Campo de precio unitario en fila existente.
 */
const CampoPrecioUnitarioRow = ({
  producto,
  puedeEditar,
  onUpdate,
}: CampoPrecioUnitarioRowProps) => {
  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Precio Unitario
      </label>
      {producto.inventario ? (
        <InputMoney disabled={true} value={producto.punit} />
      ) : (
        <Input
          type="string"
          placeholder="0.00"
          disabled={!puedeEditar}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value
              .replace(/[^0-9.,]/g, "")
              .replace(",", ".");
          }}
          value={producto.punit ?? 0}
          onChange={(e) => onUpdate("punit", e.target.value)}
        />
      )}
    </div>
  );
};

type CampoValorTotalRowProps = {
  producto: any;
};

/**
 * Campo de valor total en fila existente.
 */
const CampoValorTotalRow = ({ producto }: CampoValorTotalRowProps) => {
  const valorTotal =
    Number(producto.cantidad || 0) *
    (producto.punit
      ? Number(producto.punit || 0)
      : Number(producto.inventario?.punit || 0));

  return (
    <div className="sm:col-span-2 mb-2 sm:mb-0">
      <label className="block text-sm font-medium mb-1 sm:hidden">
        Valor Total
      </label>
      <InputMoney disabled={true} value={valorTotal} />
    </div>
  );
};

type BotonEliminarRowProps = {
  puedeEditar: boolean;
  onRemove: () => void;
};

/**
 * Botón para eliminar producto de la fila.
 */
const BotonEliminarRow = ({ puedeEditar, onRemove }: BotonEliminarRowProps) => {
  return (
    <div className="sm:col-span-1 flex justify-end">
      <Button
        variant="outline"
        size="icon"
        type="button"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full"
        onClick={onRemove}
        disabled={!puedeEditar}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

type StockDisponibleInfoProps = {
  producto: any;
};

/**
 * Muestra información de stock disponible para un producto.
 * Incluye stock físico, reservas, disponible y conversiones de unidades.
 */
const StockDisponibleInfo = ({ producto }: StockDisponibleInfoProps) => {
  const { inventario, inventarioConversion, cantidad } = producto;

  if (!inventario?.manejaStock) return null;

  const stockFisico = Number(inventario.stock);
  const stockReservado = Number(inventario.stockReservado);
  const stockDisponible = stockFisico - stockReservado;

  const tieneSuficienteStock = Number(cantidad) <= stockDisponible;

  const nf = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="sm:col-start-6 sm:col-span-4 text-xs text-muted-foreground">
      <span
        className={
          tieneSuficienteStock ? "font-medium" : "text-destructive font-medium"
        }
      >
        Físico: {nf.format(stockFisico)} | Res.:{" "}
        {nf.format(stockReservado)}{" "}
      </span>
      {producto.inventario?.manejaStock &&
        inventarioConversion &&
        inventarioConversion.id !== 0 && (
          <span>
            | = {nf.format(Number(producto.cantidad))}
            {producto.inventario?.unidadMedida || ""}{" "}
          </span>
        )}
    </div>
  );
};
