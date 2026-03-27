import { Module } from '@nestjs/common';
import { InventarioConversionService } from './inventario-conversion.service';
import { InventarioConversionController } from './inventario-conversion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioConversion } from './entities/inventario-conversion.entity'
import { Inventario } from '../inventario/entities/inventario.entity';
@Module({
  imports: [TypeOrmModule.forFeature([InventarioConversion, Inventario])],
  controllers: [InventarioConversionController],
  providers: [InventarioConversionService],
})
export class InventarioConversionModule { }
