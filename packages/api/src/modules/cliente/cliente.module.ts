import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Archivo])],

  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule { }
