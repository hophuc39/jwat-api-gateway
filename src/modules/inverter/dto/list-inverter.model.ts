import { Field, ObjectType } from '@nestjs/graphql';
import { InverterModel } from './inverter.model';
import { Pagination } from './pagination.model';

@ObjectType()
export class InverterList {
  @Field(() => [InverterModel])
  items: InverterModel[];

  @Field(() => Pagination)
  pagination: Pagination;
}
