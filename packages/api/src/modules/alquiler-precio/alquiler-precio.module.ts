import { Module } from '@nestjs/common';
import { AlquilerPrecioService } from './alquiler-precio.service';
import { AlquilerPrecioController } from './alquiler-precio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlquilerPrecio } from './entities/alquiler-precio.entity';


@Module({
  imports: [TypeOrmModule.forFeature([AlquilerPrecio])],
  controllers: [AlquilerPrecioController],
  providers: [AlquilerPrecioService],
  exports: [TypeOrmModule]
})
export class AlquilerPrecioModule { }
