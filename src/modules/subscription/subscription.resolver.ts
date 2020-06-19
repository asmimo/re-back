import { Resolver, Mutation, Query, Args, Arg, Info } from "type-graphql";
import { Inject } from "typedi";
import { GraphQLResolveInfo } from "graphql";

import { Subscription } from "./subscription.entity";
import { SubscriptionService } from "./subscription.service";
import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  SubscriptionFilterDTO,
  SubscriptionPaginationDTO,
} from "./subscription.dto";
import { IdDto } from "../../utils/global.dto";

@Resolver(() => Subscription)
export class SubscriptionResolver {
  @Inject("SubscriptionService")
  public readonly subscriptionService: SubscriptionService;

  @Mutation(() => Subscription)
  async createSubscription(
    @Args() dto: CreateSubscriptionDTO
  ): Promise<Subscription> {
    return this.subscriptionService.createSubscription(dto);
  }

  @Query(() => Subscription)
  async getSubscription(
    @Args() { id }: IdDto,
    @Info() info: GraphQLResolveInfo
  ): Promise<Subscription> {
    return this.subscriptionService.getSubscription(id, info);
  }

  @Query(() => [Subscription])
  async getSubscriptions(
    @Arg("filter", { nullable: true }) filter: SubscriptionFilterDTO,
    @Args() pagination: SubscriptionPaginationDTO,
    @Info() info: GraphQLResolveInfo
  ): Promise<Subscription[]> {
    return this.subscriptionService.getSubscriptions(filter, pagination, info);
  }

  @Mutation(() => Subscription)
  async updateSubscription(
    @Args() dto: UpdateSubscriptionDTO
  ): Promise<Subscription> {
    return this.subscriptionService.updateSubscription(dto);
  }

  @Mutation(() => Boolean)
  async deleteSubscription(@Args() { id }: IdDto): Promise<boolean> {
    return this.subscriptionService.deleteSubscription(id);
  }
}
