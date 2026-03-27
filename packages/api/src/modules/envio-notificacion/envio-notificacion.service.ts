import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { getToday, formatDate } from '@/helpers/date';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { EnvioNotificacion } from './entities/envio-notificacion.entity';
import { PlantillaNotificacion } from '@/modules/plantilla-notificacion/entities/plantilla-notificacion.entity';
import { Cliente } from '@/modules/cliente/entities/cliente.entity';
import { Factura } from '@/modules/factura/entities/factura.entity';
import { EnviarDto } from './dto/enviar.dto';
import { PreviewNotificacionDto } from './dto/preview-notificacion.dto';
import { EmailService } from '@/services/email/email.service';
import { tablaEmail } from '@/helpers/email-html';

/**
 * Mapa de tipo de contacto → campo en la entidad Cliente.
 * Agregar aquí nuevos tipos de contacto para que queden disponibles
 * tanto en el preview como en el envío.
 */
const CONTACTOS_CLIENTE: Record<string, keyof Cliente> = {
    email: 'email',
    emailPagoProveedores: 'emailPagoProveedores',
    telefono: 'telefono',
    telefonoPagoProveedores: 'telefonoPagoProveedores',
};

/** Interfaz mínima que cualquier entidad notificable debe cumplir */
interface EntidadNotificable {
    id: number;
    clienteId?: number;
    cliente?: Cliente;
}

@Injectable()
export class EnvioNotificacionService {
    constructor(
        @InjectRepository(EnvioNotificacion)
        private repo: Repository<EnvioNotificacion>,
        @InjectRepository(PlantillaNotificacion)
        private plantillaRepo: Repository<PlantillaNotificacion>,
        @InjectRepository(Factura)
        private facturaRepo: Repository<Factura>,
        private emailService: EmailService,
    ) { }

    // ─── CRUD ───────────────────────────────────────────────────────────────────

    async findAll(conditions: FindManyOptions<EnvioNotificacion>) {
        return await this.repo.find({
            ...conditions,
            where: transformToGenericFilters(conditions.where),
            relations: ['plantilla'],
        });
    }

    async findOne(id: number) {
        return await this.repo.findOne({
            where: { id },
            relations: ['plantilla', 'createdByUser'],
        });
    }

    async remove(id: number) {
        const entity = await this.findOne(id);
        await this.repo.delete({ id });
        return entity;
    }

    // ─── Búsqueda de entidades por modelo ───────────────────────────────────────

    private async buscarEntidades(
        modelo: string,
        filtros: Record<string, unknown> | undefined,
    ): Promise<EntidadNotificable[]> {
        const where = filtros ? transformToGenericFilters(filtros) : {};

        switch (modelo) {
            case 'factura':
                return this.facturaRepo.find({ where, relations: ['cliente'] });

            // Agregar nuevos modelos aquí:
            // case 'presupuesto':
            //     return this.presupuestoRepo.find({ where, relations: ['cliente'] });

            default:
                throw new BadRequestException(`Modelo '${modelo}' no soportado para notificaciones`);
        }
    }

    // ─── Motor de interpolación por modelo ──────────────────────────────────────

    resolverVariables(
        modelo: string,
        template: string,
        cliente: Cliente,
        entidades: EntidadNotificable[],
    ): string {
        if (!template) return '';

        switch (modelo) {
            case 'factura':
                return this.resolverVariablesFactura(template, cliente, entidades as Factura[]);

            // Agregar nuevos modelos aquí:
            // case 'presupuesto':
            //     return this.resolverVariablesPresupuesto(template, cliente, entidades as Presupuesto[]);

            default:
                return template;
        }
    }

    private resolverVariablesFactura(
        template: string,
        cliente: Cliente,
        facturas: Factura[],
    ): string {
        const totalDeuda = facturas.reduce((sum, f) => sum + Number(f.monto ?? 0), 0);
        const totalImporteBruto = facturas.reduce((sum, f) => sum + Number(f.importeBruto ?? 0), 0);
        const formatearMonto = (monto: number) =>
            `$${Number(monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

        const listaFacturas = tablaEmail(
            [
                { titulo: 'N° Factura' },
                { titulo: 'Fecha' },
                { titulo: 'Total', alinear: 'derecha', noSalto: true, negrita: true },
            ],
            facturas.map((f) => [
                f.folio ?? '-',
                formatDate(f.fecha) ?? '-',
                formatearMonto(Number(f.importeBruto ?? 0)),
            ]),
        );

        const primeraFactura = facturas[0];

        const variables: Record<string, string> = {
            '{{cliente_nombre}}': cliente?.nombre ?? '',
            '{{cliente_email}}': cliente?.email ?? '',
            '{{cliente_tel}}': cliente?.telefono ?? '',
            '{{cliente_razon_social}}': cliente?.razonSocial ?? '',
            '{{cliente_cuit}}': cliente?.cuit ?? '',
            '{{cliente_contacto}}': cliente?.contacto ?? '',
            '{{total_facturas}}': String(facturas.length),
            '{{total_deuda}}': formatearMonto(totalDeuda),
            '{{total_importe_bruto}}': formatearMonto(totalImporteBruto),
            '{{lista_facturas}}': listaFacturas,
            '{{factura_folio}}': primeraFactura?.folio ?? '',
            '{{factura_monto}}': formatearMonto(Number(primeraFactura?.monto ?? 0)),
            '{{factura_fecha}}': formatDate(primeraFactura?.fecha) ?? '',
            '{{factura_vencimiento}}': formatDate(primeraFactura?.fechaVencimiento) ?? '',
            '{{factura_estado}}': primeraFactura?.estado ?? '',
            '{{factura_alicuota}}': primeraFactura?.alicuota ?? '',
            '{{factura_importe_bruto}}': formatearMonto(Number(primeraFactura?.importeBruto ?? 0)),
        };

        return Object.entries(variables).reduce(
            (resultado, [variable, valor]) =>
                resultado.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), () => valor),
            template,
        );
    }

    // ─── Preview ─────────────────────────────────────────────────────────────────
    // Retorna la lista de clientes que se notificarían con los filtros dados,
    // sin guardar nada en BD.

    async preview(dto: PreviewNotificacionDto) {
        const entidades = await this.buscarEntidades(dto.modelo, dto.filtros);

        const porCliente = new Map<number, EntidadNotificable[]>();
        for (const entidad of entidades) {
            if (!entidad.clienteId || !entidad.cliente) continue;
            if (!porCliente.has(entidad.clienteId)) {
                porCliente.set(entidad.clienteId, []);
            }
            porCliente.get(entidad.clienteId).push(entidad);
        }

        return Array.from(porCliente.entries()).map(([clienteId, entidadesCliente]) => {
            const cliente = entidadesCliente[0].cliente;
            const contactos = Object.fromEntries(
                Object.entries(CONTACTOS_CLIENTE).map(([tipo, campo]) => [tipo, cliente[campo] ?? null]),
            );
            return {
                clienteId,
                nombre: cliente.nombre,
                ...contactos,
                cantidadEntidades: entidadesCliente.length,
            };
        });
    }

    // ─── Enviar ──────────────────────────────────────────────────────────────────
    // Trabaja por filtros sobre el modelo indicado.
    // Si se especifica clienteIds, solo notifica a esos clientes.

    async enviar(dto: EnviarDto): Promise<{ total: number; registros: number }> {
        const plantilla = await this.plantillaRepo.findOne({
            where: { id: dto.plantillaId },
        });
        if (!plantilla) {
            throw new NotFoundException(`Plantilla ${dto.plantillaId} no encontrada`);
        }

        const entidades = await this.buscarEntidades(dto.modelo, dto.filtros);

        // Agrupar por clienteId (solo entidades con cliente asignado)
        const porCliente = new Map<number, EntidadNotificable[]>();
        for (const entidad of entidades) {
            if (!entidad.clienteId || !entidad.cliente) continue;
            if (!porCliente.has(entidad.clienteId)) {
                porCliente.set(entidad.clienteId, []);
            }
            porCliente.get(entidad.clienteId).push(entidad);
        }

        // Si se especifican clienteIds, filtrar solo esos clientes
        if (dto.clienteIds?.length) {
            const permitidos = new Set(dto.clienteIds);
            for (const clienteId of porCliente.keys()) {
                if (!permitidos.has(clienteId)) porCliente.delete(clienteId);
            }
        }

        const defaultContacto = dto.canal === 'email' ? 'email' : 'telefono';
        const tiposContacto = dto.tiposContacto?.length ? dto.tiposContacto : [defaultContacto];

        let totalRegistros = 0;

        for (const [, entidadesCliente] of porCliente.entries()) {
            const cliente = entidadesCliente[0]?.cliente;
            if (!cliente) continue;

            const cuerpoResuelto = this.resolverVariables(
                dto.modelo,
                plantilla.cuerpo,
                cliente,
                entidadesCliente,
            );
            const asuntoResuelto = plantilla.asunto
                ? this.resolverVariables(dto.modelo, plantilla.asunto, cliente, entidadesCliente)
                : null;

            const contactosDestino: string[] = tiposContacto
                .map((tipo) => {
                    const campo = CONTACTOS_CLIENTE[tipo];
                    return campo ? (cliente[campo] as string) : null;
                })
                .filter(Boolean) as string[];

            // 1 registro por cliente: modeloId es null si agrupa varias entidades
            const modeloId = entidadesCliente.length === 1 ? entidadesCliente[0].id : null;

            for (const emailDestinatario of contactosDestino.length ? contactosDestino : [null]) {
                let estado: 'enviado' | 'error' = 'enviado';
                let error: string | null = null;

                try {
                    if (dto.canal === 'email' && emailDestinatario) {
                        const para = dto.emailActivo ? emailDestinatario : (dto.emailTest || null);
                        if (para) {
                            await this.emailService.enviar({
                                para,
                                asunto: asuntoResuelto ?? plantilla.asunto ?? '(sin asunto)',
                                html: cuerpoResuelto,
                                from: dto.from || undefined,
                            });
                        }
                    }
                } catch (err) {
                    estado = 'error';
                    error = err instanceof Error ? err.message : String(err);
                }

                await this.repo.save({
                    plantillaNotificacionId: plantilla.id,
                    modelo: dto.modelo,
                    modeloId,
                    canal: dto.canal,
                    estado,
                    asuntoResuelto,
                    cuerpoResuelto,
                    fechaEnvio: getToday(),
                    emailDestinatario,
                    error,
                });

                totalRegistros++;
            }
        }

        return {
            total: porCliente.size,
            registros: totalRegistros,
        };
    }
}
