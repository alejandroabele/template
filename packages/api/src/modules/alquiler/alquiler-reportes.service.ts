import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Alquiler } from './entities/alquiler.entity';
import { AlquilerPrecio } from '@/modules/alquiler-precio/entities/alquiler-precio.entity';
import { Factura } from '@/modules/factura/entities/factura.entity';
import { Cobro } from '@/modules/cobro/entities/cobro.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';
import { subMonths, format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importar el locale en español
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AlquilerReportesService {
    constructor(
        @InjectRepository(Alquiler)
        private readonly alquilerRepository: Repository<Alquiler>,
        @InjectRepository(AlquilerPrecio)
        private readonly alquilerPrecioRepository: Repository<AlquilerPrecio>,
        @InjectRepository(Factura)
        private readonly facturaRepository: Repository<Factura>,
        @InjectRepository(Cobro)
        private readonly cobroRepository: Repository<Cobro>,
        @InjectRepository(Archivo)
        private readonly archivoRepository: Repository<Archivo>,
        @InjectRepository(AlquilerRecurso)
        private readonly alquilerRecursoRepository: Repository<AlquilerRecurso>,
    ) { }


    async getFacturacionYCobranza(): Promise<any[]> {
        const today = new Date();
        const months = Array.from({ length: 6 }, (_, i) => subMonths(today, i)).reverse(); // Últimos 6 meses

        // Obtener facturaciones de los últimos 6 meses (solo de alquileres)
        const facturaciones = await this.facturaRepository
            .createQueryBuilder('facturacion')
            .select('MONTH(facturacion.inicioPeriodo)', 'month')
            .addSelect('YEAR(facturacion.inicioPeriodo)', 'year')
            .addSelect('SUM(facturacion.monto)', 'facturados')
            .where('facturacion.modelo = :modelo', { modelo: 'alquiler' })
            .andWhere('facturacion.inicioPeriodo >= :sixMonthsAgo', {
                sixMonthsAgo: subMonths(today, 6),
            })
            .groupBy('YEAR(facturacion.inicioPeriodo), MONTH(facturacion.inicioPeriodo)')
            .getRawMany();

        // Obtener cobranzas de los últimos 6 meses
        const cobranzas = await this.cobroRepository
            .createQueryBuilder('cobranza')
            .select('MONTH(cobranza.inicio_periodo)', 'month')
            .addSelect('YEAR(cobranza.inicio_periodo)', 'year')
            .addSelect('SUM(cobranza.monto)', 'cobrados')
            .where('cobranza.modelo = :modelo', { modelo: 'alquiler' })
            .andWhere('cobranza.inicio_periodo >= :sixMonthsAgo', {
                sixMonthsAgo: subMonths(today, 6),
            })
            .groupBy('YEAR(cobranza.inicio_periodo), MONTH(cobranza.inicio_periodo)')
            .getRawMany();

        // Formatear los datos en el formato esperado
        const data = months.map((monthDate) => {
            const monthKey = format(monthDate, 'MMMM', { locale: es }); // Nombre del mes en español
            const monthNumber = monthDate.getMonth() + 1; // Mes en número (1-12)
            const year = monthDate.getFullYear();

            // Buscar facturaciones y cobranzas para este mes
            const facturacion = facturaciones.find(
                (f) => f.month === monthNumber && f.year === year,
            );
            const cobranza = cobranzas.find(
                (c) => c.month === monthNumber && c.year === year,
            );

            return {
                month: monthKey.charAt(0).toUpperCase() + monthKey.slice(1), // Capitalizar el nombre del mes
                facturados: facturacion ? parseFloat(facturacion.facturados) : 0,
                cobrados: cobranza ? parseFloat(cobranza.cobrados) : 0,
            };
        });

        return data;
    }

    async getCantidadRecursosPorTipo(): Promise<
        { tipo: string; alquileres: number; fill: string }[]
    > {
        const recursosPorTipo = await this.alquilerRecursoRepository
            .createQueryBuilder('recurso')
            .select('recurso.tipo', 'tipo')
            .addSelect('COUNT(recurso.id)', 'alquileres')
            .groupBy('recurso.tipo')
            .getRawMany();

        // Mapear los resultados al formato deseado
        return recursosPorTipo.map((item) => ({
            tipo: item.tipo,
            alquileres: parseInt(item.alquileres, 10),
            fill: `var(--color-${item.tipo})`, // Asignar el color dinámicamente
        }));
    }
    async getCantidadRecursosPorEstado(): Promise<
        { estado: string; cantidad: number }[]
    > {
        const recursosPorEstado = await this.alquilerRecursoRepository
            .createQueryBuilder('recurso')
            .leftJoinAndSelect('recurso.alquileres', 'alquiler') // LEFT JOIN con alquileres
            .select([
                'recurso.id AS recurso_id',
                'CASE WHEN alquiler.estado IS NULL THEN :libre ELSE alquiler.estado END AS estado', // Si no tiene alquiler, es "Libre"
            ])
            .setParameter('libre', 'LIBRE') // Parámetro para el estado "Libre"
            .getRawMany();

        // Contar la cantidad de recursos por estado
        const conteoPorEstado = recursosPorEstado.reduce((acc, item) => {
            const estado = item.estado;
            if (!acc[estado]) {
                acc[estado] = 0;
            }
            acc[estado]++;
            return acc;
        }, {} as Record<string, number>);

        // Formatear los resultados en el formato deseado
        const resultado = Object.entries(conteoPorEstado).map(([estado, cantidad]) => ({
            estado,
            cantidad: Number(cantidad), // Convertir explícitamente a número
        }));

        return resultado;
    }



}
