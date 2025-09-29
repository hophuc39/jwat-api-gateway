import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InverterResolver } from './inverter.resolver';
import { getProtoPath } from 'jwat-protobuf';

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
            protoPath: getProtoPath('INVERTER'),
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
