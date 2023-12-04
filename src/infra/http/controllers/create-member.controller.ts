import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

const createMemberBodySchema = z.object({
  photoUrl: z.string().nullable().default(null),
  fullName: z.string(),
  genderId: z.coerce.number(),
  dateOfBirth: z.coerce.date(),
  nationalityId: z.number(),
  placeOfBirth: z.string(),
  contact: z.string(),
  email: z.string().email(),
  modalityId: z.coerce.number(),
  frequencyId: z.coerce.number(),
  memberTypeId: z.coerce.number(),
  paymentFrequencyId: z.number(),
  termsAndConditions: z.boolean(),
  healthDeclaration: z.boolean(),
  IdentityDocument: z.object({
    identityDocumentTypeId: z.number(),
    identificationNumber: z.string(),
    expireDate: z.coerce.date(),
    taxIdentificationNumber: z.string(),
  }),
  Address: z.object({
    address: z.string(),
    city: z.string(),
    county: z.string(),
    parish: z.string(),
    postalCode: z.string(),
  }),
  Guardian: z
    .object({
      fullName: z.string(),
      relationshipDegreeId: z.number(),
      contact: z.string(),
      address: z.string(),
      city: z.string(),
      county: z.string(),
      parish: z.string(),
      postalCode: z.string(),
    })
    .nullable()
    .default(null),
})

type CreateMemberBodySchema = z.infer<typeof createMemberBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createMemberBodySchema)

@Controller('/members')
@UseGuards(JwtAuthGuard)
export class CreateMemberController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateMemberBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { email } = body

    // check if member already exists
    const memberExists = await this.prisma.member.findUnique({
      where: {
        email,
      },
    })

    if (memberExists) throw new Error('Member already exists')

    const member = await this.prisma.member.create({
      data: {
        photoUrl: body.photoUrl,
        fullName: body.fullName,
        genderId: body.genderId,
        dateOfBirth: new Date(body.dateOfBirth),
        nationalityId: body.nationalityId,
        placeOfBirth: body.placeOfBirth,
        contact: body.contact,
        email: body.email,
        modalityId: body.modalityId,
        frequencyId: body.frequencyId,
        memberTypeId: body.memberTypeId,
        paymentFrequencyId: body.paymentFrequencyId,
        termsAndConditions: body.termsAndConditions,
        healthDeclaration: body.healthDeclaration,
        createdBy: userId,
        IdentityDocument: {
          create: {
            identityDocumentTypeId:
              body.IdentityDocument.identityDocumentTypeId,
            identificationNumber: body.IdentityDocument.identificationNumber,
            expireDate: new Date(body.IdentityDocument.expireDate),
            taxIdentificationNumber:
              body.IdentityDocument.taxIdentificationNumber,
          },
        },
        Address: {
          create: {
            address: body.Address.address,
            city: body.Address.city,
            county: body.Address.county,
            parish: body.Address.parish,
            postalCode: body.Address.postalCode,
          },
        },
      },
    })

    // check if body contains guardian
    if (body.Guardian) {
      await this.prisma.guardian.create({
        data: {
          fullName: body.Guardian.fullName,
          memberId: member.id,
          relationshipDegreeId: body.Guardian.relationshipDegreeId,
          contact: body.Guardian.contact,
          address: body.Guardian.address,
          city: body.Guardian.city,
          county: body.Guardian.county,
          parish: body.Guardian.parish,
          postalCode: body.Guardian.postalCode,
        },
      })
    }

    return member
  }
}
