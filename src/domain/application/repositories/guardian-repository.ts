import { Guardian } from '@/domain/enterprise/entities/guardian'

export interface GuardianRepository {
  findById(id: string): Promise<Guardian | null>
  findByMemberId(memberId: string): Promise<Guardian | null>
  save(guardian: Guardian): Promise<Guardian>
  create(guardian: Guardian): Promise<Guardian>
  update(guardian: Guardian): Promise<Guardian>
  delete(guardian: Guardian): Promise<void>
}
