import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refrigerio } from './entities/refrigerio.entity';
import { Persona } from '@/modules/persona/entities/persona.entity';
import { RefrigerioController } from './refrigerio.controller';
import { RefrigerioService } from './refrigerio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Refrigerio, Persona])],
  exports: [TypeOrmModule],
  controllers: [RefrigerioController],
  providers: [RefrigerioService],
})
export class RefrigerioModule { }
