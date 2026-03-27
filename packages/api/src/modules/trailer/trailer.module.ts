import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrailerService } from './trailer.service';
import { TrailerController } from './trailer.controller';
import { Trailer } from './entities/trailer.entity';
import { AlquilerRecurso } from '@/modules/alquiler-recurso/entities/alquiler-recurso.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Trailer, AlquilerRecurso])],
    controllers: [TrailerController],
    providers: [TrailerService],
})
export class TrailerModule {}
