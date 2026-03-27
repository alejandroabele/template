import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import configAuth from './config/auth.config';
import { enviroments } from './config/enviroments';
import configSMTP from './config/mail.config';
import { ROUTES } from './main.routes';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ArchivoModule } from './modules/archivo/archivo.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { MensajeModule } from './modules/mensaje/mensaje.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { PlantillaNotificacionModule } from './modules/plantilla-notificacion/plantilla-notificacion.module';
import { EnvioNotificacionModule } from './modules/envio-notificacion/envio-notificacion.module';
import { ConfigModule as ConfiguracionModule } from './modules/config/config.module';
import { EjemploCategoriaModule } from './modules/ejemplo-categoria/ejemplo-categoria.module';
import { EjemploModule } from './modules/ejemplo/ejemplo.module';
import { ExcelExportService } from './services/excel-export/excel-export.service';
import { PdfExportService } from './services/pdf-export/pdf-export.service';
import { ExcelReaderService } from './services/excel-reader/excel-reader.service';
import { EmailService } from './services/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySubscriber } from './subscribers/entity.subscriber';
import { AuditoriaSubscriber } from './subscribers/auditoria.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [configAuth, configSMTP],
      isGlobal: true,
    }),
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
    AuthModule,
    ArchivoModule,
    AuditoriaModule,
    ConfiguracionModule,
    MensajeModule,
    NotificacionModule,
    PlantillaNotificacionModule,
    EnvioNotificacionModule,
    EjemploCategoriaModule,
    EjemploModule,
  ],
  providers: [
    ExcelExportService,
    PdfExportService,
    ExcelReaderService,
    EmailService,
    EntitySubscriber,
    AuditoriaSubscriber,
  ],
})
export class AppModule { }
