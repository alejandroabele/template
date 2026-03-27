import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobroService } from './cobro.service';
import { CobroController } from './cobro.controller';
import { Cobro } from './entities/cobro.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';
import { Factura } from '@/modules/factura/entities/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cobro, Archivo, Factura])],
  controllers: [CobroController],
  providers: [CobroService],
  exports: [CobroService, TypeOrmModule],
})
export class CobroModule { }
