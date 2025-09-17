import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateInverterInput } from './create-inverter.input';

@InputType()
export class UpdateInverterInput extends PartialType(CreateInverterInput) {
  @Field(() => String)
  id: string;
}
