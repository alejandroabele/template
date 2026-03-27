import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { TransferirBancoDto } from './dto/transferir-banco.dto';
import { Banco } from './entities/banco.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { BancoSaldo } from '../banco-saldo/entities/banco-saldo.entity';
import { CashflowTransaccion } from '../cashflow-transaccion/entities/cashflow-transaccion.entity';
import { CashflowCategoria } from '../cashflow-categoria/entities/cashflow-categoria.entity';
import { getToday } from '@/helpers/date';
import { BancoSaldoService } from '../banco-saldo/banco-saldo.service';

@Injectable()
export class BancoService {
  constructor(
    @InjectRepository(Banco)
    private bancoRepository: Repository<Banco>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    @InjectRepository(BancoSaldo)
    private bancoSaldoRepository: Repository<BancoSaldo>,
    @InjectRepository(CashflowTransaccion)
    private cashflowTransaccionRepository: Repository<CashflowTransaccion>,
    @InjectRepository(CashflowCategoria)
    private cashflowCategoriaRepository: Repository<CashflowCategoria>,
    @Inject(forwardRef(() => BancoSaldoService))
    private bancoSaldoService: BancoSaldoService,
  ) { }

  async create(createBancoDto: CreateBancoDto) {
    return await this.bancoRepository.save(createBancoDto);
  }

  async findAll(conditions: FindManyOptions<Banco>): Promise<Banco[]> {
    const bancos = await this.bancoRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
    });

    // Cargar logo para cada banco
    for (const banco of bancos) {
      const logoFiles = await this.archivoRepository.find({
        where: {
          modelo: 'banco',
          modeloId: banco.id,
          tipo: 'logo',
        },
        order: {
          id: 'DESC',
        },
      });
      banco['logo'] = logoFiles.length > 0 ? logoFiles[0] : null;
    }

    return bancos;
  }

  async findOne(id: number) {
    const banco = await this.bancoRepository.findOneBy({ id });

    // Cargar logo del banco
    const logoFiles = await this.archivoRepository.find({
      where: {
        modelo: 'banco',
        modeloId: banco.id,
        tipo: 'logo',
      },
      order: {
        id: 'DESC',
      },
    });
    banco['logo'] = logoFiles.length > 0 ? logoFiles[0] : null;
    return banco;
  }

  async update(id: number, updateBancoDto: UpdateBancoDto) {
    await this.bancoRepository.update({ id }, updateBancoDto);
    return await this.bancoRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.bancoRepository.delete({ id });
  }

  /**
   * Transferir fondos entre bancos
   * Aplica las reglas de negocio según incluirEnTotal de cada banco
   */
  async transferir(dto: TransferirBancoDto) {
    const { bancoOrigenId, bancoDestinoId, monto } = dto;

    // Validar que no sean el mismo banco
    if (bancoOrigenId === bancoDestinoId) {
      throw new BadRequestException('No se puede transferir al mismo banco');
    }

    // Obtener bancos
    const bancoOrigen = await this.bancoRepository.findOneBy({ id: bancoOrigenId });
    const bancoDestino = await this.bancoRepository.findOneBy({ id: bancoDestinoId });

    if (!bancoOrigen || !bancoDestino) {
      throw new BadRequestException('Uno o ambos bancos no existen');
    }

    // Validar monto positivo
    if (monto <= 0) {
      throw new BadRequestException('El monto debe ser mayor a cero');
    }

    // Obtener fecha actual en formato YYYY-MM-DD
    const fechaHoy = getToday();

    // Determinar la regla de negocio a aplicar
    const origenIncluyeTotal = bancoOrigen.incluirEnTotal;
    const destinoIncluyeTotal = bancoDestino.incluirEnTotal;



    // REGLA 1: Banco → Banco (ambos con incluirEnTotal = true)
    if (origenIncluyeTotal && destinoIncluyeTotal) {
      console.log('Aplicando REGLA 1: Banco → Banco (ambos con incluirEnTotal = true)', monto, -monto);
      await this.bancoSaldoService.actualizarSaldoHoy(bancoOrigenId, -monto);
      await this.bancoSaldoService.actualizarSaldoHoy(bancoDestinoId, monto);
      // NO crear transacción en cashflow
    }
    // REGLA 2: Banco con incluirEnTotal = false → Banco con incluirEnTotal = true
    else if (!origenIncluyeTotal && destinoIncluyeTotal) {
      await this.bancoSaldoService.actualizarSaldoHoy(bancoOrigenId, -monto);
      await this.bancoSaldoService.actualizarSaldoHoy(bancoDestinoId, monto);

      // Crear transacción de INGRESO con código INVERS_INGRESO
      await this.crearTransaccionInversion('INVERS_INGRESO', monto, fechaHoy, bancoDestinoId, bancoOrigen.nombre, bancoDestino.nombre);
    }
    // REGLA 3: Banco con incluirEnTotal = true → Banco con incluirEnTotal = false
    else if (origenIncluyeTotal && !destinoIncluyeTotal) {
      await this.bancoSaldoService.actualizarSaldoHoy(bancoOrigenId, -monto);
      await this.bancoSaldoService.actualizarSaldoHoy(bancoDestinoId, monto);

      // Crear transacción de EGRESO con código INVERS_EGRESO
      await this.crearTransaccionInversion('INVERS_EGRESO', monto, fechaHoy, bancoOrigenId, bancoOrigen.nombre, bancoDestino.nombre);
    }
    // REGLA 4: Banco con incluirEnTotal = false → Banco con incluirEnTotal = false
    else {
      await this.bancoSaldoService.actualizarSaldoHoy(bancoOrigenId, -monto);
      await this.bancoSaldoService.actualizarSaldoHoy(bancoDestinoId, monto);
      // NO crear transacción en cashflow
    }

    return {
      message: 'Transferencia realizada exitosamente',
      bancoOrigen: bancoOrigen.nombre,
      bancoDestino: bancoDestino.nombre,
      monto,
    };
  }

  /**
   * Crear transacción de cashflow para inversiones
   */
  private async crearTransaccionInversion(
    codigo: string,
    monto: number,
    fecha: string,
    bancoId: number,
    bancoOrigenNombre: string,
    bancoDestinoNombre: string,
  ) {
    // Obtener la categoría por código
    const categoria = await this.cashflowCategoriaRepository.findOne({
      where: { codigo },
    });

    if (!categoria) {
      throw new BadRequestException(`No se encontró la categoría con código ${codigo}`);
    }

    // Crear descripción descriptiva
    const descripcion = `Transferencia entre cuentas bancarias de ${bancoOrigenNombre} a ${bancoDestinoNombre}`;

    // Crear la transacción
    await this.cashflowTransaccionRepository.save({
      categoriaId: categoria.id,
      fecha,
      monto,
      descripcion,
      modelo: 'banco',
      modeloId: bancoId,
      proyectado: false,
      bancoId,
      conciliado: true,
    });
  }
}
