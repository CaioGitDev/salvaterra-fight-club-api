import { IdentityDocument } from '@/domain/enterprise/entities/identity-document'

export interface IdentityDocumentRepository {
  findById(id: string): Promise<IdentityDocument | null>
  findByMemberId(memberId: string): Promise<IdentityDocument | null>
  save(identityDocument: IdentityDocument): Promise<IdentityDocument>
  create(identityDocument: IdentityDocument): Promise<IdentityDocument>
  update(identityDocument: IdentityDocument): Promise<IdentityDocument>
  delete(identityDocument: IdentityDocument): Promise<void>
}
