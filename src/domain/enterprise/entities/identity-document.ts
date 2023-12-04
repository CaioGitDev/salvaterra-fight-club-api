import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface IdentityDocumentProps {
  id: UniqueEntityID
  memberId: UniqueEntityID
  identityDocumentTypeId: number
  identificationNumber: string
  expireDate: Date
  taxIdentificationNumber: string
  createdAt: Date
  updatedAt?: Date
}

export class IdentityDocument extends AggregateRoot<IdentityDocumentProps> {
  get id() {
    return this.props.id
  }

  get memberId() {
    return this.props.memberId
  }

  get identityDocumentTypeId() {
    return this.props.identityDocumentTypeId
  }

  set identityDocumentTypeId(identityDocumentTypeId: number) {
    this.props.identityDocumentTypeId = identityDocumentTypeId
    this.touch()
  }

  get identificationNumber() {
    return this.props.identificationNumber
  }

  set identificationNumber(identificationNumber: string) {
    this.props.identificationNumber = identificationNumber
    this.touch()
  }

  get expireDate() {
    return this.props.expireDate
  }

  set expireDate(expireDate: Date) {
    this.props.expireDate = expireDate
    this.touch()
  }

  get taxIdentificationNumber() {
    return this.props.taxIdentificationNumber
  }

  set taxIdentificationNumber(taxIdentificationNumber: string) {
    this.props.taxIdentificationNumber = taxIdentificationNumber
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<IdentityDocumentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new IdentityDocument(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
