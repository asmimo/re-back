import { Resolver, Mutation, Query, Info, Args, Arg } from "type-graphql";
import { Inject } from "typedi";
import { GraphQLResolveInfo } from "graphql";

import { Organization } from "./organization.entity";
import { OrganizationService } from "./organization.service";
import {
  CreateOrganizationDTO,
  OrganizationFilterDTO,
  OrganizationPaginationDTO,
  UpdateOrganizationDTO,
} from "./organization.dto";
import { IdDto } from "../../utils/global.dto";

@Resolver(Organization)
export class OrganizationResolver {
  constructor(
    @Inject("OrganizationService")
    public readonly licenseService: OrganizationService
  ) {}

  @Mutation(() => Organization)
  async createOrganization(
    @Args() dto: CreateOrganizationDTO
  ): Promise<Organization> {
    return this.licenseService.createOrganization(dto);
  }

  @Query(() => Organization)
  async getOrganization(
    @Args() { id }: IdDto,
    @Info() info: GraphQLResolveInfo
  ): Promise<Organization> {
    return this.licenseService.getOrganization(id, info);
  }

  @Query(() => [Organization])
  async getOrganizations(
    @Arg("filter", { nullable: true }) filter: OrganizationFilterDTO,
    @Args() pagination: OrganizationPaginationDTO,
    @Info() info: GraphQLResolveInfo
  ): Promise<Organization[]> {
    return this.licenseService.getOrganizations(filter, pagination, info);
  }

  @Mutation(() => Organization)
  async updateOrganization(
    @Args() dto: UpdateOrganizationDTO
  ): Promise<Organization> {
    return this.licenseService.updateOrganization(dto);
  }

  @Mutation(() => Boolean)
  async deleteOrganization(@Args() { id }: IdDto): Promise<boolean> {
    return this.licenseService.deleteOrganization(id);
  }
}
