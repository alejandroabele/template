import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateRoleProcesoGeneralDto } from './dto/create-role-proceso-general.dto';
import { UpdateRoleProcesoGeneralDto } from './dto/update-role-proceso-general.dto';
import { RoleProcesoGeneral } from './entities/role-proceso-general.entity';
import { transformToGenericFilters } from '@/helpers/filter-utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleProcesoGeneralService {
  constructor(
    @InjectRepository(RoleProcesoGeneral)
    private roleProcesoGeneralRepository: Repository<RoleProcesoGeneral>,
  ) { }

  async create(createRoleProcesoGeneralDto: CreateRoleProcesoGeneralDto) {
    return await this.roleProcesoGeneralRepository.save(createRoleProcesoGeneralDto);
  }

  async findAll(conditions: FindManyOptions<RoleProcesoGeneral>): Promise<RoleProcesoGeneral[]> {
    return await this.roleProcesoGeneralRepository.find({
      ...conditions,
      where: transformToGenericFilters(conditions.where),
      relations: ['role', 'procesoGeneral']
    });
  }

  async findByRoleId(roleId: number): Promise<number[]> {
    const relaciones = await this.roleProcesoGeneralRepository.find({
      where: { roleId },
      select: ['procesoGeneralId']
    });
    return relaciones.map(r => r.procesoGeneralId);
  }

  async findOne(id: number) {
    return await this.roleProcesoGeneralRepository.findOne({
      where: { id },
      relations: ['role', 'procesoGeneral']
    });
  }

  async update(id: number, updateRoleProcesoGeneralDto: UpdateRoleProcesoGeneralDto) {
    await this.roleProcesoGeneralRepository.update({ id }, updateRoleProcesoGeneralDto);
    return await this.roleProcesoGeneralRepository.findOne({
      where: { id },
      relations: ['role', 'procesoGeneral']
    });
  }

  async remove(id: number) {
    const roleProcesoGeneral = await this.findOne(id);
    await this.roleProcesoGeneralRepository.delete({ id });
    return roleProcesoGeneral;
  }

  async removeByRoleAndProceso(roleId: number, procesoGeneralId: number) {
    const relacion = await this.roleProcesoGeneralRepository.findOne({
      where: { roleId, procesoGeneralId }
    });

    if (relacion) {
      await this.roleProcesoGeneralRepository.delete({ id: relacion.id });
      return relacion;
    }

    return null;
  }
}
