import { PaginationParams } from '@/core/repositories/pagination-params'
import { MembersRepository } from '@/domain/application/repositories/members-repository'
import { Member } from '@/domain/enterprise/entities/member'

export class InMemoryMemberRepository implements MembersRepository {
  public members: Member[] = []

  async findById(id: string) {
    const member = this.members.find((member) => member.id.toString() === id)

    if (!member) {
      return null
    }

    return member
  }

  async findByMemberShipNumber(memberShipNumber: number) {
    const member = this.members.find(
      (member) => member.memberShipNumber === memberShipNumber,
    )

    if (!member) {
      return null
    }

    return member
  }

  async listMembers(params: PaginationParams) {
    return this.members
  }

  async save(member: Member) {
    const memberIndex = this.members.findIndex((item) => item.id === member.id)

    this.members[memberIndex] = member

    return this.members[memberIndex]
  }

  async create(member: Member) {
    this.members.push(member)

    return member
  }

  async update(member: Member) {
    const memberIndex = this.members.findIndex((item) => item.id === member.id)

    this.members[memberIndex] = member

    return this.members[memberIndex]
  }

  async delete(member: Member) {
    const memberIndex = this.members.findIndex((item) => item.id === member.id)

    this.members.splice(memberIndex, 1)
  }
}
