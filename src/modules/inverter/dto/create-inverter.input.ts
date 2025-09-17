import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateInverterInput {
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

  @Field()
  useFlag: boolean;
}
