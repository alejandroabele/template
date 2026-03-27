import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroLeidoService } from './registro-leido.service';
import { RegistroLeidoController } from './registro-leido.controller';
import { RegistroLeido } from './entities/registro-leido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroLeido])],
  controllers: [RegistroLeidoController],
  providers: [RegistroLeidoService],
  exports: [RegistroLeidoService],
})
export class RegistroLeidoModule { }
