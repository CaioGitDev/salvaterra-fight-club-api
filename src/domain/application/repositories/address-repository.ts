import { Address } from '@/domain/enterprise/entities/address'

export interface AddressRepository {
  findById(id: string): Promise<Address | null>
  findByMemberId(memberId: string): Promise<Address | null>
  save(address: Address): Promise<Address>
  update(address: Address): Promise<Address>
  delete(address: Address): Promise<void>
}
