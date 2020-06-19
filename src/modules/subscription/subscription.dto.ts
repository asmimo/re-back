import { ArgsType, InputType, Field, ID, Int } from "type-graphql";
import { IsIn, IsUUID, IsOptional, Min, Max } from "class-validator";
import { DateFilterDTO, PaginationDTO } from "../../utils/global.dto";

@ArgsType()
export class CreateSubscriptionDTO {
  @Field()
  @IsIn(["medium", "large"])
  type: "medium" | "large";

  @Field({ defaultValue: false })
  web: boolean;

  @Field(() => Int)
  @Min(0)
  @Max(12)
  month: number;

  @Field(() => ID)
  @IsUUID()
  organization_id: string;
}

@InputType()
export class SubscriptionFilterDTO extends DateFilterDTO {
  @Field({ nullable: true })
  @IsIn(["medium", "large"])
  @IsOptional()
  type?: "medium" | "large";

  @Field({ nullable: true })
  web?: boolean;

  @Field({ nullable: true })
  expired?: boolean;
}

@ArgsType()
export class SubscriptionPaginationDTO extends PaginationDTO {
  @Field({ defaultValue: "created_at" })
  @IsIn(["type", "web", "expires_on", "created_at", "updated_at"])
  by: string;
}

@ArgsType()
export class UpdateSubscriptionDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsIn(["medium", "large"])
  type: "medium" | "large";

  @Field()
  web: boolean;

  @Field(() => Int, { nullable: true })
  @Min(-3)
  @Max(12)
  month: number;
}
