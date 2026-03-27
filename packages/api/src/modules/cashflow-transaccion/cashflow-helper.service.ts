import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CashflowHelperService {
    constructor(private readonly dataSource: DataSource) { }

    /**
     * Calcula el total de descubiertos usados de todos los bancos hasta una fecha específica
     * @param fecha Fecha hasta la cual buscar los últimos descubiertos
     * @returns Total de descubiertos usados
     */
    async calcularDescubiertosUsados(fecha: string): Promise<number> {
        const descubiertosResult = await this.dataSource.query(`
          SELECT
            bs.banco_id,
            COALESCE(bs.descubierto_uso, 0) as descubierto_uso
          FROM banco_saldo bs
          INNER JOIN (
            SELECT banco_id, MAX(fecha) as max_fecha
            FROM banco_saldo
            WHERE fecha <= ?
            GROUP BY banco_id
          ) latest ON bs.banco_id = latest.banco_id AND bs.fecha = latest.max_fecha
        `, [fecha]);

        return descubiertosResult.reduce((sum: number, row: any) => {
            return sum + parseFloat(row.descubierto_uso || 0);
        }, 0);
    }
}
