import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface GuardianProps {
  id: UniqueEntityID
  memberId: UniqueEntityID
  fullName: string
  relationshipDegreeId: number
  contact: string
  address: string
  city: string
  county: string
  parish: string
  postalCode: string
  createdAt: Date
  updatedAt?: Date
}

export class Guardian extends AggregateRoot<GuardianProps> {
  get id() {
    return this.props.id
  }

  get memberId() {
    return this.props.memberId
  }

  get fullName() {
    return this.props.fullName
  }

  set fullName(fullName: string) {
    this.props.fullName = fullName
    this.touch()
  }

  get relationshipDegreeId() {
    return this.props.relationshipDegreeId
  }

  set relationshipDegreeId(relationshipDegreeId: number) {
    this.props.relationshipDegreeId = relationshipDegreeId
    this.touch()
  }

  get contact() {
    return this.props.contact
  }

  set contact(contact: string) {
    this.props.contact = contact
    this.touch()
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
    this.touch()
  }

  get county() {
    return this.props.county
  }

  set county(county: string) {
    this.props.county = county
    this.touch()
  }

  get parish() {
    return this.props.parish
  }

  set parish(parish: string) {
    this.props.parish = parish
    this.touch()
  }

  get postalCode() {
    return this.props.postalCode
  }

  set postalCode(postalCode: string) {
    this.props.postalCode = postalCode
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<GuardianProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Guardian(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
