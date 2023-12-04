import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { IdentityDocumentProps } from './identity-document'
import { AddressProps } from './address'
import { GuardianProps } from './guardian'
import { Optional } from '@/core/types/optional'

export interface MemberProps {
  id: UniqueEntityID
  memberShipNumber?: number
  photoUrl: string
  fullName: string
  genderId: number
  dateOfBirth: Date
  nationalityId: number
  placeOfBirth: string
  contact: string
  email: string
  modalityId: number
  frequencyId: number
  memberTypeId: number
  paymentFrequencyId: number
  termsAndConditions: boolean
  healthDeclaration: boolean
  IdentityDocument: IdentityDocumentProps
  Addess: AddressProps
  Guardian?: GuardianProps
  createdAt: Date
  updatedAt?: Date
}

export class Member extends AggregateRoot<MemberProps> {
  get id() {
    return this.props.id
  }

  get memberShipNumber() {
    return this.props.memberShipNumber
  }

  get photoUrl() {
    return this.props.photoUrl
  }

  set photoUrl(photoUrl: string) {
    this.props.photoUrl = photoUrl
  }

  get fullName() {
    return this.props.fullName
  }

  set fullName(fullName: string) {
    this.props.fullName = fullName
    this.touch()
  }

  get genderId() {
    return this.props.genderId
  }

  set genderId(genderId: number) {
    this.props.genderId = genderId
    this.touch()
  }

  get dateOfBirth() {
    return this.props.dateOfBirth
  }

  set dateOfBirth(dateOfBirth: Date) {
    this.props.dateOfBirth = dateOfBirth
    this.touch()
  }

  get nationalityId() {
    return this.props.nationalityId
  }

  set nationalityId(nationalityId: number) {
    this.props.nationalityId = nationalityId
    this.touch()
  }

  get placeOfBirth() {
    return this.props.placeOfBirth
  }

  set placeOfBirth(placeOfBirth: string) {
    this.props.placeOfBirth = placeOfBirth
    this.touch()
  }

  get contact() {
    return this.props.contact
  }

  set contact(contact: string) {
    this.props.contact = contact
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get modalityId() {
    return this.props.modalityId
  }

  set modalityId(modalityId: number) {
    this.props.modalityId = modalityId
    this.touch()
  }

  get frequencyId() {
    return this.props.frequencyId
  }

  set frequencyId(frequencyId: number) {
    this.props.frequencyId = frequencyId
    this.touch()
  }

  get memberTypeId() {
    return this.props.memberTypeId
  }

  set memberTypeId(memberTypeId: number) {
    this.props.memberTypeId = memberTypeId
    this.touch()
  }

  get paymentFrequencyId() {
    return this.props.paymentFrequencyId
  }

  set paymentFrequencyId(paymentFrequencyId: number) {
    this.props.paymentFrequencyId = paymentFrequencyId
    this.touch()
  }

  get termsAndConditions() {
    return this.props.termsAndConditions
  }

  set termsAndConditions(termsAndConditions: boolean) {
    this.props.termsAndConditions = termsAndConditions
    this.touch()
  }

  get healthDeclaration() {
    return this.props.healthDeclaration
  }

  set healthDeclaration(healthDeclaration: boolean) {
    this.props.healthDeclaration = healthDeclaration
    this.touch()
  }

  get IdentityDocument() {
    return this.props.IdentityDocument
  }

  set IdentityDocument(IdentityDocument: IdentityDocumentProps) {
    this.props.IdentityDocument = IdentityDocument
    this.touch()
  }

  get Addess() {
    return this.props.Addess
  }

  set Addess(Addess: AddressProps) {
    this.props.Addess = Addess
    this.touch()
  }

  get Guardian(): GuardianProps | undefined {
    return this.props.Guardian
  }

  set Guardian(Guardian: GuardianProps) {
    this.props.Guardian = Guardian
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
    props: Optional<MemberProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Member(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
