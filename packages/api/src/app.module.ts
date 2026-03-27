import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import configAuth from './config/auth.config';
import { enviroments } from './config/enviroments';
import configSMTP from './config/mail.config';
import { ROUTES } from './main.routes';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AlquilerMantenimientoModule } from './modules/alquiler-mantenimiento/alquiler-mantenimiento.module';
import { AlquilerPrecioModule } from './modules/alquiler-precio/alquiler-precio.module';
import { AlquilerRecursoModule } from './modules/alquiler-recurso/alquiler-recurso.module';
import { AlquilerModule } from './modules/alquiler/alquiler.module';
import { ArchivoModule } from './modules/archivo/archivo.module';
import { AreaModule } from './modules/area/area.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { IndiceModule } from './modules/indice/indice.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { MensajeModule } from './modules/mensaje/mensaje.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { RecetaModule } from './modules/receta/receta.module';
import { ExcelExportService } from './services/excel-export/excel-export.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresupuestoModule } from './modules/presupuesto/presupuesto.module';
import { ProcesoGeneralModule } from './modules/proceso-general/proceso-general.module';
import { ProduccionTrabajosModule } from './modules/produccion-trabajos/produccion-trabajos.module';
import { PresupuestoItemModule } from './modules/presupuesto-item/presupuesto-item.module';
import { PresupuestoManoDeObraModule } from './modules/presupuesto-mano-de-obra/presupuesto-mano-de-obra.module';
import { PresupuestoMaterialesModule } from './modules/presupuesto-materiales/presupuesto-materiales.module';
import { PresupuestoSuministrosModule } from './modules/presupuesto-suministros/presupuesto-suministros.module';
import { PdfExportService } from './services/pdf-export/pdf-export.service';
import { PresupuestoLeidoModule } from './modules/presupuesto-leido/presupuesto-leido.module';
import { PresupuestoProduccionModule } from './modules/presupuesto-produccion/presupuesto-produccion.module';
import { MovimientoInventarioModule } from './modules/movimiento-inventario/movimiento-inventario.module';
import { InventarioReservasModule } from './modules/inventario-reservas/inventario-reservas.module';
import { EntitySubscriber } from './subscribers/entity.subscriber';
import { AuditoriaSubscriber } from './subscribers/auditoria.subscriber';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { InventarioCategoriaModule } from './modules/inventario-categoria/inventario-categoria.module';
import { InventarioConversionModule } from './modules/inventario-conversion/inventario-conversion.module';
import { InventarioSubcategoriaModule } from './modules/inventario-subcategoria/inventario-subcategoria.module';
import { ContratoMarcoModule } from './modules/contrato-marco/contrato-marco.module';
import { ContratoMarcoTalonarioModule } from './modules/contrato-marco-talonario/contrato-marco-talonario.module';
import { ContratoMarcoTalonarioItemModule } from './modules/contrato-marco-talonario-item/contrato-marco-talonario-item.module';
import { ContratoMarcoPresupuestoModule } from './modules/contrato-marco-presupuesto/contrato-marco-presupuesto.module';
import { ContratoMarcoPresupuestoItemModule } from './modules/contrato-marco-presupuesto-item/contrato-marco-presupuesto-item.module';
import { ExcelReaderService } from './services/excel-reader/excel-reader.service';
import { EmailService } from './services/email/email.service';
import { AfipModule } from './modules/afip/afip.module';
import { ProveedorModule } from './modules/proveedor/proveedor.module';
import { ProveedorRubroModule } from './modules/proveedor-rubro/proveedor-rubro.module';
import { MetodoPagoModule } from './modules/metodo-pago/metodo-pago.module';
import { CashflowCategoriaModule } from './modules/cashflow-categoria/cashflow-categoria.module';
import { CashflowTransaccionModule } from './modules/cashflow-transaccion/cashflow-transaccion.module';
import { CashflowSimulacionModule } from './modules/cashflow-simulacion/cashflow-simulacion.module';
import { BancoModule } from './modules/banco/banco.module';
import { BancoSaldoModule } from './modules/banco-saldo/banco-saldo.module';
import { CentroCostoModule } from './modules/centro-costo/centro-costo.module';
import { RoleProcesoGeneralModule } from './modules/role-proceso-general/role-proceso-general.module';
import { EstadoComprasModule } from './modules/estado-compras/estado-compras.module';
import { PlazoPagoModule } from './modules/plazo-pago/plazo-pago.module';
import { SolcomModule } from './modules/solcom/solcom.module';
import { OfertaModule } from './modules/oferta/oferta.module';
import { RegistroLeidoModule } from './modules/registro-leido/registro-leido.module';
import { CuentaContableModule } from './modules/cuenta-contable/cuenta-contable.module';
import { OrdenCompraModule } from './modules/orden-compra/orden-compra.module';
import { OfertaAprobacionModule } from './modules/oferta-aprobacion/oferta-aprobacion.module';
import { ContactoTipoModule } from './modules/contacto-tipo/contacto-tipo.module';
import { ContactoCasoModule } from './modules/contacto-caso/contacto-caso.module';
import { ContactoModule } from './modules/contacto/contacto.module';
import { ContactoProximoModule } from './modules/contacto-proximo/contacto-proximo.module';
import { ConfigModule as ConfiguracionModule } from './modules/config/config.module';
import { PersonaModule } from './modules/persona/persona.module';
import { JornadaModule } from './modules/jornada/jornada.module';
import { FacturaModule } from './modules/factura/factura.module';
import { CobroModule } from './modules/cobro/cobro.module';
import { ReservaModule } from './modules/reserva/reserva.module';
import { CashflowRubroModule } from './modules/cashflow-rubro/cashflow-rubro.module';
import { CashflowAgrupacionModule } from './modules/cashflow-agrupacion/cashflow-agrupacion.module';
import { FlotaModule } from './modules/flota/flota.module';
import { EquipamientoModule } from './modules/equipamiento/equipamiento.module';
import { UbicacionModule } from './modules/ubicacion/ubicacion.module';
import { PlantillaNotificacionModule } from './modules/plantilla-notificacion/plantilla-notificacion.module';
import { EnvioNotificacionModule } from './modules/envio-notificacion/envio-notificacion.module';
import { RefrigerioModule } from './modules/refrigerio/refrigerio.module';
import { CartelModule } from './modules/cartel/cartel.module';
import { TrailerModule } from './modules/trailer/trailer.module';
import { HerramientaModule } from './modules/herramienta/herramienta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [configAuth, configSMTP],
      isGlobal: true,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'files'),
    //   exclude: ['/api/(.*)'],
    // }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      password: process.env.MYSQL_ROOT_PASSWORD,
      username: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      autoLoadEntities: true,
      legacySpatialSupport: false,
      timezone: 'America/Argentina/Buenos_Aires',
      dateStrings: true
    }),
    RouterModule.register(ROUTES),
    AreaModule,
    CategoriaModule,
    ClienteModule,
    AuthModule,
    InventarioModule,
    RecetaModule,
    AlquilerModule,
    AlquilerPrecioModule,
    AlquilerMantenimientoModule,
    MensajeModule,
    IndiceModule,
    ArchivoModule,
    AlquilerRecursoModule,
    NotificacionModule,
    PresupuestoModule,
    ProcesoGeneralModule,
    ProduccionTrabajosModule,
    PresupuestoItemModule,
    PresupuestoManoDeObraModule,
    PresupuestoMaterialesModule,
    PresupuestoSuministrosModule,
    PresupuestoLeidoModule,
    PresupuestoProduccionModule,
    MovimientoInventarioModule,
    InventarioReservasModule,
    AuditoriaModule,
    InventarioCategoriaModule,
    InventarioConversionModule,
    InventarioSubcategoriaModule,
    ContratoMarcoModule,
    ContratoMarcoTalonarioModule,
    ContratoMarcoTalonarioItemModule,
    ContratoMarcoPresupuestoModule,
    ContratoMarcoPresupuestoItemModule,
    AfipModule,
    ProveedorModule,
    ProveedorRubroModule,
    MetodoPagoModule,
    CashflowCategoriaModule,
    CashflowTransaccionModule,
    CashflowSimulacionModule,
    BancoModule,
    BancoSaldoModule,
    CentroCostoModule,
    RoleProcesoGeneralModule,
    EstadoComprasModule,
    PlazoPagoModule,
    SolcomModule,
    OfertaModule,
    RegistroLeidoModule,
    CuentaContableModule,
    OrdenCompraModule,
    OfertaAprobacionModule,
    ContactoTipoModule,
    ContactoCasoModule,
    ContactoModule,
    ContactoProximoModule,
    ConfiguracionModule,
    ConfigModule,
    PersonaModule,
    JornadaModule,
    FacturaModule,
    CobroModule,
    ReservaModule,
    CashflowRubroModule,
    CashflowAgrupacionModule,
    FlotaModule,
    EquipamientoModule,
    UbicacionModule,
    PlantillaNotificacionModule,
    EnvioNotificacionModule,
    RefrigerioModule,
    CartelModule,
    TrailerModule,
    HerramientaModule,
  ],
  providers: [ExcelExportService, PdfExportService, EntitySubscriber, AuditoriaSubscriber, ExcelReaderService, EmailService],

})
export class AppModule { }
