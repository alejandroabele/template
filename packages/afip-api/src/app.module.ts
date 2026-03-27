import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PadronModule } from './modules/padron/padron.module';
import { LoginService } from './services/login/login.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env'
      ],
    }),
    PadronModule
  ],
  controllers: [AppController],
  providers: [AppService, LoginService],
  exports: [],
})
export class AppModule { }
