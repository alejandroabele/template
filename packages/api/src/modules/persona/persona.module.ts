import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { Persona } from './entities/persona.entity';
import { Archivo } from '@/modules/archivo/entities/archivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, Archivo])],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [TypeOrmModule],
})
export class PersonaModule {}
