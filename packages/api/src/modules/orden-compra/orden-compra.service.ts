import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { OrdenCompra } from './entities/orden-compra.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Oferta } from '../oferta/entities/oferta.entity';
import { EstadoCompras } from '../estado-compras/entities/estado-compras.entity';
import { PdfExportService } from '@/services/pdf-export/pdf-export.service';
import { AfipService } from '../afip/afip.service';
import { CONDICION_IVA } from '@/constants/condicion-iva';
import { ESTADO_ORDEN_COMPRA_CODIGOS } from '@/constants/compras';
import { getToday } from '@/helpers/date';
import { OnEvent } from '@nestjs/event-emitter';
import { INVENTARIO } from '@/constants/eventos';
import { OrdenCompraItem } from './entities/orden-compra-item.entity';

@Injectable()
export class OrdenCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private ordenCompraRepository: Repository<OrdenCompra>,
    @InjectRepository(OrdenCompraItem)
    private ordenCompraItemRepository: Repository<OrdenCompraItem>,
    @InjectRepository(Oferta)
    private ofertaRepository: Repository<Oferta>,
    @InjectRepository(EstadoCompras)
    private estadoComprasRepository: Repository<EstadoCompras>,
    private pdfExportService: PdfExportService,
    private afipService: AfipService,
  ) { }

  async create(createOrdenCompraDto: CreateOrdenCompraDto) {
    const { ofertaId } = createOrdenCompraDto;

    // Verificar si ya existe una orden de compra para esta oferta
    const ordenExistente = await this.ordenCompraRepository.findOne({
      where: { ofertaId },
    });

    if (ordenExistente) {
      throw new NotFoundException(`Ya existe una orden de compra (#${ordenExistente.id}) para esta oferta`);
    }

    // Buscar la oferta con sus items
    const oferta = await this.ofertaRepository.findOne({
      where: { id: ofertaId },
      relations: ['items', 'items.inventario'],
    });

    if (!oferta) {
      throw new NotFoundException(`Oferta con ID ${ofertaId} no encontrada`);
    }

    // Buscar el primer estado de tipo ORDEN_COMPRA
    const estadoInicial = await this.estadoComprasRepository.findOne({
      where: { codigo: ESTADO_ORDEN_COMPRA_CODIGOS.OC_EMITIDA },
    });



    // Crear la orden de compra con los datos de la oferta
    const ordenCompra = this.ordenCompraRepository.create({
      ofertaId: oferta.id,
      metodoPagoId: oferta.metodoPagoId,
      plazoPagoId: oferta.plazoPagoId,
      estadoId: estadoInicial?.id,
      fechaEmision: getToday(),
      obs: oferta.observaciones,
      bonificacion: oferta.bonificacion,
      moneda: oferta.moneda,
      items: oferta.items?.map(item => ({
        inventarioId: item.inventarioId,
        inventarioConversionId: item.inventarioConversionId,
        cantidad: item.cantidad,
        precio: item.precio,
        alicuota: item.alicuota,
        descripcion: item.descripcion,
      })),
    });

    const savedOrdenCompra = await this.ordenCompraRepository.save(ordenCompra);


    return savedOrdenCompra;
  }

  async findAll(conditions: FindManyOptions<OrdenCompra>): Promise<OrdenCompra[]> {
    const qb = this.ordenCompraRepository.createQueryBuilder('ordenCompra');

    // Cargar relaciones necesarias
    qb.leftJoinAndSelect('ordenCompra.oferta', 'oferta');
    qb.leftJoinAndSelect('oferta.items', 'ofertaItems');
    qb.leftJoinAndSelect('ofertaItems.solcomItem', 'solcomItem');
    qb.leftJoinAndSelect('solcomItem.solcom', 'solcom');
    qb.leftJoinAndSelect('ordenCompra.estado', 'estado');
    qb.leftJoinAndSelect('oferta.proveedor', 'proveedor');
    qb.leftJoinAndSelect('ordenCompra.items', 'items');
    qb.leftJoinAndSelect('items.inventario', 'inventario');
    qb.leftJoinAndSelect('ordenCompra.metodoPago', 'metodoPago');
    qb.leftJoinAndSelect('ordenCompra.plazoPago', 'plazoPago');

    // Extraer filtro de solcomItem.solcom.id si existe
    const { where = {}, order = {}, take, skip } = conditions;
    let solcomIdFilter: number | undefined;
    const filteredWhere = { ...where };

    if (filteredWhere['solcomItem.solcom.id']) {
      solcomIdFilter = Number(filteredWhere['solcomItem.solcom.id']);
      delete filteredWhere['solcomItem.solcom.id'];
    }
    //TODO: ESTO ESTA RE CONTRA MAL HECHO, HACER BIENLO DESPUES

    // Aplicar filtros normales
    Object.entries(filteredWhere).forEach(([key, value]) => {
      if (key.includes('.')) {
        const [relation, field] = key.split('.');
        const searchValue = typeof value === 'string' ? value.toLowerCase() : value;
        qb.andWhere(`LOWER(${relation}.${field}) LIKE :${key}`, {
          [key]: `%${searchValue}%`,
        });
      } else if (Array.isArray(value) && value.length === 2) {
        qb.andWhere(`ordenCompra.${key} BETWEEN :${key}_min AND :${key}_max`, {
          [`${key}_min`]: value[0] ?? Number.MIN_SAFE_INTEGER,
          [`${key}_max`]: value[1] ?? Number.MAX_SAFE_INTEGER,
        });
      } else if (typeof value === 'string') {
        qb.andWhere(`LOWER(ordenCompra.${key}) LIKE :${key}`, {
          [key]: `%${value.toLowerCase()}%`,
        });
      } else {
        qb.andWhere(`ordenCompra.${key} = :${key}`, { [key]: value });
      }
    });

    // Aplicar filtro de SOLCOM si existe
    if (solcomIdFilter) {
      qb.andWhere('solcom.id = :solcomId', { solcomId: solcomIdFilter });
    }

    // Aplicar ordenamiento
    Object.entries(order).forEach(([key, dir]) => {
      const direction = (dir as string).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      if (key.includes('.')) {
        const [relation, field] = key.split('.');
        qb.addOrderBy(`${relation}.${field}`, direction);
      } else {
        qb.addOrderBy(`ordenCompra.${key}`, direction);
      }
    });

    // Aplicar paginación
    if (take) qb.take(Number(take));
    if (skip) qb.skip(Number(skip));

    return await qb.getMany();
  }

  async findOne(id: number) {
    return await this.ordenCompraRepository.findOneBy({ id });
  }

  async update(id: number, updateOrdenCompraDto: UpdateOrdenCompraDto) {
    await this.ordenCompraRepository.update({ id }, updateOrdenCompraDto);
    return await this.ordenCompraRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const ordenCompra = await this.findOne(id);
    await this.ordenCompraRepository.delete({ id });
    return ordenCompra;
  }

  async cancelar(id: number) {
    // Buscar la orden de compra
    const ordenCompra = await this.ordenCompraRepository.findOne({
      where: { id },
      relations: ['estado'],
    });

    if (!ordenCompra) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    // Validar que el estado actual sea OC_EMITIDA
    if (ordenCompra.estado?.codigo !== ESTADO_ORDEN_COMPRA_CODIGOS.OC_EMITIDA) {
      throw new NotFoundException('Solo se pueden cancelar órdenes de compra en estado EMITIDA');
    }

    // Buscar el estado de cancelada
    const estadoCancelada = await this.estadoComprasRepository.findOne({
      where: { codigo: ESTADO_ORDEN_COMPRA_CODIGOS.OC_CANCELADA },
    });

    if (!estadoCancelada) {
      throw new NotFoundException('Estado OC_CANCELADA no encontrado');
    }

    // Actualizar el estado de la orden de compra
    await this.ordenCompraRepository.update(
      { id },
      { estadoId: estadoCancelada.id }
    );

    return await this.findOne(id);
  }

  async generatePdf(id: number): Promise<Buffer> {
    // Optimización: usar query builder con leftJoinAndSelect para hacer una sola query SQL
    const startQuery = Date.now();

    const ordenCompra = await this.ordenCompraRepository
      .createQueryBuilder('oc')
      .leftJoinAndSelect('oc.oferta', 'oferta')
      .leftJoinAndSelect('oferta.proveedor', 'proveedor')
      .leftJoinAndSelect('oferta.items', 'ofertaItems')
      .leftJoinAndSelect('ofertaItems.solcomItem', 'solcomItem')
      .leftJoinAndSelect('solcomItem.solcom', 'solcom')
      .leftJoinAndSelect('oc.items', 'items')
      .leftJoinAndSelect('items.inventario', 'inventario')
      .leftJoinAndSelect('oc.metodoPago', 'metodoPago')
      .leftJoinAndSelect('oc.plazoPago', 'plazoPago')
      .leftJoinAndSelect('oc.estado', 'estado')
      .where('oc.id = :id', { id })
      .orderBy('items.id', 'DESC')
      .getOne();

    const endQuery = Date.now();
    console.log(`⏱️ Query de orden de compra tardó: ${endQuery - startQuery}ms`);

    if (!ordenCompra) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    // Obtener datos actualizados de AFIP
    const cuit = ordenCompra.oferta?.proveedor?.cuit;
    let esResponsableInscripto = false;
    let condicionIva = 'NO DISPONIBLE';

    if (cuit) {
      try {
        const padronData = await this.afipService.getPadron(cuit);

        // Obtener la condición IVA
        const codigoCondicion = padronData?.condicionFrenteIva;
        if (codigoCondicion) {
          condicionIva = CONDICION_IVA[codigoCondicion] || codigoCondicion;
        }

        // Solo los Responsables Inscriptos (código 30) pagan IVA
        esResponsableInscripto = codigoCondicion === '30';
      } catch (error) {
        console.error('Error al consultar AFIP:', error);
        // Si falla AFIP, no aplicar IVA por seguridad
        esResponsableInscripto = false;
        condicionIva = 'ERROR AL CONSULTAR';
      }
    }

    // Calcular subtotal, IVA y total
    const items = ordenCompra.items?.map(item => {
      const cantidad = parseFloat(item.cantidad || '0');
      const precioUnitario = parseFloat(item.precio || '0');
      const iva = parseFloat(item.alicuota || '21');
      const importe = cantidad * precioUnitario;
      const descripcionAdicional = item.descripcion || '';
      return {
        codigo: item.inventario?.sku || '',
        descripcion: item.inventario?.nombre || '',
        descripcionAdicional: descripcionAdicional,
        cantidad: cantidad.toFixed(2),
        iva: iva.toFixed(2),
        precioUnitario: precioUnitario.toFixed(2),
        importe: importe.toFixed(2),
      };
    }) || [];

    const subtotal = items.reduce((acc, item) => acc + parseFloat(item.importe), 0);

    // Calcular descuento de bonificación
    const bonificacionStr = ordenCompra.bonificacion || '';
    let descuentoBonificacion = 0;
    if (bonificacionStr && bonificacionStr.trim() !== '') {
      if (bonificacionStr.includes('%')) {
        const porcentaje = parseFloat(bonificacionStr.replace('%', '').trim());
        descuentoBonificacion = (subtotal * porcentaje) / 100;
      } else {
        descuentoBonificacion = parseFloat(bonificacionStr);
      }
    }

    const subtotalConDescuento = subtotal - descuentoBonificacion;

    const ivaTotal = items.reduce((acc, item) => {
      const importe = parseFloat(item.importe);
      const tasaIva = parseFloat(item.iva) / 100;
      return acc + (importe * tasaIva);
    }, 0);

    // Calcular IVA sobre el subtotal con descuento
    const ivaConDescuento = descuentoBonificacion > 0
      ? (subtotalConDescuento * ivaTotal) / subtotal
      : ivaTotal;

    // Si no es responsable inscripto, el total no incluye IVA
    const total = esResponsableInscripto
      ? subtotalConDescuento + ivaConDescuento
      : subtotalConDescuento;

    const data = {
      id: ordenCompra.id,
      numeroOrden: String(ordenCompra.id).padStart(11, '0'),
      fechaEmision: ordenCompra.fechaEmision,
      proveedor: {
        codigo: ordenCompra.oferta?.proveedor?.id || '',
        razonSocial: ordenCompra.oferta?.proveedor?.razonSocial || '',
        direccion: ordenCompra.oferta?.proveedor?.domicilio || '',
        ciudad: ordenCompra.oferta?.proveedor?.localidad || '',
        cuit: ordenCompra.oferta?.proveedor?.cuit || '',
        condicionIva: condicionIva,
      },
      metodoPago: ordenCompra.metodoPago?.nombre || '',
      plazoPago: ordenCompra.plazoPago?.descripcion || '',
      observaciones: ordenCompra.obs || '',
      items,
      subtotal: subtotal.toFixed(2),
      bonificacion: descuentoBonificacion.toFixed(2),
      iva: esResponsableInscripto ? ivaConDescuento.toFixed(2) : 'NO APLICA',
      total: total.toFixed(2),
      solcomId: ordenCompra.oferta?.items
        ? [...new Set(
          ordenCompra.oferta.items
            .map(item => item.solcomItem?.solcom?.id)
            .filter(id => id !== null && id !== undefined)
        )].join(', ')
        : '',
      presupuestoId: '', // Si tienes relación con presupuesto, agrégalo aquí
      publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000'
    };
    return await this.pdfExportService.generatePdf('orden-compra', data);
  }

  @OnEvent(INVENTARIO.INGRESO_MERCADERIA, { async: true })
  async handleIngresoMercaderia(payload: { ordenCompraId: number }) {
    const { ordenCompraId } = payload;
    // Buscar todos los items de la orden de compra
    const items = await this.ordenCompraItemRepository.find({
      where: { ordenCompraId },
    });

    if (!items || items.length === 0) {
      return;
    }

    // Verificar si hay algún item con recepcionado = 0 (false)
    const hayItemsSinRecepcionar = items.some(item => !item.recepcionado);

    // Buscar el estado correspondiente
    const codigoEstado = hayItemsSinRecepcionar
      ? ESTADO_ORDEN_COMPRA_CODIGOS.OC_RECEP_PARCIAL
      : ESTADO_ORDEN_COMPRA_CODIGOS.OC_RECEPCIONADA;

    const nuevoEstado = await this.estadoComprasRepository.findOne({
      where: { codigo: codigoEstado },
    });

    console.log({ nuevoEstado })
    if (!nuevoEstado) {
      console.error(`Estado con código ${codigoEstado} no encontrado`);
      return;
    }

    // Actualizar el estado de la orden de compra
    await this.ordenCompraRepository.update(
      { id: ordenCompraId },
      { estadoId: nuevoEstado.id }
    );
  }

  async updateItem(itemId: number, updateData: any): Promise<OrdenCompraItem> {
    const item = await this.ordenCompraItemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item con ID ${itemId} no encontrado`);
    }

    // Actualizar solo los campos permitidos
    if (updateData.descripcion !== undefined) {
      item.descripcion = updateData.descripcion;
    }

    return this.ordenCompraItemRepository.save(item);
  }

}
