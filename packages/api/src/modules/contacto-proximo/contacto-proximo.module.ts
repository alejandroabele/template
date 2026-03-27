import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoProximoController } from './contacto-proximo.controller';
import { ContactoProximoService } from './contacto-proximo.service';
import { ContactoProximo } from './entities/contacto-proximo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactoProximo])],
  controllers: [ContactoProximoController],
  providers: [ContactoProximoService],
  exports: [ContactoProximoService],
})
export class ContactoProximoModule {}
