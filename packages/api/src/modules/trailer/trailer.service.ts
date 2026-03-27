import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trailer } from './entities/trailer.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';

@Injectable()
export class TrailerService {
    constructor(
        @InjectRepository(Trailer)
        private trailerRepository: Repository<Trailer>,
        @InjectRepository(AlquilerRecurso)
        private recursoRepository: Repository<AlquilerRecurso>,
    ) { }

    async create(createTrailerDto: CreateTrailerDto): Promise<Trailer> {
        const { codigo, proveedor, formato, alto, largo } = createTrailerDto;
        const recurso = await this.recursoRepository.save({ codigo, proveedor, tipo: 'TRAILERS' });
        return await this.trailerRepository.save({ recursoId: recurso.id, formato, alto, largo });
    }

    async findAll(conditions: any): Promise<any[]> {
        const queryBuilder = this.trailerRepository
            .createQueryBuilder('trailer')
            .leftJoinAndSelect('trailer.recurso', 'recurso');

        buildWhereAndOrderQuery(queryBuilder, conditions, 'trailer');

        return queryBuilder.getMany();
    }

    async findOne(id: number): Promise<any> {
        const trailer = await this.trailerRepository.findOne({
            where: { id },
            relations: ['recurso'],
        });
        if (!trailer) throw new NotFoundException(`Trailer ${id} no encontrado`);
        return trailer;
    }

    async update(id: number, updateTrailerDto: UpdateTrailerDto): Promise<any> {
        const { codigo, proveedor, formato, alto, largo } = updateTrailerDto;

        const trailer = await this.trailerRepository.findOne({ where: { id }, relations: ['recurso'] });
        if (!trailer) throw new NotFoundException(`Trailer ${id} no encontrado`);

        if (codigo !== undefined || proveedor !== undefined) {
            await this.recursoRepository.update({ id: trailer.recursoId }, {
                ...(codigo !== undefined && { codigo }),
                ...(proveedor !== undefined && { proveedor }),
            });
        }

        await this.trailerRepository.update({ id }, {
            ...(formato !== undefined && { formato }),
            ...(alto !== undefined && { alto }),
            ...(largo !== undefined && { largo }),
        });

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const trailer = await this.trailerRepository.findOne({ where: { id } });
        if (!trailer) throw new NotFoundException(`Trailer ${id} no encontrado`);
        await this.trailerRepository.delete({ id });
        await this.recursoRepository.delete({ id: trailer.recursoId });
    }
}
