import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Member } from '@/domain/enterprise/entities/member'

export function makeMember(
  override: Partial<Member> = {},
  id?: UniqueEntityID,
) {
  const memberId = id || new UniqueEntityID()
  const member = Member.create({
    id: memberId,
    memberShipNumber: faker.number.int(),
    photoUrl: faker.image.avatar(),
    fullName: faker.person.fullName(),
    genderId: 1,
    dateOfBirth: faker.date.past(),
    nationalityId: 1,
    placeOfBirth: faker.location.country(),
    contact: faker.helpers.fromRegExp(/^\+3519[1236]\d{7}$/),
    email: faker.internet.email(),
    modalityId: 1,
    frequencyId: 1,
    memberTypeId: 1,
    paymentFrequencyId: 1,
    termsAndConditions: true,
    healthDeclaration: true,
    IdentityDocument: {
      id: new UniqueEntityID(),
      memberId,
      identityDocumentTypeId: 1,
      identificationNumber: faker.helpers.fromRegExp(/^\d{8}$/),
      expireDate: faker.date.future(),
      taxIdentificationNumber: faker.helpers.fromRegExp(/^\d{8}$/),
      createdAt: faker.date.past(),
    },
    Addess: {
      id: new UniqueEntityID(),
      memberId,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      county: faker.location.country(),
      parish: faker.location.county(),
      postalCode: faker.location.zipCode(),
      createdAt: faker.date.past(),
    },
    ...override,
  })

  return member
}
