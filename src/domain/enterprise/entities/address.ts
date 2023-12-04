import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AddressProps {
  id: UniqueEntityID
  memberId: UniqueEntityID
  address: string
  city: string
  county: string
  parish: string
  postalCode: string
  createdAt: Date
  updatedAt?: Date
}

export class Address extends AggregateRoot<AddressProps> {
  get id() {
    return this.props.id
  }

  get memberId() {
    return this.props.memberId
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
