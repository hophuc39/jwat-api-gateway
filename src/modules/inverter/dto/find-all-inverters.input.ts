import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindAllInvertersInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  pageSize: number;

  @Field({ nullable: true })
  inverterCode?: string;

  @Field({ nullable: true })
  inverterName?: string;

  @Field({ nullable: true })
  useFlag?: boolean;
}
