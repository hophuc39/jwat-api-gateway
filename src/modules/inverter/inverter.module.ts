import { Module } from '@nestjs/common';
import { InverterResolver } from './inverter.resolver';

@Module({
  providers: [InverterResolver],
})
export class InverterModule {}
