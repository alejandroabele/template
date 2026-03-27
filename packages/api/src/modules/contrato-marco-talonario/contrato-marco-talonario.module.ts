import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoMarcoTalonarioController } from './contrato-marco-talonario.controller';
import { ContratoMarcoTalonarioService } from './contrato-marco-talonario.service';
import { ContratoMarcoTalonario } from './entities/contrato-marco-talonario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoMarcoTalonario])],
  controllers: [ContratoMarcoTalonarioController],
  providers: [ContratoMarcoTalonarioService],
  exports: [TypeOrmModule],
})
export class ContratoMarcoTalonarioModule { }
