import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaContableService } from './cuenta-contable.service';
import { CuentaContableController } from './cuenta-contable.controller';
import { CuentaContable } from './entities/cuenta-contable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaContable])],
  controllers: [CuentaContableController],
  providers: [CuentaContableService],
  exports: [CuentaContableService],
})
export class CuentaContableModule {}
