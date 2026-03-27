import { Injectable } from '@nestjs/common';
import { CreateProcesoGeneralDto } from './dto/create-proceso-general.dto';
import { UpdateProcesoGeneralDto } from './dto/update-proceso-general.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcesoGeneral } from './entities/proceso-general.entity'
import { Repository, FindManyOptions, In } from 'typeorm';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { getUser } from '@/helpers/get-user';
import { RoleProcesoGeneralService } from '../role-proceso-general/role-proceso-general.service';

@Injectable()
export class ProcesoGeneralService {
  constructor(
    @InjectRepository(ProcesoGeneral)
    private procesoGeneralRepository: Repository<ProcesoGeneral>,
    private roleProcesoGeneralService: RoleProcesoGeneralService,
  ) { }
  create(createProcesoGeneralDto: CreateProcesoGeneralDto) {
    return 'This action adds a new procesoGeneral';
  }

  async findAll(conditions: FindManyOptions<ProcesoGeneral>): Promise<ProcesoGeneral[]> {
    const order = conditions.order || {};
    const user = getUser();

    // Obtener los IDs de procesos generales permitidos para el rol del usuario desde la tabla intermedia
    const allowedIds = user && user.role
      ? await this.roleProcesoGeneralService.findByRoleId(user.role)
      : [];

    // Aplicar el filtro de IDs permitidos solo si hay restricciones
    if (allowedIds.length > 0) {
      conditions.where = {
        ...conditions.where,
        id: In(allowedIds),
      };
    }

    const procesos = await this.procesoGeneralRepository.find({
      ...conditions,
      where: {
        ...transformToGenericFilters(conditions.where),
      },
      order,
    });

    return procesos;
  }



  findOne(id: number) {
    return `This action returns a #${id} procesoGeneral`;
  }

  update(id: number, updateProcesoGeneralDto: UpdateProcesoGeneralDto) {
    return `This action updates a #${id} procesoGeneral`;
  }

  remove(id: number) {
    return `This action removes a #${id} procesoGeneral`;
  }
}
