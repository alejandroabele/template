import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoComprasService } from './estado-compras.service';
import { EstadoComprasController } from './estado-compras.controller';
import { EstadoCompras } from './entities/estado-compras.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoCompras]),
  ],
  controllers: [EstadoComprasController],
  providers: [EstadoComprasService],
  exports: [EstadoComprasService, TypeOrmModule],
})
export class EstadoComprasModule {}
