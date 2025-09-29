import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetUserInfoInput {
  @Field()
  id: string;
}
