import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class InverterModel {
  @Field()
  id: string;

  @Field()
  inverterCode: string;

  @Field()
  inverterName: string;

  @Field()
  slaveAddress: string;

  @Field()
  startAddress: string;

  @Field(() => Int)
  numberOfPoles: number;

  @Field(() => Date, { nullable: true })
  updatedDate?: Date;

  @Field(() => Boolean)
  useFlag: boolean;
}
