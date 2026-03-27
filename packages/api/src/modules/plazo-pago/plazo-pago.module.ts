import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlazoPagoController } from './plazo-pago.controller';
import { PlazoPagoService } from './plazo-pago.service';
import { PlazoPago } from './entities/plazo-pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlazoPago])],
  controllers: [PlazoPagoController],
  providers: [PlazoPagoService],
  exports: [PlazoPagoService],
})
export class PlazoPagoModule {}
