import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { Contacto } from './entities/contacto.entity';
import { ContactoProximoModule } from '../contacto-proximo/contacto-proximo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contacto]),
    ContactoProximoModule,
  ],
  controllers: [ContactoController],
  providers: [ContactoService],
  exports: [ContactoService],
})
export class ContactoModule {}
