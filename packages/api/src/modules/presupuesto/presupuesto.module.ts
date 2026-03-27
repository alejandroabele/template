import { Module } from '@nestjs/common';
import { PresupuestoService } from './presupuesto.service';
import { PresupuestoReportesService } from './presupuesto-reportes.service';
import { PresupuestoController } from './presupuesto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presupuesto } from './entities/presupuesto.entity'
import { PresupuestoItemTrabajo } from '@/modules/presupuesto-item/entities/presupuesto-item-trabajo.entity'
import { PresupuestoItemModule } from '@/modules/presupuesto-item/presupuesto-item.module';
import { PresupuestoMaterialesModule } from '@/modules/presupuesto-materiales/presupuesto-materiales.module';
import { PresupuestoSuministrosModule } from '@/modules/presupuesto-suministros/presupuesto-suministros.module';
import { PresupuestoManoDeObraModule } from '@/modules/presupuesto-mano-de-obra/presupuesto-mano-de-obra.module';
import { ProduccionTrabajosModule } from '@/modules/produccion-trabajos/produccion-trabajos.module';
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { PdfExportService } from '@/services/pdf-export/pdf-export.service'
import { RecetaModule } from '@/modules/receta/receta.module'
import { PresupuestoLeidoModule } from '@/modules/presupuesto-leido/presupuesto-leido.module'
import { ArchivoModule } from '@/modules/archivo/archivo.module';
import { PresupuestoProduccionModule } from '../presupuesto-produccion/presupuesto-produccion.module';
import { MovimientoInventarioModule } from '../movimiento-inventario/movimiento-inventario.module';
import { InventarioModule } from '../inventario/inventario.module';
import { MensajeModule } from '../mensaje/mensaje.module';
import { NotificacionModule } from '../notificacion/notificacion.module';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { UsuarioModule } from '../auth/usuario/usuario.module';
import { ContratoMarcoPresupuestoModule } from '../contrato-marco-presupuesto/contrato-marco-presupuesto.module';
import { PermissionsModule } from '../auth/permissions/permissions.module';
import { RoleProcesoGeneralModule } from '../role-proceso-general/role-proceso-general.module';
import { FacturaModule } from '../factura/factura.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Presupuesto, PresupuestoItemTrabajo]),
    PresupuestoItemModule,
    PresupuestoProduccionModule,
    PresupuestoMaterialesModule,
    PresupuestoSuministrosModule,
    PresupuestoManoDeObraModule,
    ProduccionTrabajosModule,
    RecetaModule,
    PresupuestoLeidoModule,
    ArchivoModule,
    MovimientoInventarioModule,
    InventarioModule,
    MensajeModule,
    NotificacionModule,
    AuditoriaModule,
    UsuarioModule,
    ContratoMarcoPresupuestoModule,
    PermissionsModule,
    RoleProcesoGeneralModule,
    FacturaModule,
  ],
  controllers: [PresupuestoController],
  providers: [PresupuestoService, PresupuestoReportesService, ExcelExportService, PdfExportService],
  exports: [TypeOrmModule, PresupuestoService, PresupuestoReportesService]
})
export class PresupuestoModule { }
