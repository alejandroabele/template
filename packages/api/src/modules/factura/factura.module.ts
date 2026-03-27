import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { Factura } from './entities/factura.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Archivo])],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [FacturaService, TypeOrmModule],
})
export class FacturaModule { }
