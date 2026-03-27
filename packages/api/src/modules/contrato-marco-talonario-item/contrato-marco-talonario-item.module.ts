import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoMarcoTalonarioItemController } from './contrato-marco-talonario-item.controller';
import { ContratoMarcoTalonarioItemService } from './contrato-marco-talonario-item.service';
import { ContratoMarcoTalonarioItem } from './entities/contrato-marco-talonario-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoMarcoTalonarioItem])],
  controllers: [ContratoMarcoTalonarioItemController],
  providers: [ContratoMarcoTalonarioItemService],
  exports: [TypeOrmModule],
})
export class ContratoMarcoTalonarioItemModule { }
