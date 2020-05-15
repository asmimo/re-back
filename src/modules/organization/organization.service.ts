import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { startCase } from 'lodash'
import { format } from 'date-fns'
import { GraphQLResolveInfo } from 'graphql'

import { Organization } from './organization.entity'
import {
  CreateOrganizationDTO,
  OrganizationFilterDTO,
  OrganizationPaginationDTO,
  UpdateOrganizationDTO,
} from './organization.dto'
import errorHandler from '../../utils/errorHandler'
import parseResolve from '../../utils/parseResolve'

@Service('OrganizationService')
export class OrganizationService {
  @InjectRepository(Organization)
  protected readonly organizationRepo: Repository<Organization>

  async createOrganization(dto: CreateOrganizationDTO): Promise<Organization> {
    const { name, email, contact, contact1, country, address, address1 } = dto
    const organization = new Organization()

    organization.name = startCase(name)
    organization.email = email
    organization.contact = contact
    organization.contact1 = contact1
    organization.country = country
    organization.address = address
    organization.address1 = address1

    try {
      await organization.save()
      await this.organizationRepo.query(`CREATE DATABASE "${organization.id}"`)
      return organization
    } catch (error) {
      throw errorHandler({ error })
    }
  }

  async getOrganization(id: string, info?: GraphQLResolveInfo): Promise<Organization> {
    const query = this.organizationRepo.createQueryBuilder('organization').where(`organization.id = :id`, { id })

    if (info) {
      const relations = parseResolve(info, ['subscription', 'users'])
      relations &&
        relations.map((relation) => {
          query.leftJoinAndSelect(`organization.${relation}`, relation)
        })
    }

    const organization = await query.getOne()
    if (!organization) {
      throw errorHandler({ message: 'NOT_FOUND' })
    }
    return organization
  }

  async getOrganizations(
    filter: OrganizationFilterDTO,
    pagination: OrganizationPaginationDTO,
    info?: GraphQLResolveInfo,
  ): Promise<Organization[]> {
    const query = this.organizationRepo.createQueryBuilder('organization')

    if (filter) {
      const { name, email, contact, contact1, country, address, address1, active, from, to } = filter

      if (name != null) {
        query.where(`organization.name ILIKE :name`, { name: `%${name}%` })
      }
      if (email != null) {
        query.where(`organization.email ILIKE :email`, { email: `%${email}%` })
      }
      if (contact != null) {
        query.where(`organization.contact ILIKE :contact`, { contact: `%${contact}%` })
      }
      if (contact1 != null) {
        query.where(`organization.contact1 ILIKE :contact1`, { contact1: `%${contact1}%` })
      }
      if (country != null) {
        query.where(`organization.country ILIKE :country`, { country: `%${country}%` })
      }
      if (address != null) {
        query.where(`organization.address ILIKE :address`, { address: `%${address}%` })
      }
      if (address1 != null) {
        query.where(`organization.address1 ILIKE :address1`, { address1: `%${address1}%` })
      }
      if (active != null) {
        query.andWhere(`organization.active = :active`, { active })
      }
      if (from || to) {
        const date = {
          from: from ? `${format(from, `yyyy-MM-dd`)}T00:00:00.000Z` : '2020-01-01T00:00:00.000Z',
          to: to ? `${format(to, `yyyy-MM-dd`)}T23:59:59.999Z` : new Date(),
        }
        query.andWhere(`organization.created_at BETWEEN :from AND :to`, date)
      }
    }

    const { take, skip, sort, by } = pagination
    query.take(take).skip(skip).orderBy(`organization.${by}`, sort)

    if (info) {
      const relations = parseResolve(info, ['subscription', 'users'])
      relations &&
        relations.map((relation) => {
          query.leftJoinAndSelect(`organization.${relation}`, relation)
        })
    }

    try {
      return query.getMany()
    } catch (error) {
      throw errorHandler({ error })
    }
  }

  async updateOrganization(dto: UpdateOrganizationDTO): Promise<Organization> {
    const { id, name, email, contact, contact1, country, address, address1 } = dto
    const organization = await this.getOrganization(id)

    organization.name = startCase(name)
    organization.email = email
    organization.contact = contact
    organization.contact1 = contact1
    organization.country = country
    organization.address = address
    organization.address1 = address1

    try {
      await organization.save()
      return organization
    } catch (error) {
      throw errorHandler({ error })
    }
  }

  async deleteOrganization(id: string): Promise<boolean> {
    try {
      const result = await this.organizationRepo.delete(id)
      if (result.affected === 0) return false

      await this.organizationRepo.query(`DROP DATABASE "${id}"`)
      return true
    } catch (error) {
      throw errorHandler({ error })
    }
  }
}
