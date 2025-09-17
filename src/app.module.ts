import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from './modules/auth/auth.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { InverterModule } from './modules/inverter/inverter.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    InverterModule,
  ],
})
export class AppModule {}
