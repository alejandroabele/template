import { Module } from '@nestjs/common';
import { ProduccionTrabajosService } from './produccion-trabajos.service';
import { ProduccionTrabajosController } from './produccion-trabajos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduccionTrabajo } from './entities/produccion-trabajo.entity'

@Module({
  controllers: [ProduccionTrabajosController],
  providers: [ProduccionTrabajosService],
  imports: [TypeOrmModule.forFeature([ProduccionTrabajo])],
  exports: [TypeOrmModule, ProduccionTrabajosService]

})
export class ProduccionTrabajosModule { }
