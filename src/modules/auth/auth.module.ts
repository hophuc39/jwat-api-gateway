import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './gql-auth.guard';

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
            protoPath: join(process.cwd(), 'proto/auth.proto'),
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
