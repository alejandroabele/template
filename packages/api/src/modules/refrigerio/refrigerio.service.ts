import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { getTodayDateTime } from '@/helpers/date';
import { Refrigerio } from './entities/refrigerio.entity';
import { CreateRefrigerioDto } from './dto/create-refrigerio.dto';

@Injectable()
export class RefrigerioService {
  constructor(
    @InjectRepository(Refrigerio)
    private refrigerioRepository: Repository<Refrigerio>,
  ) { }

  async iniciar(dto: CreateRefrigerioDto): Promise<Refrigerio> {
    const activo = await this.refrigerioRepository.findOne({
      where: { personaId: dto.personaId, fin: IsNull() },
    });
    if (activo) {
      throw new BadRequestException('Ya tenés un refrigerio en curso');
    }
    const refrigerio = await this.refrigerioRepository.save({
      personaId: dto.personaId,
      inicio: getTodayDateTime(),
    });
    return this.refrigerioRepository.findOne({
      where: { id: refrigerio.id },
      relations: ['persona'],
    });
  }

  async finalizar(id: number): Promise<Refrigerio> {
    const refrigerio = await this.refrigerioRepository.findOne({ where: { id } });
    if (!refrigerio) {
      throw new NotFoundException('Refrigerio no encontrado');
    }
    if (refrigerio.fin) {
      throw new BadRequestException('Este refrigerio ya fue finalizado');
    }
    await this.refrigerioRepository.update({ id }, { fin: getTodayDateTime() });
    return this.refrigerioRepository.findOne({
      where: { id },
      relations: ['persona'],
    });
  }

  async activo(personaId: number): Promise<Refrigerio | null> {
    return this.refrigerioRepository.findOne({
      where: { personaId, fin: IsNull() },
      relations: ['persona'],
    });
  }

  async historial(personaId: number, fecha?: string): Promise<Refrigerio[]> {
    const qb = this.refrigerioRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.persona', 'persona')
      .where('r.personaId = :personaId', { personaId });

    if (fecha) {
      qb.andWhere('r.inicio LIKE :fecha', { fecha: `${fecha}%` });
    }

    return qb.orderBy('r.inicio', 'DESC').getMany();
  }

  async enCurso(): Promise<Refrigerio[]> {
    return this.refrigerioRepository.find({
      where: { fin: IsNull() },
      relations: ['persona'],
      order: { inicio: 'ASC' },
    });
  }

  async estadisticas(desde?: string, hasta?: string): Promise<Refrigerio[]> {
    const qb = this.refrigerioRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.persona', 'persona')
      .where('r.fin IS NOT NULL');

    if (desde) qb.andWhere('r.inicio >= :desde', { desde: `${desde} 00:00:00` });
    if (hasta) qb.andWhere('r.inicio <= :hasta', { hasta: `${hasta} 23:59:59` });

    return qb.orderBy('r.inicio', 'ASC').getMany();
  }
}
