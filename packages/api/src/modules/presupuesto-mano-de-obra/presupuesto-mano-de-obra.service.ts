import { Injectable } from '@nestjs/common';
import { CreatePresupuestoManoDeObraDto } from './dto/create-presupuesto-mano-de-obra.dto';
import { UpdatePresupuestoManoDeObraDto } from './dto/update-presupuesto-mano-de-obra.dto';

@Injectable()
export class PresupuestoManoDeObraService {
  create(createPresupuestoManoDeObraDto: CreatePresupuestoManoDeObraDto) {
    return 'This action adds a new presupuestoManoDeObra';
  }

  findAll() {
    return `This action returns all presupuestoManoDeObra`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presupuestoManoDeObra`;
  }

  update(id: number, updatePresupuestoManoDeObraDto: UpdatePresupuestoManoDeObraDto) {
    return `This action updates a #${id} presupuestoManoDeObra`;
  }

  remove(id: number) {
    return `This action removes a #${id} presupuestoManoDeObra`;
  }
}
