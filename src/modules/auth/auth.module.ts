import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { getProtoPath } from 'jwat-protobuf';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: getProtoPath('AUTH'),
            url:
              configService.get<string>('AUTH_SERVICE_URL') ||
              'localhost:50052',
          },
        }),
      },
    ]),
  ],
  providers: [AuthResolver, JwtStrategy, GqlAuthGuard],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
