import { Injectable } from '@nestjs/common';
import { CreatePresupuestoSuministroDto } from './dto/create-presupuesto-suministro.dto';
import { UpdatePresupuestoSuministroDto } from './dto/update-presupuesto-suministro.dto';

@Injectable()
export class PresupuestoSuministrosService {
  create(createPresupuestoSuministroDto: CreatePresupuestoSuministroDto) {
    return 'This action adds a new presupuestoSuministro';
  }

  findAll() {
    return `This action returns all presupuestoSuministros`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presupuestoSuministro`;
  }

  update(id: number, updatePresupuestoSuministroDto: UpdatePresupuestoSuministroDto) {
    return `This action updates a #${id} presupuestoSuministro`;
  }

  remove(id: number) {
    return `This action removes a #${id} presupuestoSuministro`;
  }
}
