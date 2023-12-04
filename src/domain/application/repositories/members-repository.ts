import { Member } from '@/domain/enterprise/entities/member'

export interface MembersRepository {
  findById(id: string): Promise<Member | null>
  findByMemberShipNumber(memberShipNumber: string): Promise<Member | null>
  save(member: Member): Promise<Member>
  create(member: Member): Promise<Member>
  update(member: Member): Promise<Member>
  delete(member: Member): Promise<void>
}
