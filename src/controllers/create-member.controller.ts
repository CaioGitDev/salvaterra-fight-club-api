import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TokenPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createMemberBodySchema = z.object({
  photoUrl: z.string().nullable().default(null),
  fullName: z.string(),
  gender_id: z.coerce.number(),
  dateOfBirth: z.coerce.date(),
  nationality_id: z.number(),
  placeOfBirth: z.string(),
  contact: z.string(),
  email: z.string().email(),
  modality_id: z.coerce.number(),
  frequency_id: z.coerce.number(),
  memberType_id: z.coerce.number(),
  paymentFrequency_id: z.number(),
  termsAndConditions: z.boolean(),
  healthDeclaration: z.boolean(),
  createdBy: z.string().uuid(),
  identityDocument: z.object({
    identityDocumentType_id: z.number(),
    identificationNumber: z.string(),
    expireDate: z.coerce.date(),
    taxIdentificationNumber: z.coerce.number(),
  }),
  address: z.object({
    address: z.string(),
    city: z.string(),
    county: z.string(),
    parish: z.string(),
    postalCode: z.string(),
  }),
  guardian: z
    .object({
      fullName: z.string(),
      relationshipDegree_id: z.number(),
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

  @Get()
  async getMembers() {
    return this.prisma.member.findMany()
  }

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
        genderId: body.gender_id,
        dateOfBirth: new Date(body.dateOfBirth),
        nationalityId: body.nationality_id,
        placeOfBirth: body.placeOfBirth,
        contact: body.contact,
        email: body.email,
        modalityId: body.modality_id,
        frequencyId: body.frequency_id,
        memberTypeId: body.memberType_id,
        paymentFrequencyId: body.paymentFrequency_id,
        termsAndConditions: body.termsAndConditions,
        healthDeclaration: body.healthDeclaration,
        createdBy: userId,
        IdentityDocument: {
          create: {
            identityDocumentTypeId:
              body.identityDocument.identityDocumentType_id,
            identificationNumber: body.identityDocument.identificationNumber,
            expireDate: new Date(body.identityDocument.expireDate),
            taxIdentificationNumber:
              body.identityDocument.taxIdentificationNumber,
          },
        },
        Address: {
          create: {
            address: body.address.address,
            city: body.address.city,
            county: body.address.county,
            parish: body.address.parish,
            postalCode: body.address.postalCode,
          },
        },
      },
    })

    // check if body contains guardian
    if (body.guardian) {
      await this.prisma.guardian.create({
        data: {
          fullName: body.guardian.fullName,
          memberId: member.id,
          relationshipDegreeId: body.guardian.relationshipDegree_id,
          contact: body.guardian.contact,
          address: body.guardian.address,
          city: body.guardian.city,
          county: body.guardian.county,
          parish: body.guardian.parish,
          postalCode: body.guardian.postalCode,
        },
      })
    }
  }
}
