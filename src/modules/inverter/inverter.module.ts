import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InverterResolver } from './inverter.resolver';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'INVERTER_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'inverter',
            protoPath: join(process.cwd(), 'proto/inverter.proto'),
            url:
              configService.get<string>('INVERTER_SERVICE_URL') ||
              'localhost:50051',
          },
        }),
      },
    ]),
  ],
  providers: [InverterResolver],
})
export class InverterModule {}
