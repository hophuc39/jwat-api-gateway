import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponseModel {
  @Field()
  token: string;

  @Field()
  userId: string;
}
