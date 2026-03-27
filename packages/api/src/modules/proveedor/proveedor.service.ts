import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';
import { transformToGenericFilters, buildWhereAndOrderQuery } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderValues } from '@/types';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) { }

  async create(createProveedorDto: CreateProveedorDto) {
    // Verificar si ya existe un proveedor con el mismo CUIT
    const proveedorExistente = await this.proveedorRepository.findOne({
      where: { cuit: createProveedorDto.cuit }
    });

    if (proveedorExistente) {
      throw new ConflictException(`Ya existe un proveedor con el CUIT ${createProveedorDto.cuit}`);
    }

    return await this.proveedorRepository.save(createProveedorDto);
  }

  async findAll(conditions: FindManyOptions<Proveedor>): Promise<Proveedor[]> {
    const qb = this.proveedorRepository.createQueryBuilder('proveedor');

    const relaciones = ['proveedorRubro'];

    for (const relation of relaciones) {
      qb.leftJoinAndSelect(`proveedor.${relation}`, relation.split('.').pop());
    }

    // Extraer el filtro de razonSocial para manejar búsqueda en múltiples campos
    const { where = {}, order = {}, take, skip } = conditions;
    const razonSocialFilter = where['razonSocial'];

    if (razonSocialFilter && typeof razonSocialFilter === 'string') {
      // Si hay filtro de razonSocial, buscar en razonSocial, nombreFantasia y cuit
      const searchValue = razonSocialFilter.toLowerCase();
      qb.andWhere(
        '(LOWER(proveedor.razonSocial) LIKE :searchValue OR LOWER(proveedor.nombreFantasia) LIKE :searchValue OR LOWER(proveedor.cuit) LIKE :searchValue)',
        { searchValue: `%${searchValue}%` }
      );

      // Eliminar razonSocial del where para que buildWhereAndOrderQuery no lo procese
      delete where['razonSocial'];
    }

    buildWhereAndOrderQuery(qb, conditions, 'proveedor');
    const proveedores = await qb.getMany();
    return proveedores;
  }

  async findOne(id: number) {
    const proveedor = await this.proveedorRepository.findOneBy({ id });

    // Cargar legajo del proveedor
    const legajoFiles = await this.archivoRepository.find({
      where: {
        modelo: 'proveedor',
        modeloId: proveedor.id,
        tipo: 'legajo',
      },
      order: {
        id: 'DESC',
      },
    });
    proveedor['legajo'] = legajoFiles.length > 0 ? legajoFiles[0] : null;

    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    // Si se está actualizando el CUIT, verificar que no esté duplicado
    if (updateProveedorDto.cuit) {
      const proveedorExistente = await this.proveedorRepository.findOne({
        where: { cuit: updateProveedorDto.cuit }
      });

      if (proveedorExistente && proveedorExistente.id !== id) {
        throw new ConflictException(`Ya existe un proveedor con el CUIT ${updateProveedorDto.cuit}`);
      }
    }

    await this.proveedorRepository.update({ id }, updateProveedorDto);
    return await this.proveedorRepository.findOneBy({ id });
  }

  async remove(id: number) {

    const alquilerPrecio = await this.findOne(id);

    await this.proveedorRepository.delete({ id });
    return alquilerPrecio
  }
}
