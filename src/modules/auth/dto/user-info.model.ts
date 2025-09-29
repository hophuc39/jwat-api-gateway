import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInfoModel {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => [String])
  permissions: string[];
}
