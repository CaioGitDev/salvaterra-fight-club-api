import { PaginationParams } from '@/core/repositories/pagination-params'
import { MembersRepository } from '@/domain/application/repositories/members-repository'
import { Member } from '@/domain/enterprise/entities/member'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMemberRepository implements MembersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        id,
      },
      include: {
        IdentityDocument: true,
        Address: true,
        Guardian: true,
      },
    })

    return null
  }

  async findByMemberShipNumber(
    memberShipNumber: number,
  ): Promise<Member | null> {
    throw new Error('Method not implemented.')
  }

  async listMembers(params: PaginationParams): Promise<Member[]> {
    throw new Error('Method not implemented.')
  }

  async save(member: Member): Promise<Member> {
    throw new Error('Method not implemented.')
  }

  async create(member: Member): Promise<Member> {
    throw new Error('Method not implemented.')
  }

  async update(member: Member): Promise<Member> {
    throw new Error('Method not implemented.')
  }

  async delete(member: Member) {
    throw new Error('Method not implemented.')
  }
}
