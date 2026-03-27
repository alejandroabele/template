import { Module } from '@nestjs/common';
import { AlquilerMantenimientoService } from './alquiler-mantenimiento.service';
import { AlquilerMantenimientoController } from './alquiler-mantenimiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlquilerMantenimiento } from './entities/alquiler-mantenimiento.entity';
import { ArchivoModule } from '../archivo/archivo.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlquilerMantenimiento]), ArchivoModule],
  controllers: [AlquilerMantenimientoController],
  providers: [AlquilerMantenimientoService],
})
export class AlquilerMantenimientoModule { }
