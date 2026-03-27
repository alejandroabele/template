import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleProcesoGeneralService } from './role-proceso-general.service';
import { RoleProcesoGeneralController } from './role-proceso-general.controller';
import { RoleProcesoGeneral } from './entities/role-proceso-general.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleProcesoGeneral])],
  controllers: [RoleProcesoGeneralController],
  providers: [RoleProcesoGeneralService],
  exports: [RoleProcesoGeneralService],
})
export class RoleProcesoGeneralModule {}
