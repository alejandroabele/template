import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoCasoService } from './contacto-caso.service';
import { ContactoCasoController } from './contacto-caso.controller';
import { ContactoCaso } from './entities/contacto-caso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactoCaso])],
  controllers: [ContactoCasoController],
  providers: [ContactoCasoService],
  exports: [ContactoCasoService],
})
export class ContactoCasoModule {}
