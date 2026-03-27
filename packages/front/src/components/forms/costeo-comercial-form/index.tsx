"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import React from "react";
import { formatCurrency } from "@/utils/number";
import { Impuestos } from "./impuestos";
import { Rentabilidad } from "./rentabilidad";
import { Subtotal } from "./subtotal";
import { CostosAdministrativos } from "./costos-administrativos";
import { Resumen } from "./resumen";
import { Descripcion } from "./descripcion";
import { EditableInput } from "@/components/form-helpers/editable-input";
import { hasPermission } from "@/hooks/use-access";
import { PERMISOS } from "@/constants/permisos";
interface CosteoComercialFormProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  form: any;
}

export function CosteoComercialForm({
  items,
  setItems,
  form,
}: CosteoComercialFormProps) {
  const [expandedItems, setExpandedItems] = useState(() =>
    Object.fromEntries(items.map((item) => [item.id, false]))
  );
  const puedeHacerCosteoComercial = hasPermission(
    PERMISOS.PRESUPUESTOS_COSTEO_COMERCIAL_CREAR
  );

  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(
      items.map((item) => [
        item.id,
        {
          materialesExpanded: false,
          suministrosExpanded: false,
          manoDeObraExpanded: false,
        },
      ])
    )
  );

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleSection = (itemId: string, section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [section]: !prev[itemId]?.[section],
      },
    }));
  };

  React.useEffect(() => {
    // Inicializar ventas para cada ítem basado en costos y comisiones
    const initializedItems = items.map((item) => {
      const materialesVenta =
        (parseFloat(item.materialesCosto) || 0) *
        (1 + (parseFloat(item.materialesComision) || 0) / 100);
      const suministrosVenta =
        (parseFloat(item.suministrosCosto) || 0) *
        (1 + (parseFloat(item.suministrosComision) || 0) / 100);
      const manoDeObraVenta =
        (parseFloat(item.manoDeObraCosto) || 0) *
        (1 + (parseFloat(item.manoDeObraComision) || 0) / 100);
      const ivaComision = parseFloat(item.ivaComision) || 0;

      return {
        ...item,
        materialesVenta,
        suministrosVenta,
        manoDeObraVenta: manoDeObraVenta,
        venta:
          materialesVenta + suministrosVenta + manoDeObraVenta + ivaComision,
      };
    });

    setItems(initializedItems);
  }, []);

  React.useEffect(() => {
    const costoTotal = items.reduce((acc, i) => {
      const materiales = parseFloat(i.materialesCosto) || 0;
      const suministros = parseFloat(i.suministrosCosto) || 0;
      const manoDeObra = parseFloat(i.manoDeObraCosto) || 0;
      return acc + materiales + suministros + manoDeObra;
    }, 0);
    form.setValue("costoTotal", costoTotal);
    if (
      form.getValues("ventaTotal") === "0.00" ||
      form.getValues("ventaTotal") === 0
    ) {
      updateVentaTotal();
    }
  }, [items]);

  const updateVentaTotal = () => {
    const ventaTotal = items.reduce((acc, i) => {
      const materiales = parseFloat(i.materialesVenta) || 0;
      const suministros = parseFloat(i.suministrosVenta) || 0;
      const manoDeObra = parseFloat(i.manoDeObraVenta) || 0;
      const ivaComision = parseFloat(i.ivaComision) || 0;
      return acc + materiales + suministros + manoDeObra + ivaComision;
    }, 0);
    form.setValue("ventaTotal", ventaTotal);
  };

  const resetVentaTotal = () => {
    const updatedItems = items.map((i) => {
      const materialesVenta =
        (parseFloat(i.materialesCosto) || 0) *
        (1 + (parseFloat(i.materialesComision) || 0) / 100);
      const suministrosVenta =
        (parseFloat(i.suministrosCosto) || 0) *
        (1 + (parseFloat(i.suministrosComision) || 0) / 100);
      const manoDeObraVenta =
        (parseFloat(i.manoDeObraCosto) || 0) *
        (1 + (parseFloat(i.manoDeObraComision) || 0) / 100);

      return {
        ...i,
        ivaComision: 0,
        materialesVenta,
        suministrosVenta,
        manoDeObraVenta,
        venta: materialesVenta + suministrosVenta + manoDeObraVenta,
      };
    });

    setItems(updatedItems);

    const ventaTotal = updatedItems.reduce((acc, i) => acc + i.venta, 0);
    form.setValue("ventaTotal", ventaTotal);
  };
  // const handleVentaTotal = () => {
  //     const ventaTotalForm = parseFloat(form.getValues("ventaTotal")) || 0;
  //     const ventaTotalCalculada = items.reduce((acc, i) => {
  //         const materiales = parseFloat(i.materialesVenta) || 0;
  //         const suministros = parseFloat(i.suministrosVenta) || 0;
  //         const manoDeObra = parseFloat(i.manoDeObraVenta) || 0;
  //         return acc + materiales + suministros + manoDeObra;
  //     }, 0);

  //     const diferencia = ventaTotalForm - ventaTotalCalculada;
  //     const ivaPorItem = diferencia / items.length;

  //     const updatedItems = items.map((item) => ({
  //         ...item,
  //         ivaComision: ivaPorItem,
  //         venta:
  //             (parseFloat(item.materialesVenta) || 0) +
  //             (parseFloat(item.suministrosVenta) || 0) +
  //             (parseFloat(item.manoDeObraVenta) || 0) +
  //             ivaPorItem,
  //     }));

  //     setItems(updatedItems);
  // };
  const handleVentaTotalSumandoEnIvaComision = () => {
    // Ejemplo: Si tenemos un total de ventas calculado de 150 y queremos ajustar el total a 200:
    // - Ítem 1 tiene un valor de 100 (100/150 = 0.6666...)
    // - Ítem 2 tiene un valor de 50 (50/150 = 0.3333...)
    // La diferencia entre el total deseado (200) y el total actual (150) es 50.
    // Se distribuye esta diferencia de forma proporcional según la participación de cada ítem:
    // - A Ítem 1 se le agrega 50 * 0.6666 = 33.33
    // - A Ítem 2 se le agrega 50 * 0.3333 = 16.66
    // De esta forma, los nuevos valores de venta serán: Ítem 1 = 133.33 y Ítem 2 = 66.66, sumando 200.
    // Esto asegura que el ajuste de la venta total sea proporcional a la contribución de cada ítem.

    const ventaTotalForm = parseFloat(form.getValues("ventaTotal")) || 0;

    const ventaTotalCalculada = items.reduce((acc, i) => {
      const materiales = parseFloat(i.materialesVenta) || 0;
      const suministros = parseFloat(i.suministrosVenta) || 0;
      const manoDeObra = parseFloat(i.manoDeObraVenta) || 0;
      return acc + materiales + suministros + manoDeObra;
    }, 0);

    const diferencia = ventaTotalForm - ventaTotalCalculada;

    const updatedItems = items.map((item) => {
      const baseVenta =
        (parseFloat(item.materialesVenta) || 0) +
        (parseFloat(item.suministrosVenta) || 0) +
        (parseFloat(item.manoDeObraVenta) || 0);

      const proporcion =
        ventaTotalCalculada > 0 ? baseVenta / ventaTotalCalculada : 0;
      const ivaProporcional = diferencia * proporcion;

      return {
        ...item,
        ivaComision: ivaProporcional,
        venta: baseVenta + ivaProporcional,
      };
    });

    setItems(updatedItems);
  };
  const handleVentaTotalComisionAlMayorCosto = () => {
    // 1. Obtener el valor total de venta deseado desde el formulario
    // Ejemplo: Si en el formulario ingresaron "1000", ventaTotalForm = 1000
    const ventaTotalForm = parseFloat(form.getValues("ventaTotal")) || 0;

    // 2. Calcular el total actual sumando las ventas de cada categoría de todos los items
    // Ejemplo: Si hay 2 items con ventas de 300 y 700, ventaTotalCalculada = 1000
    const ventaTotalCalculada = items.reduce((acc, i) => {
      // Obtener valores de venta para cada categoría (con default 0 si no existe)
      const materiales = parseFloat(i.materialesVenta) || 0;
      const suministros = parseFloat(i.suministrosVenta) || 0;
      const manoDeObra = parseFloat(i.manoDeObraVenta) || 0;

      // Sumar al acumulador las ventas de este item
      return acc + materiales + suministros + manoDeObra;
    }, 0);

    // 3. Calcular la diferencia entre lo deseado y lo actual
    // Ejemplo: Si deseado=1200 y actual=1000, diferencia=200
    const diferencia = ventaTotalForm - ventaTotalCalculada;

    // 4. Actualizar cada item proporcionalmente
    const updatedItems = items.map((item) => {
      // Calcular la venta base del item (suma de sus categorías)
      // Ejemplo: Si materialesVenta=100, suministrosVenta=200, manoDeObraVenta=300 → baseVenta=600
      const baseVenta =
        (parseFloat(item.materialesVenta) || 0) +
        (parseFloat(item.suministrosVenta) || 0) +
        (parseFloat(item.manoDeObraVenta) || 0);

      // Calcular qué proporción del total representa este item
      // Ejemplo: Si baseVenta=600 y ventaTotalCalculada=1000 → proporcion=0.6 (60%)
      const proporcion =
        ventaTotalCalculada > 0 ? baseVenta / ventaTotalCalculada : 0;

      // Calcular cuánto del ajuste total le corresponde a este item
      // Ejemplo: Si diferencia=200 y proporcion=0.6 → ajusteProporcional=120
      const ajusteProporcional = diferencia * proporcion;

      // Calcular el nuevo total para este item
      // Ejemplo: baseVenta=600 + ajusteProporcional=120 → nuevoTotalItem=720
      const nuevoTotalItem = baseVenta + ajusteProporcional;

      // 5. Identificar la categoría con mayor costo base
      const costos = {
        materiales: parseFloat(item.materialesCosto) || 0, // Ejemplo: 100
        suministros: parseFloat(item.suministrosCosto) || 0, // Ejemplo: 150
        manoDeObra: parseFloat(item.manoDeObraCosto) || 0, // Ejemplo: 200
      };

      // Encontrar la categoría con mayor costo usando reduce
      // En el ejemplo anterior, devolvería 'manoDeObra'
      const mayorRubro = Object.entries(costos).reduce((prev, current) =>
        current[1] > prev[1] ? current : prev
      )[0] as "materiales" | "suministros" | "manoDeObra";

      // 6. Caso especial: Si todos los costos son cero, usar ivaComision
      if (costos.materiales + costos.suministros + costos.manoDeObra === 0) {
        return {
          ...item, // Mantener todas las propiedades existentes
          ivaComision: ajusteProporcional, // Asignar todo el ajuste aquí
          venta: nuevoTotalItem, // Actualizar el total
        };
      }

      // 7. Calcular nueva comisión para la categoría con mayor costo

      // Obtener el costo base de la categoría mayor (ejemplo: 200 para manoDeObra)
      const costoBase = costos[mayorRubro];

      // Obtener la comisión actual (ejemplo: 10 si manoDeObraComision="10")
      const comisionActual = parseFloat(item[`${mayorRubro}Comision`]) || 0;

      // Calcular venta actual de esta categoría (ejemplo: 200 * 1.10 = 220)
      const ventaActualRubro = costoBase * (1 + comisionActual / 100);

      // Calcular nueva venta sumando el ajuste (ejemplo: 220 + 120 = 340)
      const nuevaVentaRubro = ventaActualRubro + ajusteProporcional;

      // Calcular qué porcentaje de comisión lograría esta nueva venta
      // Ejemplo: ((340/200) - 1) * 100 = (1.7 - 1)*100 = 70%
      const nuevaComision = (nuevaVentaRubro / costoBase - 1) * 100;

      // 8. Retornar el item actualizado
      return {
        ...item, // Mantener propiedades existentes
        [`${mayorRubro}Comision`]: nuevaComision.toFixed(2), // Actualizar comisión (ej: "70.00")
        [`${mayorRubro}Venta`]: nuevaVentaRubro, // Actualizar venta de la categoría (ej: 340)
        ivaComision: 0, // Reiniciar el IVA comisión
        venta: nuevoTotalItem, // Establecer el nuevo total (ej: 720)
      };
    });

    // 9. Actualizar el estado con los items modificados
    setItems(updatedItems);
  };
  const handleVentaTotal = () => {
    // 1. Obtener el valor total de venta deseado ingresado en el formulario
    // Ejemplo: el usuario escribe "1200" → ventaTotalForm = 1200
    const ventaTotalForm = parseFloat(form.getValues("ventaTotal")) || 0;

    // 2. Calcular el total actual de ventas sumando todas las categorías de todos los items
    // Ejemplo: hay 2 items con ventas [materiales=200, suministros=100, manoDeObra=200] y [300, 100, 100] → total = 1000
    const ventaTotalCalculada = items.reduce((acc, i) => {
      const materiales = parseFloat(i.materialesVenta) || 0;
      const suministros = parseFloat(i.suministrosVenta) || 0;
      const manoDeObra = parseFloat(i.manoDeObraVenta) || 0;
      return acc + materiales + suministros + manoDeObra;
    }, 0);

    // 3. Calcular la diferencia entre lo deseado y lo actual
    // Ejemplo: usuario puso 1200, y el total actual es 1000 → diferencia = 200
    const diferencia = ventaTotalForm - ventaTotalCalculada;

    // 4. Recorrer cada item para aplicar el ajuste proporcional
    const updatedItems = items.map((item) => {
      // 4.1 Sumar la venta base del item actual (antes del ajuste)
      // Ejemplo: materiales=200, suministros=100, manoDeObra=200 → baseVenta = 500
      const baseVenta =
        (parseFloat(item.materialesVenta) || 0) +
        (parseFloat(item.suministrosVenta) || 0) +
        (parseFloat(item.manoDeObraVenta) || 0);

      // 4.2 Calcular qué porcentaje del total representa este item
      // Ejemplo: baseVenta=500, total=1000 → proporcion = 0.5 (50%)
      const proporcion =
        ventaTotalCalculada > 0 ? baseVenta / ventaTotalCalculada : 0;

      // 4.3 Aplicar el porcentaje de ajuste que le corresponde al item
      // Ejemplo: diferencia=200, proporcion=0.5 → ajusteProporcional = 100
      const ajusteProporcional = diferencia * proporcion;

      // 4.4 Calcular la nueva venta total del item
      // Ejemplo: baseVenta=500 + ajuste=100 → nuevoTotalItem = 600
      const nuevoTotalItem = baseVenta + ajusteProporcional;

      // 4.5 Obtener los costos base del item
      // Ejemplo: materialesCosto=100, suministrosCosto=50, manoDeObraCosto=150
      const costos = {
        materiales: parseFloat(item.materialesCosto) || 0,
        suministros: parseFloat(item.suministrosCosto) || 0,
        manoDeObra: parseFloat(item.manoDeObraCosto) || 0,
      };

      // 4.6 Calcular el total de costos
      const totalCostos =
        costos.materiales + costos.suministros + costos.manoDeObra;

      // 4.7 Si no hay costos definidos, usamos ivaComision como fallback
      if (totalCostos === 0) {
        return {
          ...item,
          ivaComision: ajusteProporcional, // Le asignamos todo el ajuste aquí
          venta: nuevoTotalItem,
        };
      }

      // 4.8 Función para calcular la nueva comisión para cada rubro
      const calcularNuevaComision = (
        costo: number,
        comisionActual: number,
        proporcion: number
      ): string => {
        if (costo === 0) return comisionActual.toFixed(2);
        const ajusteCategoria = ajusteProporcional * proporcion;

        // Venta actual = costo * (1 + %comisión)
        const ventaActual = costo * (1 + comisionActual / 100);

        // Nueva venta = venta actual + parte del ajuste
        const nuevaVenta = ventaActual + ajusteCategoria;

        // Nueva comisión = (nueva venta / costo - 1) * 100
        const nuevaComision = (nuevaVenta / costo - 1) * 100;
        return nuevaComision.toString();
      };

      // 4.9 Calcular qué proporción del costo representa cada rubro
      const proporcionMateriales = costos.materiales / totalCostos;
      const proporcionSuministros = costos.suministros / totalCostos;
      const proporcionManoDeObra = costos.manoDeObra / totalCostos;

      // 4.10 Calcular nuevas comisiones proporcionales
      const nuevaMaterialesComision = calcularNuevaComision(
        costos.materiales,
        parseFloat(item.materialesComision) || 0,
        proporcionMateriales
      );

      const nuevaSuministrosComision = calcularNuevaComision(
        costos.suministros,
        parseFloat(item.suministrosComision) || 0,
        proporcionSuministros
      );

      const nuevaManoDeObraComision = calcularNuevaComision(
        costos.manoDeObra,
        parseFloat(item.manoDeObraComision) || 0,
        proporcionManoDeObra
      );

      // 4.11 Retornar el item actualizado con nuevas comisiones y ventas por categoría
      return {
        ...item,
        materialesComision: nuevaMaterialesComision,
        suministrosComision: nuevaSuministrosComision,
        manoDeObraComision: nuevaManoDeObraComision,
        materialesVenta:
          costos.materiales * (1 + parseFloat(nuevaMaterialesComision) / 100),
        suministrosVenta:
          costos.suministros * (1 + parseFloat(nuevaSuministrosComision) / 100),
        manoDeObraVenta:
          costos.manoDeObra * (1 + parseFloat(nuevaManoDeObraComision) / 100),
        ivaComision: 0, // Limpiamos el ivaComision porque no lo usamos
        venta: nuevoTotalItem,
      };
    });

    // 5. Actualizar el estado con todos los items modificados
    setItems(updatedItems);
  };

  function updateOtrosCostos(itemId: number, value: string) {
    const ivaComision = parseFloat(value) || 0;
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const totalVenta =
          (parseFloat(item.materialesVenta) || 0) +
          (parseFloat(item.suministrosVenta) || 0) +
          (parseFloat(item.manoDeObraVenta) || 0) +
          ivaComision;

        return {
          ...item,
          ivaComision,
          venta: totalVenta,
        };
      }
      return item;
    });
    setItems(updatedItems);
    form.setValue("ventaTotal", calcularVentaTotal(updatedItems));
  }

  function updateComision(
    itemId: number,
    field: "materialesComision" | "suministrosComision" | "manoDeObraComision",
    value: string,
    costo: number,
    ventaKey: string
  ) {
    const porcentaje = value;
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const ventaCalculada = costo * (1 + parseFloat(porcentaje) / 100);
        const updatedItem = {
          ...item,
          [field]: porcentaje,
          [ventaKey]: ventaCalculada,
        };

        const totalVenta =
          (parseFloat(updatedItem.materialesVenta) || 0) +
          (parseFloat(updatedItem.suministrosVenta) || 0) +
          (parseFloat(updatedItem.manoDeObraVenta) || 0) +
          (parseFloat(updatedItem.ivaComision) || 0);

        return {
          ...updatedItem,
          venta: totalVenta,
        };
      }
      return item;
    });
    setItems(updatedItems);
    form.setValue("ventaTotal", calcularVentaTotal(updatedItems));
  }

  function calcularVentaTotal(items: any[]) {
    return items.reduce((acc, i) => {
      const materiales = parseFloat(i.materialesVenta) || 0;
      const suministros = parseFloat(i.suministrosVenta) || 0;
      const manoDeObra = parseFloat(i.manoDeObraVenta) || 0;
      const ivaComision = parseFloat(i.ivaComision) || 0;
      return acc + materiales + suministros + manoDeObra + ivaComision;
    }, 0);
  }

  const Section = ({
    itemId,
    sectionKey,
    title,
    data,
  }: {
    itemId: string;
    sectionKey: keyof (typeof expandedSections)[string];
    title: string;
    data: any[];
  }) => (
    <>
      <div
        className="flex items-center justify-between cursor-pointer p-3 bg-primary/5 rounded-md border-2 border-primary/20"
        onClick={() => toggleSection(itemId, sectionKey)}
      >
        <h3 className="font-medium">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${expandedSections[itemId]?.[sectionKey] ? "rotate-180" : ""}`}
        />
      </div>

      {expandedSections[itemId]?.[sectionKey] && (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Cant.</TableHead>
                <TableHead className="text-right">Punit</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                {/* <TableHead className="text-right">Costo Prod.</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.inventario?.nombre || d.concepto} </TableCell>
                  <TableCell className="text-right">{d.cantidad}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(d.punit)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(d.importe)}
                  </TableCell>
                  {/* <TableCell className="text-right">{formatCurrency(d.costoProduccion)}</TableCell> */}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-12 text-center text-muted-foreground"
                  >
                    No hay {title.toLowerCase()} registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
  const actualizarItemConNuevoTotal = (
    items: any[],
    item: any,
    newTotal: string,
    calcularVentaTotal: (items: any[]) => number,
    setItems: (items: any[]) => void,
    form: any
  ): void => {
    const baseVenta =
      (parseFloat(item.materialesVenta) || 0) +
      (parseFloat(item.suministrosVenta) || 0) +
      (parseFloat(item.manoDeObraVenta) || 0);

    const diferencia = parseFloat(newTotal) - baseVenta;

    const costos = {
      materiales: parseFloat(item.materialesCosto) || 0,
      suministros: parseFloat(item.suministrosCosto) || 0,
      manoDeObra: parseFloat(item.manoDeObraCosto) || 0,
    };

    const totalCostos =
      costos.materiales + costos.suministros + costos.manoDeObra;

    const updatedItems = items.map((i) => {
      if (i.id !== item.id) return i;

      if (totalCostos === 0) {
        return {
          ...i,
          ivaComision: diferencia,
          venta: parseFloat(newTotal),
        };
      }

      const proporcionMateriales = costos.materiales / totalCostos;
      const proporcionSuministros = costos.suministros / totalCostos;
      const proporcionManoDeObra = costos.manoDeObra / totalCostos;

      const calcularNuevaComision = (
        costo: number,
        comisionActual: number,
        proporcion: number
      ): number => {
        if (costo === 0) return comisionActual;
        const ajusteCategoria = diferencia * proporcion;
        const ventaActual = costo * (1 + comisionActual / 100);
        const nuevaVenta = ventaActual + ajusteCategoria;
        return (nuevaVenta / costo - 1) * 100;
      };

      const nuevaMaterialesComision = calcularNuevaComision(
        costos.materiales,
        parseFloat(i.materialesComision) || 0,
        proporcionMateriales
      ).toString();

      const nuevaSuministrosComision = calcularNuevaComision(
        costos.suministros,
        parseFloat(i.suministrosComision) || 0,
        proporcionSuministros
      ).toString();

      const nuevaManoDeObraComision = calcularNuevaComision(
        costos.manoDeObra,
        parseFloat(i.manoDeObraComision) || 0,
        proporcionManoDeObra
      ).toString();

      return {
        ...i,
        materialesComision: nuevaMaterialesComision,
        suministrosComision: nuevaSuministrosComision,
        manoDeObraComision: nuevaManoDeObraComision,
        materialesVenta:
          costos.materiales * (1 + parseFloat(nuevaMaterialesComision) / 100),
        suministrosVenta:
          costos.suministros * (1 + parseFloat(nuevaSuministrosComision) / 100),
        manoDeObraVenta:
          costos.manoDeObra * (1 + parseFloat(nuevaManoDeObraComision) / 100),
        ivaComision: 0,
        venta: parseFloat(newTotal),
      };
    });

    setItems(updatedItems);
    form.setValue("ventaTotal", calcularVentaTotal(updatedItems));
  };

  return (
    <Card>
      <CardHeader className="rounded-t-lg border-b bg-muted">
        <CardTitle>Costeo Comercial</CardTitle>
        <CardDescription>Gestión de costos y presupuestos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <Card key={item.id} className="my-4">
            <CardHeader
              onClick={() => toggleExpand(item.id)}
              className="flex flex-row items-center justify-between py-3 px-4 bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-semibold">
                  ÍTEM {index + 1}
                </Badge>
                <span className="font-medium">
                  {item.descripcion || "Sin descripción"}
                </span>
                <Badge className="font-medium">{item.cantidad || "-"}</Badge>
              </div>
              <div className="font-semibold text-sm text-right">
                $ {formatCurrency(item.venta)}
              </div>
            </CardHeader>

            {expandedItems[item.id] && (
              <CardContent className="p-4 space-y-6">
                <Section
                  itemId={item.id}
                  sectionKey="materialesExpanded"
                  title="Materiales"
                  data={item.materiales}
                />
                <Section
                  itemId={item.id}
                  sectionKey="suministrosExpanded"
                  title="Suministros"
                  data={item.suministros}
                />
                <Section
                  itemId={item.id}
                  sectionKey="manoDeObraExpanded"
                  title="Mano de obra"
                  data={item.manoDeObra}
                />

                <Separator className="my-4" />
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Resumen de costos</h3>

                  <div className="rounded-lg border overflow-hidden">
                    <Table className="border rounded-md overflow-hidden text-sm">
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Costo</TableHead>
                          <TableHead className="text-right">
                            Comisión %
                          </TableHead>
                          <TableHead className="text-right">Venta</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            label: "Materiales",
                            costo: item.materialesCosto,
                            comision: item.materialesComision,
                            venta: item.materialesVenta,
                            key: "materialesComision",
                            ventaKey: "materialesVenta",
                          },
                          {
                            label: "Suministros",
                            costo: item.suministrosCosto,
                            comision: item.suministrosComision,
                            venta: item.suministrosVenta,
                            key: "suministrosComision",
                            ventaKey: "suministrosVenta",
                          },
                          {
                            label: "Mano de obra",
                            costo: item.manoDeObraCosto,
                            comision: item.manoDeObraComision,
                            venta: item.manoDeObraVenta,
                            key: "manoDeObraComision",
                            ventaKey: "manoDeObraVenta",
                          },
                        ].map((row) => (
                          <TableRow
                            key={row.label}
                            className="border-b last:border-none hover:bg-muted/20 transition-colors"
                          >
                            <TableCell className="py-2">{row.label}</TableCell>
                            <TableCell className="text-right py-2 text-muted-foreground">
                              {formatCurrency(row.costo)}
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <Input
                                className="w-full text-right h-8"
                                value={row.comision}
                                onInput={(e) => {
                                  const newValue =
                                    e.currentTarget.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    );
                                  e.currentTarget.value = newValue;
                                }}
                                disabled={!puedeHacerCosteoComercial}
                                onChange={(e) => {
                                  updateComision(
                                    item.id,
                                    row.key,
                                    e.target.value,
                                    row.costo,
                                    row.ventaKey
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <Input
                                className="w-full text-right bg-muted h-8"
                                value={formatCurrency(
                                  row.costo *
                                    (1 + (parseFloat(row.comision) || 0) / 100)
                                )}
                                readOnly
                              />
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow className="border-b last:border-none hover:bg-muted/20 transition-colors">
                          <TableCell className="py-2">Adicionales</TableCell>
                          <TableCell className="text-right py-2 text-muted-foreground font-bold">
                            {formatCurrency(
                              (parseFloat(item.materialesCosto) || 0) +
                                (parseFloat(item.suministrosCosto) || 0) +
                                (parseFloat(item.manoDeObraCosto) || 0)
                            )}{" "}
                          </TableCell>
                          <TableCell className="text-right py-2 text-muted-foreground">
                            –
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Input
                              onInput={(e) => {
                                const newValue = e.currentTarget.value.replace(
                                  /\D/g,
                                  ""
                                );
                                e.currentTarget.value = newValue;
                              }}
                              className="w-full h-8 text-right bg-muted/10 border border-muted focus:ring-0 focus:border-primary"
                              value={item.ivaComision || 0}
                              onChange={(e) =>
                                updateOtrosCostos(item.id, e.target.value)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <Label className="text-base font-medium">
                      Valor de venta ITEM - {index + 1}
                    </Label>
                    <div className="flex gap-2">
                      {/* <Input
                                                className="w-full h-8 md:w-40 text-right bg-muted"
                                                value={formatCurrency(item.venta)}
                                                readOnly
                                            /> */}

                      <EditableInput
                        field={{
                          value: item.venta,
                          onChange: (newTotal) => {
                            actualizarItemConNuevoTotal(
                              items,
                              item,
                              newTotal,
                              calcularVentaTotal,
                              setItems,
                              form
                            );
                          },
                        }}
                        disabled={!puedeHacerCosteoComercial}
                        label="Valor total"
                      />

                      {/* <EditableInput
                                                field={{
                                                    value: item.venta,
                                                    onChange: (newTotal) => {
                                                        const baseVenta =
                                                            (parseFloat(item.materialesVenta) || 0) +
                                                            (parseFloat(item.suministrosVenta) || 0) +
                                                            (parseFloat(item.manoDeObraVenta) || 0);
                                                        const nuevoIvaComision = parseFloat(newTotal) - baseVenta;
                                                        const updatedItems = items.map(i => {
                                                            if (i.id === item.id) {
                                                                return {
                                                                    ...i,
                                                                    ivaComision: nuevoIvaComision,
                                                                    venta: parseFloat(newTotal)
                                                                };
                                                            }
                                                            return i;
                                                        });
                                                        setItems(updatedItems);
                                                        form.setValue("ventaTotal", calcularVentaTotal(updatedItems));
                                                    }
                                                }}
                                                label='Valor total'
                                                onChange={() => {

                                                }}
                                            /> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        <Resumen
          form={form}
          handleVentaTotal={handleVentaTotal}
          handleReset={resetVentaTotal}
        />
        <CostosAdministrativos form={form} />
        <Impuestos form={form} />
        <Rentabilidad form={form} />
        <Subtotal form={form} />
        <Descripcion form={form} />
      </CardContent>
    </Card>
  );
}
