import { Module } from '@nestjs/common';
import { AfipService } from './afip.service';
import { AfipController } from './afip.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AFIP_SERVICE } from '@/constants/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AFIP_SERVICE.name,
        transport: Transport.TCP,
        options: {
          port: AFIP_SERVICE.port,
          host: AFIP_SERVICE.host,
        },
      },
    ])
  ],
  controllers: [AfipController],
  providers: [AfipService],
  exports: [AfipService],
})
export class AfipModule { }

