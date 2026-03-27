"use client"

import * as z from "zod"
import React, { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Save, AlertTriangle, TrendingUp, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/ui/loading-button"
import { useCreateIngresoMercaderia } from "@/hooks/inventario"
import { InventarioSelector } from "@/components/selectors/inventario-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Inventario, InventarioConversion, OrdenCompra, OrdenCompraItem } from "@/types"
import { UnidadMedidaInventarioSelector } from "../selectors/unidad-medida-inventario-selector"
import { OrdenCompraSelector } from "../selectors/orden-compra-selector"
import { useGetOrdenCompraByIdQuery } from "@/hooks/orden-compra"

const formSchema = z.object({})

type ProductoIngreso = {
    id: number
    producto: Inventario
    cantidad: number
    cantidadConvertida: number // Cantidad en la unidad base del producto
    conversion?: InventarioConversion | null
    ordenCompraItemId?: number | null
}

type ImprovedFormProps = {
    ordenCompraId?: string
}

export default function ImprovedForm({ ordenCompraId: ordenCompraIdProp }: ImprovedFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const { mutateAsync: create, isPending: isPendingCreate } = useCreateIngresoMercaderia()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productos: [],
        },
    })

    const [productoSeleccionado, setProductoSeleccionado] = useState<Inventario | null>(null)
    const [cantidad, setCantidad] = useState("")
    const [conversionSeleccionada, setConversionSeleccionada] = useState<InventarioConversion | null>(null)
    const [productosIngreso, setProductosIngreso] = useState<ProductoIngreso[]>([])
    const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null)
    const [ordenCompraId, setOrdenCompraId] = useState<string>(ordenCompraIdProp || "")

    const cantidadRef = useRef<HTMLInputElement>(null)

    // Obtener orden de compra seleccionada
    const { data: ordenCompraData } = useGetOrdenCompraByIdQuery(Number(ordenCompraId) || 0)

    // Precargar items cuando se selecciona una orden de compra
    const handleOrdenCompraChange = (value: string) => {
        setOrdenCompraId(value)

        // Limpiar productos actuales
        setProductosIngreso([])

        // Si se borra la selección, no hacer nada más
        if (!value) return
    }

    // Effect para precargar items cuando cambia la orden de compra
    React.useEffect(() => {
        if (ordenCompraData && ordenCompraData.items) {
            // Filtrar items no recepcionados
            const itemsNoRecepcionados = ordenCompraData.items.filter(
                (item: OrdenCompraItem) => !item.recepcionado
            )

            // Convertir a ProductoIngreso y filtrar los que tienen cantidad pendiente > 0
            const productosPreCargados: ProductoIngreso[] = itemsNoRecepcionados
                .map((item: OrdenCompraItem) => {
                    // Calcular cantidad pendiente = cantidad total - cantidad recepcionada
                    const cantidadTotal = Number(item.cantidad || 0)
                    const cantidadRecepcionada = Number(item.cantidadRecepcionada || 0)
                    const cantidadPendiente = cantidadTotal - cantidadRecepcionada

                    // Calcular cantidad convertida (en unidad base)
                    const cantidadConvertida = item.inventarioConversion
                        ? cantidadPendiente / Number(item.inventarioConversion.cantidad)
                        : cantidadPendiente

                    return {
                        id: Date.now() + (item.id || 0), // ID temporal único
                        producto: item.inventario!,
                        cantidad: cantidadPendiente,
                        cantidadConvertida: cantidadConvertida,
                        conversion: item.inventarioConversion || null,
                        ordenCompraItemId: item.id
                    }
                })
                .filter((producto) => producto.cantidad > 0) // Filtrar productos con cantidad pendiente > 0

            setProductosIngreso(productosPreCargados)

            if (productosPreCargados.length > 0) {
                toast({
                    description: `Se precargaron ${productosPreCargados.length} productos de la orden de compra`,
                })
            } else {
                toast({
                    description: "Todos los items de esta orden de compra ya fueron recepcionados",
                    variant: "destructive"
                })
            }
        }
    }, [ordenCompraData])


    const handleAgregarProducto = () => {
        if (!productoSeleccionado || !cantidad || Number.parseFloat(cantidad) <= 0) {
            toast({ description: "Selecciona un producto y cantidad válida", variant: "destructive" })
            return
        }

        const cantidadConvertida = conversionSeleccionada
            ? Number(cantidad) / Number(conversionSeleccionada.cantidad)
            : cantidad

        const productoExistente = productosIngreso.find(
            (p) => p.producto.id === productoSeleccionado.id &&
                p.conversion?.id === conversionSeleccionada?.id
        )

        if (productoExistente) {
            setProductosIngreso((prev) =>
                prev.map((p) =>
                    p.id === productoExistente.id
                        ? {
                            ...p,
                            cantidad: Number(p.cantidad) + Number(cantidad),
                            cantidadConvertida: Number(p.cantidadConvertida) + Number(cantidadConvertida)
                        }
                        : p
                )
            )
            toast({
                description: `Cantidad actualizada: ${productoSeleccionado.nombre})`,
            })
        } else {
            setProductosIngreso((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    producto: productoSeleccionado,
                    cantidad: Number(cantidad),
                    cantidadConvertida: Number(cantidadConvertida),
                    conversion: conversionSeleccionada,
                    ordenCompraItemId: null // No tiene orden de compra asociada cuando se agrega manualmente
                },
            ])
            toast({
                description: `Producto agregado: ${productoSeleccionado.nombre}`,
            })
        }

        setCantidad("")
        setConversionSeleccionada(null)
        if (cantidadRef.current) {
            cantidadRef.current.focus()
        }
    }

    const handleActualizarCantidad = (id: number, nuevaCantidadBase: number) => {
        if (nuevaCantidadBase <= 0) return

        setProductosIngreso(prev =>
            prev.map(p => {
                if (p.id === id) {
                    const cantidadConvertida = p.conversion
                        ? nuevaCantidadBase / Number(p.conversion.cantidad)
                        : nuevaCantidadBase
                    return { ...p, cantidad: nuevaCantidadBase, cantidadConvertida }
                }
                return p
            })
        )
    }

    const handleActualizarConversion = (id: number, nuevaConversion: InventarioConversion | null) => {
        setProductosIngreso(prev =>
            prev.map(p => {
                if (p.id === id) {
                    const cantidadConvertida = nuevaConversion
                        ? p.cantidad / Number(nuevaConversion.cantidad)
                        : p.cantidad
                    return { ...p, conversion: nuevaConversion, cantidadConvertida }
                }
                return p
            })
        )
    }


    const handleEliminarProducto = (id: number) => {
        const producto = productosIngreso.find((p) => p.id === id)
        setProductosIngreso((prev) => prev.filter((p) => p.id !== id))
        setShowDeleteDialog(null)

        if (producto) {
            toast({
                description: `${producto.producto.nombre} eliminado del ingreso`,
            })
        }
    }


    const totalUnidades = productosIngreso.reduce((acc, p) => acc + p.cantidad, 0)
    const totalProductos = productosIngreso.length

    // Calcular valor total estimado (si tuviéramos precios)
    const getStockStatus = (stock: number, stockMaximo: number, stockMinimo: number) => {
        // Si el stock es 0, devolvemos "Sin stock"
        if (stock === 0) {
            return {
                color: "text-red-600",
                label: "Sin stock",
                icon: <AlertTriangle className="h-4 w-4 inline mr-1" />
            }
        }

        // Si el stock es menor que el mínimo, devolvemos "Stock bajo"
        if (stock < stockMinimo) {
            return {
                color: "text-yellow-600",
                label: "Stock bajo",
                icon: <AlertTriangle className="h-4 w-4 inline mr-1" />
            }
        }

        // Si el stock está entre el mínimo y el máximo, devolvemos "Stock normal"
        if (stock >= stockMinimo && stock <= stockMaximo) {
            return {
                color: "text-green-600",
                label: "Stock normal",
                icon: <TrendingUp className="h-4 w-4 inline mr-1" />
            }
        }

        // Si el stock es mayor al máximo, devolvemos "Stock alto"
        return {
            color: "text-green-600",
            label: "Stock alto",
            icon: <TrendingUp className="h-4 w-4 inline mr-1" />
        }
    }

    async function onSubmit() {
        try {
            const mapped = productosIngreso.map((p) => ({
                productoId: p.producto.id,
                cantidad: p.cantidad,
                cantidadAntes: Number(p.producto.stock),
                producto: p.producto,
                inventarioConversionId: p.conversion?.id || null,
                ordenCompraItemId: p.ordenCompraItemId || null
            }));

            await create({
                productos: mapped,
                ordenCompraId: ordenCompraId ? Number(ordenCompraId) : undefined
            })
            toast({ description: "Ingreso guardado con éxito" })
            router.back()
        } catch (e) {
            toast({ description: "Error al guardar", variant: "destructive" })
        }
    }

    return (
        <TooltipProvider>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orden de Compra (Opcional)</CardTitle>
                            <CardDescription>
                                Selecciona una orden de compra para precargar los productos pendientes de recepcionar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdenCompraSelector
                                value={ordenCompraId}
                                onChange={handleOrdenCompraChange}
                            />
                        </CardContent>
                    </Card>

                    {!ordenCompraId && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Agregar Producto</CardTitle>
                                <CardDescription>
                                    Selecciona un producto, unidad de medida y cantidad
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <InventarioSelector disabled={false} onChange={setProductoSeleccionado} />
                                    {productoSeleccionado && (
                                        <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    Stock actual: <strong>{productoSeleccionado.stock}</strong> {productoSeleccionado.unidadMedida}
                                                </span>
                                                <Badge
                                                    variant={productoSeleccionado.stock < 10 ? "destructive" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {getStockStatus(productoSeleccionado.stock, productoSeleccionado.stockMaximo, productoSeleccionado.stockMinimo).icon}
                                                    {getStockStatus(productoSeleccionado.stock, productoSeleccionado.stockMaximo, productoSeleccionado.stockMinimo).label}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <UnidadMedidaInventarioSelector
                                        value={conversionSeleccionada?.id?.toString() || 0}
                                        id={productoSeleccionado?.id || 0}
                                        onSelect={setConversionSeleccionada}
                                    />
                                    {conversionSeleccionada && (
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Conversión: {conversionSeleccionada.cantidad} {conversionSeleccionada.unidadOrigen} = 1 {conversionSeleccionada.unidadDestino}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            ref={cantidadRef}
                                            placeholder="Cantidad"
                                            value={cantidad}
                                            onChange={(e) => setCantidad(e.target.value)}
                                            disabled={!productoSeleccionado}
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, "").replace(",", ".")
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {conversionSeleccionada
                                                ? `Unidad: ${conversionSeleccionada.unidadDestino}`
                                                : productoSeleccionado?.unidadMedida
                                                    ? `Unidad: ${productoSeleccionado.unidadMedida}`
                                                    : ''}
                                        </p>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                onClick={handleAgregarProducto}
                                                disabled={!productoSeleccionado || !cantidad}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Agregar producto</TooltipContent>
                                    </Tooltip>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {productosIngreso.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Productos Agregados</CardTitle>
                                        <CardDescription>
                                            Total: {totalUnidades} unidades • {totalProductos} productos diferentes
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">{totalProductos} productos</Badge>
                                        <Badge variant="outline">{totalUnidades} unidades</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Unidad</TableHead>
                                            <TableHead>Conversión</TableHead>
                                            <TableHead className="text-center">Stock Actual</TableHead>
                                            <TableHead className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                    Nuevo Stock
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-center">Cantidad</TableHead>
                                            <TableHead className="text-center">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {productosIngreso.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="font-medium">{item.producto.nombre}</div>
                                                    <div className="text-xs text-muted-foreground">{item.producto.sku}</div>
                                                </TableCell>

                                                <TableCell>
                                                    <UnidadMedidaInventarioSelector
                                                        value={item.conversion?.id?.toString() || 0}
                                                        id={item.producto.id}
                                                        onSelect={(conv) => handleActualizarConversion(item.id, conv)}
                                                        disabled={!!item.ordenCompraItemId}
                                                    />

                                                </TableCell>
                                                <TableCell>

                                                    {item.conversion && item.conversion.id ? (
                                                        <div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {item.conversion.cantidad} {item.conversion.unidadOrigen} = 1 {item.conversion.unidadDestino}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                ({item.cantidadConvertida} {item.producto.unidadMedida})
                                                            </div>
                                                        </div>
                                                    ) : (<div className="text-xs text-muted-foreground mt-1">
                                                        Sin Conversión
                                                    </div>)

                                                    }


                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.producto.stock}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="font-semibold text-green-700">

                                                        {Number(item.producto.stock) + Number(item.cantidadConvertida)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Input
                                                        value={item.cantidad}
                                                        onChange={(e) => {
                                                            const nuevaCantidad = Number(e.target.value)
                                                            if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                                                                handleActualizarCantidad(item.id, nuevaCantidad)
                                                            }
                                                        }}
                                                        onInput={(e) => {
                                                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.,]/g, "").replace(",", ".")
                                                        }}
                                                        className="w-20 text-center"
                                                    />

                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setShowDeleteDialog(item.id)}
                                                        type="button"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Estado vacío con información útil */}
                    {productosIngreso.length === 0 && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No hay productos agregados</h3>
                                <p className="text-muted-foreground mb-4">
                                    Selecciona un producto y cantidad para comenzar el ingreso de mercadería
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex gap-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <LoadingButton loading={isPendingCreate} type="submit" disabled={productosIngreso.length === 0}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Ingreso
                                    </LoadingButton>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {productosIngreso.length === 0
                                    ? "Agrega productos para habilitar el guardado"
                                    : `Guardar ${totalProductos} productos (Ctrl+S)`}
                            </TooltipContent>
                        </Tooltip>

                        <Button type="button" variant="link" onClick={() => router.back()}>
                            Volver
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Dialog de confirmación */}
            <AlertDialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el producto del ingreso actual. Podrás agregarlo nuevamente si lo necesitas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => showDeleteDialog && handleEliminarProducto(showDeleteDialog)}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider >
    )
}
