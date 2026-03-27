import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoTipoService } from './contacto-tipo.service';
import { ContactoTipoController } from './contacto-tipo.controller';
import { ContactoTipo } from './entities/contacto-tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactoTipo])],
  controllers: [ContactoTipoController],
  providers: [ContactoTipoService],
  exports: [ContactoTipoService],
})
export class ContactoTipoModule {}
