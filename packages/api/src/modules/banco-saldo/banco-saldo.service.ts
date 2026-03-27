import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateBancoSaldoDto } from './dto/create-banco-saldo.dto';
import { UpdateBancoSaldoDto } from './dto/update-banco-saldo.dto';
import { BancoSaldo } from './entities/banco-saldo.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getToday } from '@/helpers/date';


@Injectable()
export class BancoSaldoService {
  constructor(
    @InjectRepository(BancoSaldo)
    private bancoSaldoRepository: Repository<BancoSaldo>,
    private eventEmitter: EventEmitter2

  ) { }

  async create(createBancoSaldoDto: CreateBancoSaldoDto) {
    return await this.bancoSaldoRepository.save(createBancoSaldoDto);
  }

  async findAll(conditions: FindManyOptions<BancoSaldo>): Promise<BancoSaldo[]> {
    return await this.bancoSaldoRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: ['banco'],
    });
  }

  async findOne(id: number) {
    return await this.bancoSaldoRepository.findOne({
      where: { id },
      relations: ['banco'],
    });
  }

  async update(id: number, updateBancoSaldoDto: UpdateBancoSaldoDto) {
    await this.bancoSaldoRepository.update({ id }, updateBancoSaldoDto);
    const bancoSaldo = await this.bancoSaldoRepository.findOne({
      where: { id },
      relations: ['banco'],
    });
    // this.eventEmitter.emit(BANCOS.SALDO_ACTUALIZADO, bancoSaldo);
    return bancoSaldo

  }

  async remove(id: number) {
    return await this.bancoSaldoRepository.delete({ id });
  }

  /**
   * Obtener el último saldo de un banco por su ID
   */
  async getUltimoSaldoPorBanco(bancoId: number): Promise<BancoSaldo | null> {
    return await this.bancoSaldoRepository.findOne({
      where: { bancoId },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Actualizar múltiples saldos de hoy de forma masiva
   */
  async actualizarSaldosHoy(saldos: Array<{ bancoId: number; monto: number; descubiertoMonto: number }>): Promise<void> {
    for (const { bancoId, monto, descubiertoMonto } of saldos) {
      // Obtener el último saldo del banco
      const ultimoSaldo = await this.getUltimoSaldoPorBanco(bancoId);

      // Calcular el ajuste basado en la diferencia entre el nuevo monto y el último saldo
      const ajuste = monto - parseFloat(ultimoSaldo?.monto?.toString() || '0');

      // Usar el método existente para actualizar
      await this.actualizarSaldoHoy(bancoId, ajuste, descubiertoMonto);
    }
  }

  /**
   * Actualizar saldo de hoy para un banco
   * Si existe un saldo para la fecha de hoy, lo actualiza.
   * Si no existe, crea un nuevo registro con fecha de hoy.
   */
  async actualizarSaldoHoy(bancoId: number, ajuste: number, descubiertoMonto?: number): Promise<void> {
    // Obtener fecha actual en formato YYYY-MM-DD
    const fechaHoy = getToday();

    // Obtener el último saldo del banco (puede ser de hoy o anterior)
    const ultimoSaldo = await this.getUltimoSaldoPorBanco(bancoId);

    // Calcular el monto actual (último saldo + ajuste)
    const montoActual = parseFloat(ultimoSaldo?.monto?.toString() || '0');
    const nuevoMonto = montoActual + ajuste;

    // Si no se proporciona descubiertoMonto, heredar del último saldo
    const descubiertoMontoFinal = descubiertoMonto !== undefined
      ? descubiertoMonto
      : parseFloat(ultimoSaldo?.descubiertoMonto?.toString() || '0');

    // Calcular descubiertoUso: parte negativa del monto (si existe)
    const descubiertoUso = nuevoMonto < 0 ? Math.abs(nuevoMonto) : 0;

    // Verificar si el último saldo es de hoy
    const esDeHoy = ultimoSaldo?.fecha === fechaHoy;

    if (esDeHoy) {
      // Actualizar el registro existente de hoy
      await this.bancoSaldoRepository.update(
        { id: ultimoSaldo.id },
        {
          monto: nuevoMonto,
          descubiertoMonto: descubiertoMontoFinal,
          descubiertoUso: descubiertoUso,
        }
      );
    } else {
      // Crear un nuevo registro para hoy
      await this.bancoSaldoRepository.save({
        bancoId,
        monto: nuevoMonto,
        fecha: fechaHoy,
        descubiertoUso: descubiertoUso,
        descubiertoMonto: descubiertoMontoFinal,
      });
    }
  }

  async getUltimosSaldos() {
    // Obtener el último saldo de cada banco (todos, incluidos los que no se incluyen en total)
    // IMPORTANTE: Siempre devolver todos los bancos, incluso si no tienen saldos
    const query = `
      SELECT
        b.id as banco_id,
        b.nombre as banco_nombre,
        COALESCE(bs.monto, '0.00') as monto,
        bs.fecha,
        b.incluir_en_total,
        COALESCE(bs.descubierto_monto, '0') as descubierto_monto,
        COALESCE(bs.descubierto_uso, '0') as descubierto_uso
      FROM banco b
      LEFT JOIN (
        SELECT bs2.*
        FROM banco_saldo bs2
        INNER JOIN (
          SELECT banco_id, MAX(fecha) as max_fecha
          FROM banco_saldo
          GROUP BY banco_id
        ) as ultimo ON bs2.banco_id = ultimo.banco_id AND bs2.fecha = ultimo.max_fecha
      ) as bs ON b.id = bs.banco_id
      ORDER BY b.incluir_en_total DESC, b.nombre ASC
    `;

    const saldos = await this.bancoSaldoRepository.query(query);

    // Calcular dos totales diferentes para los bancos con incluir_en_total = 1:
    // 1. total: suma de saldos reales (monto) - puede ser negativo
    // 2. disponible: suma de crédito disponible (descubierto_monto - descubierto_uso)
    const total = saldos
      .filter(saldo => saldo.incluir_en_total === 1)
      .reduce((sum, saldo) => {
        const saldoMonto = parseFloat(saldo.monto || 0);
        return sum + saldoMonto;
      }, 0);

    const disponible = saldos
      .filter(saldo => saldo.incluir_en_total === 1)
      .reduce((sum, saldo) => {
        const descubiertoMonto = parseFloat(saldo.descubierto_monto || 0);
        const descubiertoUso = parseFloat(saldo.descubierto_uso || 0);

        // Crédito disponible = descubierto total - descubierto usado
        const creditoDisponible = descubiertoMonto - descubiertoUso;

        return sum + creditoDisponible;
      }, 0);

    return {
      saldos,
      total,
      disponible
    };
  }

  async getSaldosPorFechas(fechas: string[]) {
    // Para cada fecha, obtener el último saldo de cada banco hasta esa fecha
    // IMPORTANTE: Siempre devolver todos los bancos, incluso si no tienen saldos
    const resultados = {};

    for (const fecha of fechas) {
      const query = `
        SELECT
          b.id as banco_id,
          b.nombre as banco_nombre,
          COALESCE(bs.monto, '0.00') as monto,
          COALESCE(bs.fecha, ?) as fecha,
          b.incluir_en_total,
          COALESCE(bs.descubierto_monto, '0') as descubierto_monto,
          COALESCE(bs.descubierto_uso, '0') as descubierto_uso
        FROM banco b
        LEFT JOIN (
          SELECT bs2.*
          FROM banco_saldo bs2
          INNER JOIN (
            SELECT banco_id, MAX(fecha) as max_fecha
            FROM banco_saldo
            WHERE fecha <= ?
            GROUP BY banco_id
          ) as ultimo ON bs2.banco_id = ultimo.banco_id AND bs2.fecha = ultimo.max_fecha
        ) as bs ON b.id = bs.banco_id
        ORDER BY b.incluir_en_total DESC, b.nombre ASC
      `;

      const saldos = await this.bancoSaldoRepository.query(query, [fecha, fecha]);

      // Calcular dos totales diferentes para los bancos con incluir_en_total = 1:
      // 1. total: suma de saldos reales (monto) - puede ser negativo
      // 2. disponible: suma de crédito disponible (descubierto_monto - descubierto_uso)
      const total = saldos
        .filter(saldo => saldo.incluir_en_total === 1)
        .reduce((sum, saldo) => {
          const saldoMonto = parseFloat(saldo.monto || 0);
          return sum + saldoMonto;
        }, 0);

      const disponible = saldos
        .filter(saldo => saldo.incluir_en_total === 1)
        .reduce((sum, saldo) => {
          const descubiertoMonto = parseFloat(saldo.descubierto_monto || 0);
          const descubiertoUso = parseFloat(saldo.descubierto_uso || 0);

          // Crédito disponible = descubierto total - descubierto usado
          const creditoDisponible = descubiertoMonto - descubiertoUso;

          return sum + creditoDisponible;
        }, 0);

      resultados[fecha] = {
        saldos,
        total,
        disponible
      };
    }

    return resultados;
  }
}
