import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartelService } from './cartel.service';
import { CartelController } from './cartel.controller';
import { Cartel } from './entities/cartel.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cartel, AlquilerRecurso])],
    controllers: [CartelController],
    providers: [CartelService],
})
export class CartelModule {}
