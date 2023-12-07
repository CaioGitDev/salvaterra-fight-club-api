// import { UniqueEntityID } from '@/core/entities/unique-entity-id'
// import { Member } from '@/domain/enterprise/entities/member'
// import { Member as PrismaQuestion } from '@prisma/client'
// export class PrismaMemberMapper {
//   static toDomain(raw: PrismaQuestion): Member {
//     return Member.create(
//       {
//         id: new UniqueEntityID(raw.id),
//         memberShipNumber: raw.membershipNumber,
//         photoUrl: raw.photoUrl ?? '',
//         fullName: raw.fullName,
//         genderId: raw.genderId,
//         dateOfBirth: raw.dateOfBirth,
//         nationalityId: raw.nationalityId,
//         placeOfBirth: raw.placeOfBirth,
//         contact: raw.contact,
//         email: raw.email,
//         modalityId: raw.modalityId,
//         frequencyId: raw.frequencyId,
//         memberTypeId: raw.memberTypeId,
//         paymentFrequencyId: raw.paymentFrequencyId,
//         termsAndConditions: raw.termsAndConditions,
//         healthDeclaration: raw.healthDeclaration,

//       },
//       new UniqueEntityID(raw.id),
//     )
//   }
// }
