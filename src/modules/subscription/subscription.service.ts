import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { format, addMonths, parseISO } from "date-fns";
import { GraphQLResolveInfo } from "graphql";

import { Subscription } from "./subscription.entity";
import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  SubscriptionFilterDTO,
  SubscriptionPaginationDTO,
} from "./subscription.dto";
import { OrganizationService } from "../organization/organization.service";
import parseResolve from "../../utils/parseResolve";
import errorHandler from "../../utils/errorHandler";

@Service("SubscriptionService")
export class SubscriptionService {
  @InjectRepository(Subscription)
  protected readonly subscriptionRepo: Repository<Subscription>;
  @Inject("OrganizationService")
  protected readonly organizationService: OrganizationService;

  async createSubscription(dto: CreateSubscriptionDTO): Promise<Subscription> {
    const { type, web, month, organization_id } = dto;
    const subscription = new Subscription();

    const organization = await this.organizationService.getOrganization(
      organization_id
    );
    subscription.type = type;
    subscription.web = web;
    subscription.expires_on = format(
      addMonths(new Date(), month),
      `yyyy-MM-dd`
    );
    subscription.organization = organization;

    try {
      await subscription.save();

      return subscription;
    } catch (error) {
      throw errorHandler({ error });
    }
  }

  async getSubscription(
    id: string,
    info?: GraphQLResolveInfo
  ): Promise<Subscription> {
    const query = this.subscriptionRepo
      .createQueryBuilder("subscription")
      .where(`subscription.id = :id OR subscription.organization_id = :id`, {
        id,
      });

    if (info) {
      const relations = parseResolve(info, ["organization"]);
      relations &&
        relations.map((relation) => {
          query.leftJoinAndSelect(`subscription.${relation}`, relation);
        });
    }

    const subscription = await query.getOne();
    if (!subscription) {
      throw errorHandler({ message: "NOT_FOUND" });
    }

    return subscription;
  }

  async getSubscriptions(
    filter: SubscriptionFilterDTO,
    pagination: SubscriptionPaginationDTO,
    info?: GraphQLResolveInfo
  ): Promise<Subscription[]> {
    const query = this.subscriptionRepo.createQueryBuilder("subscription");

    if (filter) {
      const { type, web, expired, from, to } = filter;

      if (type != null) {
        query.andWhere(`subscription.type = :type`, { type });
      }
      if (expired != null) {
        const now = format(new Date(), `yyyy-MM-dd`);
        const operator = expired ? `<` : `>=`;
        query.andWhere(`subscription.expires_on ${operator} :now`, { now });
      }
      if (web != null) {
        query.andWhere(`subscription.web = :web`, { web });
      }
      if (from || to) {
        const date = {
          from: from
            ? `${format(from, `yyyy-MM-dd`)}T00:00:00.000Z`
            : "2020-01-01T00:00:00.000Z",
          to: to ? `${format(to, `yyyy-MM-dd`)}T23:59:59.999Z` : new Date(),
        };
        query.andWhere(`subscription.created_at BETWEEN :from AND :to`, date);
      }
    }

    const { take, skip, sort, by } = pagination;
    query.take(take).skip(skip).orderBy(`subscription.${by}`, sort);

    if (info) {
      const relations = parseResolve(info, ["organization"]);
      relations &&
        relations.map((relation) => {
          query.leftJoinAndSelect(`subscription.${relation}`, relation);
        });
    }

    return query.getMany();
  }

  async updateSubscription(dto: UpdateSubscriptionDTO): Promise<Subscription> {
    const { id, type, web, month } = dto;
    const subscription = await this.getSubscription(id);

    subscription.type = type;
    subscription.web = web;
    if (month != null) {
      subscription.expires_on = format(
        addMonths(parseISO(subscription.expires_on), month),
        `yyyy-MM-dd`
      );
    }

    try {
      await subscription.save();

      return subscription;
    } catch (error) {
      throw errorHandler({ error });
    }
  }

  async deleteSubscription(id: string): Promise<boolean> {
    try {
      const result = await this.subscriptionRepo.delete(id);

      return result.affected ? true : false;
    } catch (error) {
      throw errorHandler({ error });
    }
  }
}
