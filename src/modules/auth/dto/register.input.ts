import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field()
  password: string;
}
