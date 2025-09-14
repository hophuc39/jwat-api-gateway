import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE', // chính là token bạn sẽ inject
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../proto/auth.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [AuthResolver],
})
export class AuthModule {}
