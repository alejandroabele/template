import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartel } from './entities/cartel.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';
import { CreateCartelDto } from './dto/create-cartel.dto';
import { UpdateCartelDto } from './dto/update-cartel.dto';
import { buildWhereAndOrderQuery } from '@/helpers/filter-utils';

@Injectable()
export class CartelService {
    constructor(
        @InjectRepository(Cartel)
        private cartelRepository: Repository<Cartel>,
        @InjectRepository(AlquilerRecurso)
        private recursoRepository: Repository<AlquilerRecurso>,
    ) { }

    async create(createCartelDto: CreateCartelDto): Promise<Cartel> {
        const { codigo, proveedor, formato, alto, largo, localidad, zona, coordenadas } = createCartelDto;
        const recurso = await this.recursoRepository.save({ codigo, proveedor, tipo: 'CARTELES' });
        return await this.cartelRepository.save({ recursoId: recurso.id, formato, alto, largo, localidad, zona, coordenadas });
    }

    async findAll(conditions: any): Promise<any[]> {
        const queryBuilder = this.cartelRepository
            .createQueryBuilder('cartel')
            .leftJoinAndSelect('cartel.recurso', 'recurso');

        buildWhereAndOrderQuery(queryBuilder, conditions, 'cartel');

        return queryBuilder.getMany();
    }

    async findOne(id: number): Promise<any> {
        const cartel = await this.cartelRepository.findOne({
            where: { id },
            relations: ['recurso'],
        });
        if (!cartel) throw new NotFoundException(`Cartel ${id} no encontrado`);
        return cartel;
    }

    async update(id: number, updateCartelDto: UpdateCartelDto): Promise<any> {
        const { codigo, proveedor, formato, alto, largo, localidad, zona, coordenadas } = updateCartelDto;

        const cartel = await this.cartelRepository.findOne({ where: { id }, relations: ['recurso'] });
        if (!cartel) throw new NotFoundException(`Cartel ${id} no encontrado`);

        if (codigo !== undefined || proveedor !== undefined) {
            await this.recursoRepository.update({ id: cartel.recursoId }, {
                ...(codigo !== undefined && { codigo }),
                ...(proveedor !== undefined && { proveedor }),
            });
        }

        await this.cartelRepository.update({ id }, {
            ...(formato !== undefined && { formato }),
            ...(alto !== undefined && { alto }),
            ...(largo !== undefined && { largo }),
            ...(localidad !== undefined && { localidad }),
            ...(zona !== undefined && { zona }),
            ...(coordenadas !== undefined && { coordenadas }),
        });

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const cartel = await this.cartelRepository.findOne({ where: { id } });
        if (!cartel) throw new NotFoundException(`Cartel ${id} no encontrado`);
        await this.cartelRepository.delete({ id });
        await this.recursoRepository.delete({ id: cartel.recursoId });
    }
}
