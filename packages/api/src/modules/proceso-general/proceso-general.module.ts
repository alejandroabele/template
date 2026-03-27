import { Module } from '@nestjs/common';
import { ProcesoGeneralService } from './proceso-general.service';
import { ProcesoGeneralController } from './proceso-general.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcesoGeneral } from './entities/proceso-general.entity';
import { RoleProcesoGeneralModule } from '../role-proceso-general/role-proceso-general.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcesoGeneral]),
    RoleProcesoGeneralModule
  ],
  exports: [TypeOrmModule],
  controllers: [ProcesoGeneralController],
  providers: [ProcesoGeneralService],
})
export class ProcesoGeneralModule { }
