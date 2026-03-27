import { Injectable } from '@nestjs/common';
import { CreatePresupuestoMaterialeDto } from './dto/create-presupuesto-materiale.dto';
import { UpdatePresupuestoMaterialeDto } from './dto/update-presupuesto-materiale.dto';

@Injectable()
export class PresupuestoMaterialesService {
  create(createPresupuestoMaterialeDto: CreatePresupuestoMaterialeDto) {
    return 'This action adds a new presupuestoMateriale';
  }

  findAll() {
    return `This action returns all presupuestoMateriales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presupuestoMateriale`;
  }

  update(id: number, updatePresupuestoMaterialeDto: UpdatePresupuestoMaterialeDto) {
    return `This action updates a #${id} presupuestoMateriale`;
  }

  remove(id: number) {
    return `This action removes a #${id} presupuestoMateriale`;
  }
}
